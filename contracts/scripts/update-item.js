const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const TOKEN_ID = 0
const PRICE = ethers.utils.parseEther("0.1")

async function update() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const gptNFT = await ethers.getContract("GptNft")
    const tx = await nftMarketplace.updateListing(gptNFT.address, TOKEN_ID, PRICE)
    await tx.wait(1)
    console.log("NFT updated!")
    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
    //TODO:
}

update()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
