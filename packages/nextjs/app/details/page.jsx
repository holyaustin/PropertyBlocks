"use client";

import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
import { useSearchParams } from "next/navigation";
// import { useRouter } from "next/navigation";
import RealEstateFractionalize from "../../artifacts/contracts/RealEstateFractionalize.sol/RealEstateFractionalize.json";
import { liskAddress } from "../../config";
import axios from "axios";
import "dotenv/config";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

const fileShareAddress = liskAddress;

export default function ViewDetails() {
  console.log("Entered viewing component");
  // const router = useRouter();
  const searchParams = useSearchParams();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    loadDetails();
  }, []);

  const getIPFSGatewayURL = ipfsURL => {
    const urlArray = ipfsURL.split("/");
    console.log("urlArray = ", urlArray);
    const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.nftstorage.link/${urlArray[3]}`;
    console.log("ipfsGateWayURL = ", ipfsGateWayURL);
    return ipfsGateWayURL;
  };

  async function Live() {
    router.push("/dashboardLive");
  }
  async function Claim() {
    router.push("/claim");
  }
  //const rpcUrl = "https://rpc.sepolia-api.lisk.com";

  const idx = searchParams.get("id");
  console.log("Props result is without ", idx);

  async function loadDetails() {
    /* create a generic provider and query for unsold market items */
    console.log("loading property for item", idx);

    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    //const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(fileShareAddress, RealEstateFractionalize.abi, signer);
    console.log("data loading for idx ", idx);
    const data = await contract.fetchOneProperty(idx); // work getting fetchOneNFT
    console.log("data fetched is ", data);

    const items = await Promise.all(
      data.map(async i => {
        console.log("Inside the item map ");
        const propertyData = await contract.properties(i.id);
        console.log("property Data is ", propertyData);
        const tokenUri = await data.propertyURI;
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
          image3: getIPFSGatewayURL(meta.data.properties.image3),
        };
        console.log("item returned is ", item);
        return item;
      }),
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !nfts.length) {
    return (
      <div>
        <h1 className="px-20 py-10 text-3xl">You have not selected a property</h1>
      </div>
    );
  }
  return (
    <div className="bg-blue-100 ">
      <>
        <div className=" text-4xl text-center text-blue-100 font-bold ">
          <h1>Details of Property</h1>
        </div>
        <div className="grid grid-cols-4 grid-rows-3 col-gap-2 row-gap-5 bg-gray-300 mx-20 my-5">
          <div className="col-start-1 col-end-3 row-span-2 text-white bg-indigo-500 text-4xl flex items-center justify-center border-4 border-red-500">
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4 pt-4">
              {nfts.map((nft, i) => (
                <div key={i} className="shadow rounded-xl overflow-hidden">
                  <img
                    title="Car Pics"
                    frameBorder="0"
                    scrolling="no"
                    height="450px"
                    width="100%"
                    src={`${nft.image}#toolbar=0`}
                    className="object-fill h-400 w-full"
                  />
                  <div className="p-4">
                    <p style={{ height: "20px" }} className="text-3xl font-semibold">
                      {nft.name}
                    </p>
                  </div>
                  <div className="p-4">
                    <p style={{ height: "20px" }} className="text-3xl font-semibold">
                      Property No: {nft.tokenId}
                    </p>
                  </div>

                  <div className="p-4">
                    <p style={{ height: "50px" }} className="text-2xl font-semibold">
                      Property Owner: {nft.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-white bg-indigo-500 text-4xl flex items-center justify-center border-4 border-red-500">
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4 pt-4">
              {nfts.map((nft, i) => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <img
                    title="Car Pics"
                    frameBorder="0"
                    scrolling="no"
                    height="450px"
                    width="100%"
                    src={`${nft.image2}#toolbar=0`}
                    className="object-fill h-400 w-full"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="row-span-3 text-black bg-white text-2xl flex text-left p-3 ">
            {nfts.map((nft, i) => (
              <div key={i} className="bg-white shadow rounded-xl overflow-hidden">
                <div className="p-4">
                  <p style={{ height: "20px" }} className="text-3xl font-semibold underline">
                    Bounty Information
                  </p>
                </div>
                <br />
                <div className="p-4">
                  <p style={{ height: "20px" }} className="text-xl font-semibold">
                    Bounty Title: {nft.name}
                  </p>
                </div>
                <br />
                <div className="p-4">
                  <p style={{ height: "20px" }} className="text-xl font-semibold">
                    Description: {nft.description}
                  </p>
                </div>
                <br />
                <div className="p-4">
                  <p style={{ height: "20px" }} className="text-xl font-semibold">
                    Bounty Amount (USD): {nft.price}
                  </p>
                </div>
                <br />
                <div className="p-4">
                  <p style={{ height: "20px" }} className="text-xl font-semibold">
                    Bounty Owner: {nft.address}
                  </p>
                </div>
                <br />
                <div className="p-4">
                  <p style={{ height: "20px" }} className="text-xl font-semibold">
                    VIN: {nft.vin}
                  </p>
                </div>
                <br />
                <div className="p-4">
                  <p style={{ height: "20px" }} className="text-xl font-semibold">
                    Vehicle Make: {nft.make}
                  </p>
                </div>
                <br />
                <div className="p-4">
                  <p style={{ height: "20px" }} className="text-xl font-semibold">
                    Vehicle Model: {nft.model}
                  </p>
                </div>
                <br />
                <div className="p-4">
                  <p style={{ height: "20px" }} className="text-xl font-semibold">
                    Vehicle Year: {nft.year}
                  </p>
                </div>
                <br />
                <div className="p-4">
                  <p style={{ height: "20px" }} className="text-xl font-semibold">
                    Vehicle Colour: {nft.colour}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-white bg-indigo-500  text-4xl flex items-center justify-center border-4 border-red-500">
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4 pt-4">
              {nfts.map((nft, i) => (
                <div key={i} className="shadow rounded-xl overflow-hidden">
                  <img
                    title="Car Pics"
                    frameBorder="0"
                    scrolling="no"
                    height="450px"
                    width="100%"
                    src={`${nft.image3}#toolbar=0`}
                    className="object-fill h-400 w-full"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-3 text-white bg-indigo-500  text-4xl flex items-center justify-center">
            <div className="p-4 bg-indigo-500 ">
              <button
                type="button"
                className="w-full bg-blue-800 text-white font-bold py-2 px-12 border-b-4 border-blue-200 hover:border-blue-500 rounded-full"
              >
                <a
                  className="social-icon-link github"
                  href="https://web3chat-holyaustin.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="chat"
                >
                  Chat with Property Owner
                </a>
              </button>
            </div>
            <div className="p-4 bg-indigo-500">
              <button
                type="button"
                className="w-full bg-blue-800 text-white font-bold py-2 px-12 border-b-4 border-blue-200 hover:border-blue-500 rounded-full"
                onClick={() => Claim()}
              >
                {" "}
                Rent Property
              </button>
            </div>
            <div className="p-4 bg-indigo-500">
              <button
                type="button"
                className="w-full bg-blue-800 text-white font-bold py-2 px-12 border-b-4 border-blue-200 hover:border-blue-500 rounded-full"
                onClick={() => Live()}
              >
                Buy Property
              </button>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
