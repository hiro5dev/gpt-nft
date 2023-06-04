const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFT Marketplace Unit Tests", () => {
          let nftMarketplace, nftMarketplaceContract, gptnft, gptnftContract
          const URI = "QmfVMAmNM1kDEBYrC2TPzQDoCRFH6F5tE1e9Mr4FkkR5Xr"
          const PRICE = ethers.utils.parseEther("0.1")
          const TOKEN_ID = 1

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              user = accounts[1]
              await deployments.fixture(["all"])
              nftMarketplaceContract = await ethers.getContract("NftMarketplace")
              nftMarketplace = nftMarketplaceContract.connect(deployer)
              gptnftContract = await ethers.getContract("GptNft")
              gptnft = await gptnftContract.connect(deployer)
              await gptnft.mintNft(URI)
              await gptnft.approve(nftMarketplaceContract.address, TOKEN_ID)
          })

          describe("Test for listItem", () => {
              it("Updates listing with seller and price", async () => {
                  await nftMarketplace.listItem(gptnft.address, TOKEN_ID, PRICE)
                  const listing = await nftMarketplace.getListing(gptnft.address, TOKEN_ID)
                  assert(listing.price.toString() == PRICE.toString())
                  assert(listing.seller.toString() == deployer.address)
              })
              it("Emits an item after listing an event", async () => {
                  expect(await nftMarketplace.listItem(gptnft.address, TOKEN_ID, PRICE)).to.emit(
                      nftMarketplaceContract,
                      "ItemListed"
                  )
              })
              it("exclusively items that haven't been listed", async () => {
                  await nftMarketplace.listItem(gptnft.address, TOKEN_ID, PRICE)
                  const error = `NftMarketplace__AlreadyListed("${gptnft.address}", ${TOKEN_ID})`
                  await expect(
                      nftMarketplace.listItem(gptnft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith(error)
              })
              it("exclusively allows owners to list", async () => {
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  await gptnft.approve(user.address, TOKEN_ID)
                  await expect(
                      nftMarketplace.listItem(gptnft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NftMarketplace__NotOwner")
              })
              it("needs approvals to list item", async () => {
                  await gptnft.approve(ethers.constants.AddressZero, TOKEN_ID)
                  await expect(
                      nftMarketplace.listItem(gptnft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NftMarketplace__NotApprovedForMarketplace")
              })
              it("reverts with price <= 0", async () => {
                  await expect(
                      nftMarketplace.listItem(gptnft.address, TOKEN_ID, 0)
                  ).to.be.revertedWith("NftMarketplace__PriceMustBeAboveZero")
              })
          })

          describe("cancelListing", () => {
              it("emits event and removes listing", async () => {
                  await nftMarketplace.listItem(gptnft.address, TOKEN_ID, PRICE)
                  expect(await nftMarketplace.cancelListing(gptnft.address, TOKEN_ID)).to.emit(
                      "ItemCanceled"
                  )
                  const listing = await nftMarketplace.getListing(gptnft.address, TOKEN_ID)
                  assert(listing.price.toString() == "0")
              })

              it("reverts if there is no listing", async () => {
                  const error = `NftMarketplace__NotListed("${gptnft.address}", ${TOKEN_ID})`
                  await expect(
                      nftMarketplace.cancelListing(gptnft.address, TOKEN_ID)
                  ).to.be.revertedWith(error)
              })
              it("reverts if anyone but the owner tries to call", async () => {
                  await nftMarketplace.listItem(gptnft.address, TOKEN_ID, PRICE)
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  await gptnft.approve(user.address, TOKEN_ID)
                  await expect(
                      nftMarketplace.cancelListing(gptnft.address, TOKEN_ID)
                  ).to.be.revertedWith("NftMarketplace__NotOwner")
              })
          })
          describe("updateListing", () => {
              it("updates the price of the item", async () => {
                  const updatedPrice = ethers.utils.parseEther("0.2")
                  await nftMarketplace.listItem(gptnft.address, TOKEN_ID, PRICE)
                  expect(
                      await nftMarketplace.updateListing(gptnft.address, TOKEN_ID, updatedPrice)
                  ).to.emit("ItemListed")
                  const listing = await nftMarketplace.getListing(gptnft.address, TOKEN_ID)
                  assert(listing.price.toString() == updatedPrice.toString())
              })
              it("must be owner and listed", async () => {
                  await expect(
                      nftMarketplace.updateListing(gptnft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NotListed")
                  await nftMarketplace.listItem(gptnft.address, TOKEN_ID, PRICE)
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  await expect(
                      nftMarketplace.updateListing(gptnft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NftMarketplace__NotOwner")
              })
              it("reverts with price <= 0", async () => {
                  await nftMarketplace.listItem(gptnft.address, TOKEN_ID, PRICE)
                  await expect(
                      nftMarketplace.updateListing(gptnft.address, TOKEN_ID, 0)
                  ).to.be.revertedWith("NftMarketplace__PriceMustBeAboveZero")
              })
          })
          describe("buyItem", () => {
              it("transfers the nft to the buyer and updates internal proceeds record", async () => {
                  await nftMarketplace.listItem(gptnft.address, TOKEN_ID, PRICE)
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  expect(
                      await nftMarketplace.buyItem(gptnft.address, TOKEN_ID, { value: PRICE })
                  ).to.emit("ItemBought")
                  const newOwner = await gptnft.ownerOf(TOKEN_ID)
                  const deployerProceeds = await nftMarketplace.getProceeds(deployer.address)
                  assert(newOwner.toString() == user.address)
                  assert(deployerProceeds.toString() == PRICE.toString())
              })
              it("reverts if the item isnt listed", async () => {
                  await expect(nftMarketplace.buyItem(gptnft.address, TOKEN_ID)).to.be.revertedWith(
                      "NftMarketplace__NotListed"
                  )
              })
              it("reverts if the price isnt met", async () => {
                  await nftMarketplace.listItem(gptnft.address, TOKEN_ID, PRICE)
                  const error = `NftMarketplace__PriceNotMet("${gptnft.address}", ${TOKEN_ID}, 100000000000000000)`
                  await expect(nftMarketplace.buyItem(gptnft.address, TOKEN_ID)).to.be.revertedWith(
                      error
                  )
              })
          })
          describe("withdrawProceeds", () => {
              it("withdraws proceeds", async () => {
                  await nftMarketplace.listItem(gptnft.address, TOKEN_ID, PRICE)
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  await nftMarketplace.buyItem(gptnft.address, TOKEN_ID, { value: PRICE })
                  nftMarketplace = nftMarketplaceContract.connect(deployer)

                  const deployerProceedsBefore = await nftMarketplace.getProceeds(deployer.address)
                  const deployerBalanceBefore = await deployer.getBalance()
                  const txResponse = await nftMarketplace.withdrawProceeds()
                  const transactionReceipt = await txResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const deployerBalanceAfter = await deployer.getBalance()

                  assert(
                      deployerBalanceAfter.add(gasCost).toString() ==
                          deployerProceedsBefore.add(deployerBalanceBefore).toString()
                  )
              })
              it("doesn't allow 0 proceed withdrawls", async () => {
                  await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith(
                      "NftMarketplace__NoProceeds"
                  )
              })
          })
      })
