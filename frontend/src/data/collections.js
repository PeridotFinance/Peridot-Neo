import { getChain } from "./chains";
import { getToken } from "./tokens";
import { getChainFilteredSet, toDateString } from "../lib/helper.js";

const collections = {
  MAINNET: [
    {
      blindBoxId: 1,
      name: "MAYC",
      nftTax: 3,
      tokenTax: 3,
      price: "1.55",
      maxAmount: 1000,
      nft: {
        symbol: "NFT",
        contract: "0xc1306A30490C8566D09f617e85BB503B55B547eC",
        imagePath: "/images/tokens/placeholder.svg", // TODO: add real image
      },
      miniNft: {
        symbol: "miniNFT",
        contract: "0x508151E35780DB10C74ef3A30109397F62F9885b",
        imagePath: "/images/tokens/placeholder.svg", // TODO: add real image
      },
      tokenSymbol: "FFT",
    },
  ],
  TESTNET: [
    {
      blindBoxId: 1,
      name: "BAYC",
      nftTax: 3,
      tokenTax: 3,
      price: "1.55",
      maxAmount: 1000,
      nft: {
        symbol: "NFT",
        contract: "0x92197cC1800C563d2A5c2508cEd85aA439730ef9",
        imagePath: "/images/tokens/placeholder.svg", // TODO: add real image
      },
      miniNft: {
        symbol: "miniNFT",
        contract: "0xfF8151C55A3AFfED7BEccfc379bF9b22d68b61f8",
        imagePath: "/images/tokens/placeholder.svg", // TODO: add real image
      },
      tokenSymbol: "FFT",
    },
  ],
};

// ---- GET ALL COLLECTIONS ----

export function getCollections() {
  let allCollections = [];
  let currentCollections = getChainFilteredSet(collections);

  for (const [chainName, collections] of Object.entries(currentCollections)) {
    let chain = getChain(chainName);

    let newCollections = collections.map((collection) => {
      let newCollection = {
        ...collection,
        miniNftImagePath:
          "/images/collections/" + collection.name + "_miniNft.png",
        blindBoxImagePath:
          "/images/collections/" + collection.name + "_blindBox.png",
        marketLink: chain.marketUrl + "/" + collection.miniNft.contract + "/1",
        expirationDate: toDateString(collection.expirationDate),
        chain: chain,
        nft: {
          ...collection.nft,
          decimals: 0,
          chain: chain,
        },
        miniNft: {
          ...collection.miniNft,
          decimals: 0,
          chain: chain,
        },
        token: getToken(chainName, collection.tokenSymbol),
      };

      delete newCollection.tokenSymbol;

      return newCollection;
    });

    allCollections = [...allCollections, ...Object.values(newCollections)];
  }

  return allCollections;
}

// ---- GET SPECIFIC COLLECTION ----

export function getCollection(chainName, collectionName) {
  return getCollections().find(
    (collection) =>
      collection.chain.nameId === chainName &&
      collection.name === collectionName
  );
}
