import React, { useState } from "react"
import { useQuery } from "@apollo/client"

import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import Card from "@/components/Card"

const { NFTStorage, File } = require("nft.storage")
const NEXT_PUBLIC_NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY

const Gallery = ({chainId, signer}) => {
    const [isChecked, setIsChecked] = useState(false)
    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)
    

    const handleChange = (event) => {
        setIsChecked(event.target.checked)
    }
    return (
        <div className="relative min-h-screen w-full flex flex-col">
            <div className="">
                <div className="flex items-center py-2 text-xs text-zinc-800 dark:text-zinc-400">
                    <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={isChecked}
                        onChange={handleChange}
                    />
                    <label className="ml-2">Show only my items</label>
                </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-5">
                {loading || !listedNfts ? (
                <div> Fetching....</div>
            ) : (
                listedNfts.activeItems.map((nft) => {
                    const {
                        price,
                        nftAddress,
                        tokenId,
                        seller,
                        blockNumber,
                        blockTimestamp,
                        transactionHash,
                    } = nft
                    return (
                        <Card
                            price = {price}
                            nftAddress = {nftAddress}
                            tokenId = {tokenId}
                            seller = {seller}
                            blockNumber = {blockNumber}
                            blockTimestamp = {blockTimestamp}
                            transactionHash = {transactionHash}
                        />
                    )
                })
            )}
            </div>
        </div>
    )
}

export default Gallery
