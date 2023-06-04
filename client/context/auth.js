import { useState, useContext, createContext, useEffect } from "react"
import { ethers, utils } from "ethers"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"

const authContext = createContext()

export function ProvideAuth({ children }) {
    const auth = useProvideAuth()
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext)
}

function useProvideAuth() {
    const [isConnected, setIsConnected] = useState(false)
    const [hasMetamask, setHasMetamask] = useState(false)
    const [currentAccount, setCurrentAccount] = useState()
    const [signer, setSigner] = useState(undefined)
    const [accountBalance, setAccountBalance] = useState(0)
    const [chainId, setChainId] = useState("31337")

    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            setHasMetamask(true)
        }
    })

    const checkIfWalletIsConnected = async () => {
        try {
            if (typeof window.ethereum === "undefined") return alert("Please install metamask ")

            setHasMetamask(true)
            const accounts = await ethereum.request({ method: "eth_accounts" })
            console.log("----------- accounts: ", accounts)

            if (accounts.length) {
                setCurrentAccount(accounts[0])
                setIsConnected(true)
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                setSigner(provider.getSigner())
                const { chainId } = await provider.getNetwork()
                if (chainId) {
                    setChainId(parseInt(chainId).toString())
                }
            }
            
        } catch (error) {
            console.error(error)
            throw new Error("No ethereum object.")
        }
    }
    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    const connect = async () => {
        if (typeof window.ethereum !== "undefined") {
            setHasMetamask(true)
            try {
                await ethereum.request({ method: "eth_requestAccounts" })
                setIsConnected(true)
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                setSigner(provider.getSigner())

                const accounts = await ethereum.request({
                    method: "eth_requestAccounts",
                })
                if (accounts.length) {
                    setIsConnected(true)
                    setCurrentAccount(accounts[0])
                }

                const { chainId } = await provider.getNetwork()
                if (chainId) {
                    setChainId(parseInt(chainId).toString())
                }

                const balance = await provider.getBalance("ethers.eth")
                const balanceInEth = utils.formatEther(balance)
                setAccountBalance(balanceInEth.toString())
            } catch (e) {
                console.log(e)
            }
        } else {
            setIsConnected(false)
            return alert("Please install metamask ")
        }
    }

    return {
        isConnected,
        hasMetamask,
        currentAccount,
        signer,
        accountBalance,
        chainId,
        connect,
    }
}
