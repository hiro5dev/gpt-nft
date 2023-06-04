import "../styles/globals.css"
import { ThemeProvider } from "next-themes"
import { ProvideSearch } from "@/context/search"
import { ProvideAuth } from "@/context/auth"
import { ProvidePage } from "@/context/page"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
})

const MyApp = ({ Component, pageProps }) => {
    return (
        <ProvideAuth>
            <ThemeProvider attribute="class">
                <ApolloProvider client={client}>
                    <ProvideSearch>
                        <ProvidePage>
                            <Component {...pageProps} />
                        </ProvidePage>
                    </ProvideSearch>
                </ApolloProvider>
            </ThemeProvider>
        </ProvideAuth>
    )
}

export default MyApp
