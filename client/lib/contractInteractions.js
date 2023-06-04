import { ethers, utils } from "ethers"


/**
 * mints a NFT for signer -> approve it for nftMarketplace -> list Item
 * @param {*} gptNftAddress 
 * @param {*} nftAbi 
 * @param {*} signer 
 * @param {*} tokenUri 
 * @returns bool - success or failure
 */
async function mintNftAndListOnMarketplace(marketplaceAddress, nftMarketplaceAbi, gptNftAddress, nftAbi, signer, tokenUri, price) {
    if (typeof window.ethereum !== "undefined") {
        const gptNftContract = new ethers.Contract(gptNftAddress, nftAbi, signer)
        const marketplaceContract = new ethers.Contract(
            marketplaceAddress,
            nftMarketplaceAbi,
            signer
        )
        try {
            console.log(`Minting NFT... @tokenUri = ${tokenUri}`)
            const mintTx = await gptNftContract.mintNft(tokenUri)
            console.log(" ----------->>> [mintNft] Minted successfully tx: ", mintTx)
            const mintTxReceipt = await mintTx.wait(1)
            const tokenId = mintTxReceipt.events[0].args.tokenId
            console.log(" ----------->>> [mintNft] tokenId ", tokenId)
            console.log("Approving NFT...")
            const approvalTx = await gptNftContract.approve(marketplaceAddress, tokenId)
            await approvalTx.wait(1)
            console.log("Listing NFT...")
            const listingTx = await marketplaceContract.listItem(gptNftAddress, tokenId, price)
            await listingTx.wait(1)
            console.log("NFT Listed!")
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    } else {
        console.log("Please install MetaMask")
    }
}

async function getTokenUriFromTokenId(
    gptNftAddress,
    nftAbi,
    signer,
    tokenId
) {
    if (typeof window.ethereum !== "undefined") {
        const gptNftContract = new ethers.Contract(gptNftAddress, nftAbi, signer)
        try {
            console.log("Fetching Token URI...")
            const tokenURI = await gptNftContract.tokenURI(tokenId)
            return tokenURI
        } catch (error) {
            console.log(error)
            return null
        }
    } else {
        console.log("Please install MetaMask")
    }
}

module.exports = {
    mintNftAndListOnMarketplace,
    getTokenUriFromTokenId
}
