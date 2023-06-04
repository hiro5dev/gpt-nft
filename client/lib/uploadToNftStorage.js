const { NFTStorage, File } = require("nft.storage")

const NEXT_PUBLIC_NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY


async function getRemotePngAsFile(url) {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const blob = new Blob([new Uint8Array(arrayBuffer)], { type: "image/png" })
    return new File([blob], "image.png", { type: "image/png" })
}

/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {string} imagePath the path to an image file
 * @param {string} name a name for the NFT
 * @param {string} description a text description for the NFT
 */
async function uploadNFTToIPFS(title, price, imageUrl) {
    const imageFile = await getRemotePngAsFile(imageUrl)

    const nftstorage = new NFTStorage({ token: NEXT_PUBLIC_NFT_STORAGE_KEY })
    console.log(`Uploading NFT to IPFS with title: ${title}, price: ${price}, image: ${imageUrl}`)
    // @dev: these keys cannot be changed for nftStorage. Have to handle them in UI
    const response = await nftstorage.store({
        image: imageFile,
        name: title,
        description: price.toString(),
    })

    const { nft, url } = response
    console.log(`Uploading DONE: url = ${url}`)
    /* 
        original URL: ipfs://bafyreibqwyckt5zqj2l3svnccy4wodtbdw2duei4rk7yqmhda42rp2kqq4/metadata.json
        convert it to: https://ipfs.io/ipfs/bafyreibqwyckt5zqj2l3svnccy4wodtbdw2duei4rk7yqmhda42rp2kqq4/metadata.json
        
        const genericUrl = url.replace("ipfs://", "https://ipfs.io/ipfs/")
        ===> not required as _baseUrl() in nft contract takes care of that while fetching the url
        */

    return url
}

module.exports = {
    uploadNFTToIPFS,
}
