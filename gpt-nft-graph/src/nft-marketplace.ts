import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
    NftMarketplace,
    ItemBought as ItemBoughtEvent,
    ItemCanceled as ItemCanceledEvent,
    ItemListed as ItemListedEvent
} from "../generated/NftMarketplace/NftMarketplace"
import { ItemListed, ActiveItem, ItemBought, ItemCanceled } from "../generated/schema"

export function handleItemListed(event: ItemListedEvent): void {
    let itemListed = ItemListed.load(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
    let activeItem = ActiveItem.load(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
    if (!itemListed) {
        itemListed = new ItemListed(
            getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
        )
    }
    if (!activeItem) {
        activeItem = new ActiveItem(
            getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
        )
    }
    itemListed.seller = event.params.seller
    activeItem.seller = event.params.seller

    itemListed.nftAddress = event.params.nftAddress
    activeItem.nftAddress = event.params.nftAddress

    itemListed.tokenId = event.params.tokenId
    activeItem.tokenId = event.params.tokenId

    itemListed.price = event.params.price
    activeItem.price = event.params.price

    // empty address indicates that Item has not been bought yet
    activeItem.buyer = Address.fromString("0x0000000000000000000000000000000000000000")

    itemListed.blockNumber = event.params.blockNumber
    itemListed.blockTimestamp = event.params.blockTimestamp
    itemListed.transactionHash = event.params.transactionHash

    activeItem.blockNumber = event.params.blockNumber
    activeItem.blockTimestamp = event.params.blockTimestamp
    activeItem.transactionHash = event.params.transactionHash

    itemListed.save()
    activeItem.save()
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
    let itemCanceled = ItemCanceled.load(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
    let activeItem = ActiveItem.load(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
    if (!itemCanceled) {
        itemCanceled = new ItemCanceled(
            getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
        )
    }
    itemCanceled.seller = event.params.seller
    itemCanceled.nftAddress = event.params.nftAddress
    itemCanceled.tokenId = event.params.tokenId
    // the dEaD address indicates that its been cancelled
    activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD")

    itemCanceled.blockNumber = event.params.blockNumber
    itemCanceled.blockTimestamp = event.params.blockTimestamp
    itemCanceled.transactionHash = event.params.transactionHash

    activeItem!.blockNumber = event.params.blockNumber
    activeItem!.blockTimestamp = event.params.blockTimestamp
    activeItem!.transactionHash = event.params.transactionHash

    itemCanceled.save()
    activeItem!.save()
}

export function handleItemBought(event: ItemBoughtEvent): void {
    let itemBought = ItemBought.load(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
    let activeItem = ActiveItem.load(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
    if (!itemBought) {
        itemBought = new ItemBought(
            getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
        )
    }
    itemBought.buyer = event.params.buyer
    itemBought.nftAddress = event.params.nftAddress
    itemBought.tokenId = event.params.tokenId
    itemBought.price = event.params.price
    activeItem!.buyer = event.params.buyer

    itemBought.blockNumber = event.params.blockNumber
    itemBought.blockTimestamp = event.params.blockTimestamp
    itemBought.transactionHash = event.params.transactionHash

    activeItem!.blockNumber = event.params.blockNumber
    activeItem!.blockTimestamp = event.params.blockTimestamp
    activeItem!.transactionHash = event.params.transactionHash

    itemBought.save()
    activeItem!.save()
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
    return tokenId.toHexString() + nftAddress.toHexString()
}
