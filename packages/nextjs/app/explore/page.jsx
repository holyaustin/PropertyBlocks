"use client";

import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import RealEstateFractionalize from "../../artifacts/contracts/RealEstateFractionalize.sol/RealEstateFractionalize.json";
import { liskAddress } from "../../config";
import axios from "axios";
// import { bnbAddress } from "../../config";
import "dotenv/config";
import { ethers } from "ethers";
//import { NFTStorage } from "nft.storage";
import Web3Modal from "web3modal";

//import { getTargetNetworks } from "~~/utils/scaffold-eth";

const fileShareAddress = liskAddress;

export default function Explore() {
  const router = useRouter();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadfileNFT();
  }, []);

  // const rpcUrl = "https://rpc.sepolia-api.lisk.com";
  // const rpcUrl = "http://localhost:8545";

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
     */
    const items = await Promise.all(
      data.map(async i => {
        const tokenUri = await contract.properties(i.id);
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
  const getIPFSGatewayURL = ipfsURL => {
    const urlArray = ipfsURL.toString().split("/");
    console.log("urlArray = ", urlArray);
    const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.nftstorage.link/${urlArray[3]}`;
    console.log("ipfsGateWayURL = ", ipfsGateWayURL);
    return ipfsGateWayURL;
  };

  async function share(nft) {
    console.log("item id clicked is", nft.tokenId);
    const id = nft.tokenId;

    router.push({
      pathname: "/carDetails",
      query: { id },
    });
    console.log("Prop result without {} is ", { id });

    /**
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(fileShareAddress, RealEstateFractionalize.abi, signer);
  
      const transaction = await contract.createFileShare(nft.tokenId);
      await transaction.wait();
      console.log("RealEstateFractionalize Share transaction completed ");
      const token = nft.tokenId;
      console.log("token id is ", token);
      loadfileNFT();
       */
    //navigate("/view", { state: token });
  }
  /*
  async function CarDetails() {
    router.push({
      pathname: "/carDetails",
      query: { id },
    });
    console.log("Prop result is ", prop.id);
  }
  */
  if (loadingState === "loaded" && !nfts.length) {
    return (
      <div sx={styles.section}>
        <h1 className="px-20 py-10 text-3xl text-white">Empty drive, no file yet</h1>
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
                  height={300}
                  width={300}
                  // objectFit="cover"
                  src={`${nft.image}#toolbar=0`}
                  className="object-fill py-3 object-cover h-500"
                  w={nft.key}
                />

                <div className="p-1">
                  <p style={{ height: "34px" }} className="text-lg text-purple-700 font-semibold">
                    Name: {nft.name}
                  </p>
                  <p className="text-base font-bold text-black">Description : {nft.description}</p>
                  <p className="text-base font-bold text-black">Property Address : {nft.paddress}</p>
                  <p className="text-base font-bold text-black">Property type : {nft.ptype}</p>
                  <p className="text-base font-bold text-black">Amount : {nft.price} ETH</p>
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

/**
      const metaData = await nftStorage.store({
        name: name,
        description: description,
        image: inputFile,
        properties: {
          paddress,
          ptype,
          pin,
          price,
          totalfraction,
          image2: inputFile2,
          image3: inputFile3,
        },
      });

 
  async function CarDetails() {
   Link to Library Categories 
    // router.push("/catebooks");
    navigate("/carDetails");
  }
 
  return (
    <div>
      <div className="bg-blue-100 text-4xl text-center text-black font-bold pt-10">
        <h1> Register a Property</h1>
      </div>
      <div className="flex justify-center bg-blue-100">
        <div className="w-1/2 flex flex-col pb-12 ">
          <input
            placeholder="Enter Property Name e.g. two-storey building with 6 flats"
            className="mt-5 border rounded p-4 text-xl"
            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          />
          <textarea
            placeholder="Description of Property"
            className="mt-5 border rounded p-4 text-xl"
            onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
            rows={2}
          />
          <input
            placeholder="Property Amount in USD e.g. $25,000"
            className="mt-5 border rounded p-4 text-xl"
            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
          />
          <input
            placeholder="Amount of fractions to divide property e.g. 1,000, 20,000 etc. "
            className="mt-5 border rounded p-4 text-xl"
            onChange={e => updateFormInput({ ...formInput, totalfraction: e.target.value })}
          />
          <input
            placeholder="Property Type e.g. building, Land etc. "
            className="mt-5 border rounded p-4 text-xl"
            onChange={e => updateFormInput({ ...formInput, ptype: e.target.value })}
          />
          <input
            placeholder="Property Address e.g. 13 endeavour close, Kingston, JMC, Ikeja, Lagos etc. "
            className="mt-5 border rounded p-4 text-xl"
            onChange={e => updateFormInput({ ...formInput, paddress: e.target.value })}
          />
          <input
            placeholder="Property Identification Number e.g.1C4GJWAG0DL544058 "
            className="mt-5 border rounded p-4 text-xl"
            onChange={e => updateFormInput({ ...formInput, pin: e.target.value })}
          />

          <br />

          <div className="text-black text-xl">
            <form>
              <h3>Select picture 1 of property</h3>
              <input type="file" onChange={handleFileUpload} className="text-black mb-2 border rounded  text-xl" />
              <h3>Select picture 2 of property</h3>
              <input type="file" onChange={handleFileUpload2} className="text-black mb-2 border rounded  text-xl" />
              <h3>Select picture 3 of property</h3>
              <input type="file" onChange={handleFileUpload3} className="text-black mb-2 border rounded  text-xl" />
            </form>
            {txStatus && <p>{txStatus}</p>}

            {metaDataURL && (
              <p className="text-blue">
                <a href={metaDataURL} className="text-blue">
                  Metadata on IPFS
                </a>
              </p>
            )}

            {txURL && (
              <p>
                <a href={txURL} className="text-blue">
                  See the chain transaction
                </a>
              </p>
            )}

            {errorMessage}

            {imageView && (
              <img
                className="mb-10"
                title="File"
                src={imageView}
                alt="File preview"
                frameBorder="0"
                scrolling="auto"
                height="50%"
                width="100%"
              />
            )}
          </div>

          <button
            type="button"
            sx={{ backgroundColor: "primary" }}
            onClick={e => mintNFTFile(e, uploadedFile, uploadedFile2, uploadedFile3)}
            className="font-bold mt-20 bg-base-100 text-white text-2xl rounded p-4 shadow-lg"
          >
            Register Property
          </button>
        </div>
      </div>
    </div>
  );
};
export default Register;

/** import { DebugContracts } from "./_components/DebugContracts";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Register Property",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const Debug: NextPage = () => {
  return (
    <>
      <DebugContracts />
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Debug Contracts</h1>
        <p className="text-neutral">
          You can debug & interact with your deployed contracts here.
          <br /> Check{" "}
          <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
            packages / nextjs / app / debug / page.tsx
          </code>{" "}
        </p>
      </div>
    </>
  );
};

export default Debug;
*/
