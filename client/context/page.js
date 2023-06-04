import { useEffect, useState, createContext, useContext } from "react"

const pageContext = createContext()

export const ProvidePage = ({ children }) => {
    const page = useProvidePage()
    return <pageContext.Provider value={page}>{children}</pageContext.Provider>
}

export const usePage = () => {
    return useContext(pageContext)
}

const useProvidePage = () => {
    const [pageType, setPageType] = useState("mint")

    return {
        pageType,
        setPageType,
    }
}
