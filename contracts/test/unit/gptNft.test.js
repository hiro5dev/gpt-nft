const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("GPT NFT Unit Tests", () => {
          let gptNft, deployer
          const URI = "QmfVMAmNM1kDEBYrC2TPzQDoCRFH6F5tE1e9Mr4FkkR5Xr"
          const baseUri = "https://ipfs.io/ipfs/"
          const TOKEN_ID = 1

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["gptnft"])
              gptNft = await ethers.getContract("GptNft")
          })

          describe("Constructor", () => {
              it("Initializes the NFT Correctly.", async () => {
                  const name = await gptNft.name()
                  const symbol = await gptNft.symbol()
                  const tokenCounter = await gptNft.getTokenCounter()
                  assert.equal(name, "GptNft")
                  assert.equal(symbol, "GFT")
                  assert.equal(tokenCounter.toString(), "0")
              })
          })

          describe("Mint NFT", () => {
              beforeEach(async () => {
                  const txResponse = await gptNft.mintNft(URI)
                  await txResponse.wait(1)
              })
              it("Allows users to mint an NFT, and updates token counter", async () => {
                  let tokenCounter = await gptNft.getTokenCounter()
                  assert.equal(tokenCounter.toString(), "1")

                  await gptNft.mintNft(URI)
                  tokenCounter = await gptNft.getTokenCounter()

                  assert.equal(tokenCounter.toString(), "2")
              })
              it("creates the NFT and emits an event", async () => {
                  await expect(gptNft.mintNft(URI)).to.emit(gptNft, "NftMinted")
              })
              it("returns token URI object as string", async () => {
                  const tokenUri = await gptNft.tokenURI(1)
                  assert.equal(tokenUri, baseUri + URI)
              })

              it("reverts with error - GptNftMetadata__URI_QueryFor_NonExistentToken when tokenId doesnt exist", async () => {
                  await expect(gptNft.tokenURI(42)).to.be.revertedWith(
                      "GptNftMetadata__URI_QueryFor_NonExistentToken"
                  )
              })
          })

          describe("Test for tokenURI", () => {
              beforeEach(async () => {
                  const txResponse = await gptNft.mintNft(URI)
                  await txResponse.wait(1)
              })
              it("Returns the URI of the specified token", async () => {
                  await gptNft.mintNft(URI)
                  const tokenUri = await gptNft.tokenURI(TOKEN_ID)
                  assert.equal(tokenUri, baseUri + URI)
              })
              it("Throws an error if the token doesn't exist", async () => {
                  await expect(gptNft.tokenURI(TOKEN_ID+1)).to.be.revertedWith(
                      "GptNftMetadata__URI_QueryFor_NonExistentToken"
                  )
              })
          })

          describe("Test for getTokenCounter", () => {
              it("Returns the current value of the token counter", async () => {
                  await gptNft.mintNft(URI)
                  const tokenCounter = await gptNft.getTokenCounter()
                  assert.equal(tokenCounter.toString(), "1")
              })
          })

        //   describe("Test for _burn", () => {
        //       it("Removes the specified token ID from the owner's balance", async () => {
        //           assert((await gptNft.ownerOf(TOKEN_ID)) == deployer.address)
        //           await gptNft._burn(TOKEN_ID)
        //           assert(await gptNft.ownerOf(TOKEN_ID), address(0))
        //       })
        //       it("Emits a Transfer event", async () => {
        //           expect(await gptNft._burn(TOKEN_ID)).to.emit(gptNft, "Transfer")
        //       })
        //   })
      })
