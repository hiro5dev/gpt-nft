import { useSearch } from "@/context/search"
import { useAuth } from "@/context/auth"
import { useQuery } from "@apollo/client"

import Header from "@/components/Header"
import Main from "@/components/Main"
import Footer from "@/components/Footer"
import FormPopup from "@/components/FormPopup"
import ImageGenerator from "../components/ImageGenerator"

import { getDefaultProvider } from "ethers"

import nftAbi from "../constants/GptNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import simpleStorageAbi from "../constants/SimpleStorage.json"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"

import { ethers, utils } from "ethers"
import { useEffect, useState } from "react"

const { NFTStorage, File } = require("nft.storage")
const NEXT_PUBLIC_NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY

const style = {
    wrapper: `h-100vh w-100vw select-none flex flex-col bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-rose-100 via-sky-100 to-white dark:bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] dark:from-[#2c2203] dark:via-gray-900 dark:to-black`,
}

// const Home = () => {
//     const { search, onSearch } = useSearch()
//     const { currentAccount, connectWallet, hasMetamask, isConnected } = useAuth()

//     return (
//         <div className={style.wrapper}>
//             {/* <Header
//                 onSearch={onSearch}
//                 search={search}
//                 currentAccount={currentAccount}
//                 connectWallet={connectWallet}
//             />
//             <Main />
//             <Footer />
//             <FormPopup>
//                 <form>
//                     <input type="text" placeholder="Name" className="p-2 rounded" />
//                     <input type="email" placeholder="Email" className="p-2 rounded" />
//                     <button className="btn bg-yellow text-zinc-800 rounded">Submit</button>
//                 </form>
//             </FormPopup>
//             <ImageGenerator /> */}
//         </div>
//     )
// }

