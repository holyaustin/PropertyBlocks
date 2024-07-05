"use client";

import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import RealEstateFractionalize from "../../artifacts/contracts/RealEstateFractionalize.sol/RealEstateFractionalize.json";
import { liskAddress } from "../../config";
import axios from "axios";
import "dotenv/config";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

const fileShareAddress = liskAddress;

export default function Explore() {
  const router = useRouter();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadfileNFT();
  }, []);

  async function loadfileNFT() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(fileShareAddress, RealEstateFractionalize.abi, signer);
    console.log("contract is ", contract);
    console.log("data loading ");
    const data = await contract.fetchMyPropertyRegistered();
    console.log("data fetched is ", data);
    console.log("Testing Index of Property Struct ", contract.properties(0));
    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */ // getPropertyById
    const items = await Promise.all(
      data.map(async i => {
        console.log("Inside the item map ");
        const propertyData = await contract.properties(i.id);
        console.log("property Data is ", propertyData);
        const tokenUri = await propertyData.propertyURI;
        console.log("token Uri is ", tokenUri);
        const httpUri = getIPFSGatewayURL(tokenUri);
        console.log("Http Uri is ", httpUri);
        const meta = await axios.get(httpUri);

        const item = {
          tokenId: i.id.toNumber(),
          image: getIPFSGatewayURL(meta.data.image),
          name: meta.data.name,
          description: meta.data.description,
          sharelink: getIPFSGatewayURL(meta.data.image),
          pin: meta.data.properties.pin,
          paddress: meta.data.properties.paddress,
          ptype: meta.data.properties.ptype,
          price: meta.data.properties.price,
          totalfraction: meta.data.properties.totalfraction,
          image2: getIPFSGatewayURL(meta.data.properties.image2),
          //image3: getIPFSGatewayURL(meta.data.properties.image3),
        };
        console.log("item returned is ", item);

        return item;
      }),
    );

    setNfts(items);
    setLoadingState("loaded");
  }

  const getIPFSGatewayURL = ipfsURL => {
    const urlArray = ipfsURL.split("/");
    console.log("urlArray = ", urlArray);
    const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.nftstorage.link/${urlArray[3]}`;
    console.log("ipfsGateWayURL = ", ipfsGateWayURL);
    return ipfsGateWayURL;
  };

  async function share(nft) {
    console.log("item id clicked is", nft.tokenId);
    const id = nft.tokenId;

    router.push(`/details?id=${id}`);

    console.log("Prop result without {} is ", { id });
  }

  if (loadingState === "loaded" && !nfts.length) {
    return (
      <div>
        <h1 className="px-20 py-10 text-3xl text-white">Empty marketplace, no property listed yet</h1>
      </div>
    );
  }
  return (
    <div>
      <div className="bg-blue-100 text-4xl text-center text-black font-bold pt-10">
        <h1>Available Properties</h1>
      </div>
      <div className="flex justify-center bg-blue-100 mb-12">
        <div className="px-4" style={{ maxWidth: "1600px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {nfts.map((nft, i) => (
              <div key={i} className="flex flex-col shadow rounded-xl overflow-hidden border-2 border-white-500">
                {/**
                  <Image
                    alt="RealEstateFractionalize"
                    src={`${nft.image}#toolbar=0`}
                    width={300}
                    height={300}
                    className=""object-fill shadow-2xl bg-red rounded-xl  
                    p-4 m-4   shadow-rose-400  
                     hover:rotate-45 duration-150  
                     ease-in-out "
                  />  */}
                <img
                  title="fileNFT"
                  frameBorder="0"
                  scrolling="no"
                  height="200px"
                  width="100%"
                  // objectFit="cover"
                  src={`${nft.image}#toolbar=0`}
                  className="py-3 object-cover h-500"
                  w={nft.key}
                />

                <div className="p-1">
                  <p style={{ height: "34px" }} className="text-lg text-purple-700 font-semibold">
                    Name: {nft.name}
                  </p>
                  <p className="text-base font-bold text-black">Description : {nft.description}</p>
                  <p className="text-base font-bold text-black">Property Address : {nft.paddress}</p>
                  <p className="text-base font-bold text-black">Property type : {nft.ptype}</p>
                  <p className="text-base font-bold text-black">Amount : {nft.price} USD</p>
                </div>
                {/** onClick={() => share(nft)} */}
                <div className="p-2 bg-black">
                  <button
                    data-value={nft}
                    type="button"
                    onClick={() => share(nft)}
                    className="w-full bg-purple-700 text-white font-bold py-2 px-2 rounded"
                  >
                    View Property
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
