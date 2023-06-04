// import { useEffect, useState, createContext, useContext } from "react"

// const styleContext = createContext()

// export const ProvideStyle = ({ children }) => {
//     const style = useProvideStyle()
//     return <styleContext.Provider value={style}>{children}</styleContext.Provider>
// }

// export const useStyle = () => {
//     return useContext(styleContext)
// }

// const useProvideStyle = () => {
//     const [colorMode, setColorMode] = useState("light")

//     const toggleColorMode = () => {
//         if (colorMode === "light") {
//             setColorMode("dark")
//         } else {
//             setColorMode("light")
//         }
//     }

//     return {
//         colorMode,
//         toggleColorMode,
//     }
// }

// NOTE: no longer required. But kept for reference while creating other contexts.