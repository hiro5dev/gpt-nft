import React, { useState } from "react"
import { ethers, utils } from "ethers"

import { uploadNFTToIPFS } from "@/lib/uploadToNftStorage"
import { mintNftAndListOnMarketplace } from "@/lib/contractInteractions"

const { NFTStorage, File } = require("nft.storage")
const NEXT_PUBLIC_NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY

import nftAbi from "../constants/GptNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import networkMapping from "../constants/networkMapping.json"

const MintAndList = (props) => {
    const { isConnected, hasMetamask, currentAccount, signer, chainId } = props
    // TODO: generate Image & set uri dynamically
    const URI =
        "https://replicate.delivery/pbxt/PzAfLIzVzfrVK08E55g7LRyGePHR38tp6W2emnEiuVCF27ZCB/out-0.png"

    const [title, setTitle] = useState("")
    const [price, setPrice] = useState(0.05)
    const [uri, setUri] = useState(URI)

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log("Form submitted:", { title, price, uri })
        console.log(
            `%%%%%%%%%%%%%%%%% isConnected : ${isConnected}, hasMetamask : ${hasMetamask}, currentAccount : ${currentAccount}, signer : ${signer} `
        )

        const priceInEth = utils.parseUnits(price.toString(), "ether").toString()
        console.log(` >>>>>>>> priceInEth : `, priceInEth)
        /*
        // 0. generate an image from given title & use that uri here //TODO: autofill uri
        //✅  1. upload this metadata.json to IPFS => IPFS_URL
        //✅ 2. gptNFT.mintNft(IPFS_URL)
            * get nft address
            * get token ID
        //✅ 3. Approve Nft for this account 
        //✅ 4. nftMarketplace.listItem(gptNFT.address, tokenId, PRICE)
        */

        const tokenUri = await uploadNFTToIPFS(title, priceInEth, uri)
        console.log(">>>>>>>>>>>>>> tokenUri = ", tokenUri)

        // mint nft
        const gptNftAddress = networkMapping[chainId].GptNft[0] // "0xb80251dE1fa6d389538E33D192FaeeBc090C755e" 
        const marketplaceAddress = networkMapping[chainId].NftMarketplace[0] // "0xFdBD9C6f07C8EB11A37ef3E6A51010a8b5000606" 
        console.log(`gptNftAddress = ${gptNftAddress} .............................`)
        console.log(`marketplaceAddress = ${marketplaceAddress} .............................`)
        if (hasMetamask && isConnected && signer) {
            console.log(`....Minting NFT for tokenUri= ${tokenUri}`)
            const responseMintAndList = await mintNftAndListOnMarketplace(
                marketplaceAddress,
                nftMarketplaceAbi,
                gptNftAddress,
                nftAbi,
                signer,
                tokenUri,
                priceInEth
            )
            console.log(`Minted & Listed Successfully`)
            return true
        } else {
            alert("Please connect your wallet first")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-lg font-medium mb-4">Form</h1>
            <div className="mb-4">
                <label htmlFor="name" className="block font-medium mb-2">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded-lg w-full"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="name" className="block font-medium mb-2">
                    Image URI
                </label>
                <input
                    id="uri"
                    type="text"
                    value={uri}
                    // onChange={(e) => setUri(e.target.value)} //TODO: uncomment me!
                    className="border p-2 rounded-lg w-full"
                />
            </div>
            <div className="mb-4 flex items-center">
                <label htmlFor="number" className="block font-medium mb-2">
                    Price(ETH)
                </label>
                <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border p-2 rounded-lg w-20 mx-4 text-center"
                />
            </div>
            <button className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600">
                Mint & List NFT
            </button>
        </form>
    )
}

export default MintAndList
