const { frontEndContractsFile, frontEndAbiLocation } = require("../helper-hardhat-config")
require("dotenv").config()
const fs = require("fs")
const { network } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("\n========================= Front end written! =========================\n")
    }
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const basicNft = await ethers.getContract("GptNft")
    fs.writeFileSync(
        `${frontEndAbiLocation}GptNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )

    const simpleStorage = await ethers.getContract("SimpleStorage")
    fs.writeFileSync(
        `${frontEndAbiLocation}SimpleStorage.json`,
        simpleStorage.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    console.log("updating contract address for chainID: ", chainId)
    const nftMarketplace = await ethers.getContract("NftMarketplace")

    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NftMarketplace"].includes(nftMarketplace.address)) {
            contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address)
        }
    } else {
        contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.address] }
    }

    const basicNft = await ethers.getContract("GptNft")
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["GptNft"].includes(basicNft.address)) {
            contractAddresses[chainId]["GptNft"].push(basicNft.address)
        }
    } else {
        contractAddresses[chainId] = { GptNft: [basicNft.address] }
    }

    const simpleStorage = await ethers.getContract("SimpleStorage")
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["SimpleStorage"].includes(simpleStorage.address)) {
            contractAddresses[chainId]["SimpleStorage"].push(simpleStorage.address)
        }
    } else {
        contractAddresses[chainId] = { SimpleStorage: [simpleStorage.address] }
    }

    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
