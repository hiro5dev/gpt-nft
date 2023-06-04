import { useQuery, gql } from "@apollo/client"

const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(where: { buyer: "0x0000000000000000000000000000000000000000", tokenId_gt: 17 }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
            blockNumber
            blockTimestamp
            transactionHash
        }
    }
`

export default GET_ACTIVE_ITEMS
