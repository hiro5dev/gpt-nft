import { useEffect, useState } from "react"
import { useSearch } from "@/context/search"
import { useAuth } from "@/context/auth"
import { useQuery } from "@apollo/client"

import Header from "@/components/Header"
import Main from "@/components/Main"
import MintAndList from "@/components/MintAndList"
import Footer from "@/components/Footer"
import FormPopup from "@/components/FormPopup"
import ImageGenerator from "../components/ImageGenerator"

import { getDefaultProvider } from "ethers"

import nftAbi from "../constants/GptNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import simpleStorageAbi from "../constants/SimpleStorage.json"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"

import { ethers } from "ethers"
import Gallery from "../components/Gallery"

const style = {
    wrapper: `h-100vh w-100vw select-none flex flex-col bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-rose-100 via-sky-100 to-white dark:bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] dark:from-[#2c2203] dark:via-gray-900 dark:to-black`,
}

const Home = () => {
    const { search, onSearch } = useSearch()
    const { isConnected, hasMetamask, currentAccount, signer, accountBalance, chainId, connect } =
        useAuth()

    return (
        <div className={style.wrapper}>
            <Header/>
            <MintAndList
                isConnected={isConnected}
                hasMetamask={hasMetamask}
                currentAccount={currentAccount}
                signer={signer}
                chainId={chainId}
            />
            <Gallery />
            <Main />
             <Footer />
            <FormPopup>
                <form>
                    <input type="text" placeholder="Name" className="p-2 rounded" />
                    <input type="email" placeholder="Email" className="p-2 rounded" />
                    <button className="btn bg-yellow text-zinc-800 rounded">Submit</button>
                </form>
            </FormPopup>
            <ImageGenerator /> 
        </div>
    )
}

export default Home
