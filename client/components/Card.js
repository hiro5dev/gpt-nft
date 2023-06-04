import React, { useState, useEffect } from "react"
import Image from "next/image"

import { getTokenUriFromTokenId } from "@/lib/contractInteractions"
import nftAbi from "../constants/GptNft.json"
import networkMapping from "../constants/networkMapping.json"
import { useAuth } from "@/context/auth"

import imagePlaceholder from "@/assets/nft-image-placeholder.png"
import Button from "@/components/Button"


const Card = ({
    price,
    nftAddress,
    tokenId,
    seller,
    blockNumber,
    blockTimestamp,
    transactionHash,
}) => {
    const { chainId, signer } = useAuth()
    const gptNftAddress = "0xb80251dE1fa6d389538E33D192FaeeBc090C755e"
    // const gptNftAddress = networkMapping[chainId].GptNft[0] // "0xb80251dE1fa6d389538E33D192FaeeBc090C755e"

// 
    const [tokenUri, setTokenUri] = useState("")
    const [nftData, setNftData] = useState(null)
    const [imageSrc, setImageSrc] = useState("/assets/nft-image-placeholder.png")

    const updateCard = async () => {
        let uri = await getTokenUriFromTokenId(gptNftAddress, nftAbi, signer, tokenId)

        uri = uri.replace("https://ipfs.io/ipfs/https://ipfs.io/ipfs/", "https://ipfs.io/ipfs/")
        uri = uri.replace("https://ipfs.io/ipfs/ipfs://", "https://ipfs.io/ipfs/")
        console.log(`tokenId : [${tokenId}]>>>>>>>>>>> uri[after] : ${uri}`)
        setTokenUri(uri)
        const data = await fetch(uri)
        console.log(`tokenId : [${tokenId}]>>>>>>>>>>> data : ${data}`)
        const json = await data.json()

        setNftData(json)
        let img = json?.image
        img = img.replace("ipfs://", "https://ipfs.io/ipfs/")
        setImageSrc(img)
        console.log(`tokenId : [${tokenId}]>>>>>>>>>>> img : ${img}`)
    }

    useEffect(() => {
        updateCard()
    }, [])
    return (
        <div className="relative rounded-3xl overflow-hidden cursor-pointer transition ease-in-out delay-50 drop-shadow-md hover:drop-shadow-xl hover:-translate-y-1 hover:scale-105 duration-300 bg-gradient-to-tl from-slate-200 via-sky-50 to-slate-50 hover:bg-white dark:bg-gradient-to-tl dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-600 dark:hover:bg-gradient-to-tl dark:hover:from-zinc-800 dark:hover:via-zinc-700 dark:hover:to-zinc-500">
            <Image
                className="w-full h-50 object-cover"
                src={imageSrc}
                alt=""
                width={50}
                height={50}
            />

            <div className="px-6 py-2">
                <div className="font-medium text-md mb-2 text-dark-800 dark:text-gray-300">
                    {nftData ? <h2>{nftData?.name}</h2> : ""}
                </div>
                <p className="text-gray-500 text-xs">{seller}</p>
                <p className="text-gray-500 text-xs">{nftData?.description}</p>
            </div>
            <div className="px-3 py-4 flex justify-between items-center">
                <Button btnColor={"yellow"} btnText={"Buy"} />
                <Button btnColor={"teal"} btnText={"Details"} />
            </div>
        </div>
    )
}

export default Card