const Home = () => {
    const [isConnected, setIsConnected] = useState(false)
    const [hasMetamask, setHasMetamask] = useState(false)
    const [currentAccount, setCurrentAccount] = useState()
    const [signer, setSigner] = useState(undefined)
    const [accountBalance, setAccountBalance] = useState(0)

    const [favoriteNumber, setFavoriteNumber] = useState(0)
    const [nftTokenCounter, setNftTokenCounter] = useState(0)

    const [ipfsUrl, setIpfsUrl] = useState(null)
    const [nftData, setNftData] = useState(null)

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    const chainId = ""
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const gptNftAddress = networkMapping[chainString].GptNft[0]
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[1]
    const simpleStorageAddress = networkMapping[chainString].SimpleStorage[0]

    const [chainId1, setChainId1] = useState("31337")

    const checkIfWalletIsConnected = async () => {
        try {
            if (typeof window.ethereum === "undefined") return alert("Please1 install metamask ")
            setHasMetamask(true)
            const accounts = await ethereum.request({ method: "eth_accounts" })

            if (accounts.length) {
                setCurrentAccount(accounts[0])
                
                setIsConnected(true)
            }
        } catch (error) {
            console.error(error)
            throw new Error("No ethereum object.")
        }
    }
    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])


    // useEffect(() => {
    //     if (typeof window.ethereum !== "undefined") {
    //         setHasMetamask(true)
    //     }
    // })

    async function getRemotePngAsFile(url) {
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        const blob = new Blob([new Uint8Array(arrayBuffer)], { type: "image/png" })
        return new File([blob], "image.png", { type: "image/png" })
    }

    async function storeNFT() {
        const imageUrl =
            "https://ipfs.io/ipfs/bafybeibd3nuryjpflpvftsx5ps3d4rr4qjp63xtedtigtjfu7cgtj7o24e/headshot.png"
        const imageFile = await getRemotePngAsFile(imageUrl)

        const nftstorage = new NFTStorage({ token: NEXT_PUBLIC_NFT_STORAGE_KEY })
        console.log(`Uploading test-image to IPFS!`)
        const response = await nftstorage.store({
            image: imageFile,
            name: "test-name",
            description: "test-description",
        })

        const { nft, url } = response
        console.log(`Uploading DONE: nft = ${nft}`)
        console.log(`Uploading DONE: url = ${url}`)
        /* 
        original URL: ipfs://bafyreibqwyckt5zqj2l3svnccy4wodtbdw2duei4rk7yqmhda42rp2kqq4/metadata.json
        convert it to: https://ipfs.io/ipfs/bafyreibqwyckt5zqj2l3svnccy4wodtbdw2duei4rk7yqmhda42rp2kqq4/metadata.json
        */
        const genericUrl = url.replace("ipfs://", "https://ipfs.io/ipfs/")
        setIpfsUrl(genericUrl)
        console.log("=============>>>>>>>>>>>>> url: ", genericUrl)

        const data = await fetch(genericUrl)
        console.log("=============>>>>>>>>>>>>> data: ", data)
        const json = await data.json()
        console.log("=============>>>>>>>>>>>>> json: ", json)
        setNftData(json)
    }

    async function connect() {
        if (typeof window.ethereum !== "undefined") {
            try {
                await ethereum.request({ method: "eth_requestAccounts" })
                setIsConnected(true)
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                console.log(">>>>>>>>>>>>>. signer: ", provider.getSigner())
                setSigner(provider.getSigner())

                const accounts = await ethereum.request({
                    method: "eth_requestAccounts",
                })
                if (accounts.length) {
                    setIsConnected(true)
                    setCurrentAccount(accounts[0])
                    console.log(">>>>>>>>>>>>>. currentAccount: ", accounts[0])
                }

                const { chainId } = await provider.getNetwork()
                console.log(">>>>>>>>>>>>>. chainId: ", chainId)
                console.log("signer: ", provider.getSigner())
                if (chainId) {
                    setChainId1(parseInt(chainId).toString())
                }
                console.log(">>>>>>>>>>>>>.: chainId1", parseInt(chainId).toString())

                const balance = await provider.getBalance("ethers.eth")
                const balanceInEth = utils.formatEther(balance)
                console.log(">> Balance of this account: ", balanceInEth)
                setAccountBalance(balanceInEth.toString())
            } catch (e) {
                console.log(e)
            }
        } else {
            setIsConnected(false)
        }
    }

    async function mintNft() {
        if (typeof window.ethereum !== "undefined") {
            const gptNftAddressContract = new ethers.Contract(gptNftAddress, nftAbi, signer)
            console.log(" ..... gptNftAddressContract: ", gptNftAddressContract)
            try {
                const tx = await gptNftAddressContract.mintNft("some.random.image.uri")
                console.log(" ----------->>> [mintNft] Minted successfully tx: ", tx)
                console.log(" ----------->>> [mintNft] Emitted events: ", tx.events)

                const tokenURI = await gptNftAddressContract.tokenURI(1)
                console.log(" ----------->>> [tokenURI] tokenURI(1): ", tokenURI)
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask#2")
        }
    }

    async function executeGetTokenCounter() {
        if (typeof window.ethereum !== "undefined") {
            const gptNftAddressContract = new ethers.Contract(gptNftAddress, nftAbi, signer)
            console.log(" ..... gptNftAddressContract: ", gptNftAddressContract)
            try {
                const tx = await gptNftAddressContract.getTokenCounter()
                console.log(
                    " ----------->>> [executeGetTokenCounter] tx: ",
                    ethers.utils.formatEther(tx)
                )
                setNftTokenCounter(ethers.utils.formatEther(tx))
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask#2")
        }
    }

    async function execute() {
        if (typeof window.ethereum !== "undefined") {
            const dummyAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
            console.log("execute >> signer: ", signer)
            const simpleStorageContract = new ethers.Contract(
                simpleStorageAddress,
                simpleStorageAbi,
                signer
            )

            const marketplaceAddressContract = new ethers.Contract(
                marketplaceAddress,
                nftMarketplaceAbi,
                signer
            )
            console.log(" ..... marketplaceAddressContract: ", marketplaceAddressContract)
            console.log(" ..... simpleStorageContract: ", simpleStorageContract)
            try {
                // const listings = await marketplaceAddressContract.getListing(dummyAddress, 1)
                // const tx = await marketplaceAddressyContract.getProceeds(currentAccount)
                const tx = await simpleStorageContract.store(42)
                console.log(" ----------->>> tx: ", tx)
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask#2")
        }
    }

    const retrieve = async () => {
        if (typeof window.ethereum !== "undefined") {
            const simpleStorageContract = new ethers.Contract(
                simpleStorageAddress,
                simpleStorageAbi,
                signer
            )
            try {
                const result = await simpleStorageContract.retrieve()
                console.log(" result : ", result)
                setFavoriteNumber(ethers.utils.formatEther(result))
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask#3")
        }
    }

    //TODO: remove these-dont work

    const { search, onSearch } = useSearch()
    // const { currentAccount, connectWallet } = useAuth()

    return (
        <div>
            <Header
                onSearch={onSearch}
                search={search}
                // currentAccount={currentAccount}
                // connectWallet={connectWallet}
            />
            {hasMetamask ? (
                isConnected ? (
                    "Connected! "
                ) : (
                    <button onClick={() => connect()}>Connect</button>
                )
            ) : (
                "Please install metamask"
            )}
            <br></br>
            {isConnected ? <button onClick={() => execute()}>Execute</button> : "  "}
            {isConnected ? (
                favoriteNumber !== 0 ? (
                    <div>favoriteNumber = {favoriteNumber} </div>
                ) : (
                    <button onClick={() => retrieve()}>Retrieve</button>
                )
            ) : (
                ""
            )}
            <br></br>
            {/* interact with gptNft contract */}
            {isConnected ? <button onClick={() => mintNft()}>Mint NFT</button> : "  "}
            {isConnected ? (
                nftTokenCounter !== 0 ? (
                    <div>nftTokenCounter = {nftTokenCounter}</div>
                ) : (
                    <button onClick={() => executeGetTokenCounter()}>
                        gptNft.getTokenCounter()
                    </button>
                )
            ) : (
                ""
            )}
            <button onClick={() => storeNFT()}>Upload to IPFS</button>
            {ipfsUrl ? (
                <div>
                    IPFS URL: {ipfsUrl}
                    {nftData?.name ? <div>NFT.name = {nftData.name}</div> : ""}
                    {nftData?.description ? <div>NFT.description = {nftData.description}</div> : ""}
                    {nftData?.image ? (
                        <img src={nftData.image.replace("ipfs://", "https://ipfs.io/ipfs/")} />
                    ) : (
                        // <img src = "https://ipfs.io/ipfs/QmSsYRx3LpDAb1GZQm7zZ1AuHZjfbPkD6J7s9r41xu1mf8"/>
                        ""
                    )}
                </div>
            ) : (
                ""
            )}
            {/* fetch active items from the-graph */}
            <div>
                <b>Active Items From the graph : </b>
            </div>
            {loading || !listedNfts ? (
                <div> Fetching....</div>
            ) : (
                listedNfts.activeItems.map((nft) => {
                    console.log(`NFT : ${nft}`)
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
                        <div>
                            <ul>
                                <li> - price : {price}</li>
                                <li> - nftAddress : {nftAddress}</li>
                                <li> - tokenId : {tokenId}</li>
                                <li> - seller : {seller}</li>
                                <li> - blockNumber : {blockNumber}</li>
                                <li> - blockTimestamp : {blockTimestamp}</li>
                                <li> - transactionHash : {transactionHash}</li>
                            </ul>
                            <br></br>
                            <br></br>
                        </div>
                    )
                })
            )}
        </div>
    )
}

export default Home
