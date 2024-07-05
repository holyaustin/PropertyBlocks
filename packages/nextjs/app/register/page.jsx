"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RealEstateFractionalize from "../../artifacts/contracts/RealEstateFractionalize.sol/RealEstateFractionalize.json";
import { liskAddress } from "../../config";
// import { bnbAddress } from "../../config";
import "dotenv/config";
import { ethers } from "ethers";
import { NFTStorage } from "nft.storage";
import Web3Modal from "web3modal";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const allowedNetworks = getTargetNetworks();
const fileShareAddress = liskAddress;

// const APIKEY = [process.env.NFT_STORAGE_API_KEY];
const APIKEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA4Zjc4ODAwMkUzZDAwNEIxMDI3NTFGMUQ0OTJlNmI1NjNFODE3NmMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MzA1NjE4NzM4MCwibmFtZSI6InBlbnNpb25maSJ9.agI-2V-FeK_eVRAZ-T6KGGfE9ltWrTUQ7brFzzYVwdM";

const Register = () => {
  const navigate = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState();
  const [uploadedFile2, setUploadedFile2] = useState();
  const [uploadedFile3, setUploadedFile3] = useState();
  const [imageView, setImageView] = useState();
  const [metaDataURL, setMetaDataURl] = useState();
  const [txURL, setTxURL] = useState();
  const [txStatus, setTxStatus] = useState();
  const [formInput, updateFormInput] = useState({
    name: "",
    description: "",
    ptype: "",
    paddress: "",
    pin: "",
    price: "",
    totalfraction: "",
  });

  if (allowedNetworks.filter(allowedNetwork => allowedNetwork.id) !== 59141) {
    // const fileShareAddress = liskAddress;
  } else {
    alert("Choose Linear Sepolia Testnet from your wallet and try again.");
  }
  const handleFileUpload = event => {
    console.log("file1 for upload selected...");
    setUploadedFile(event.target.files[0]);
    setTxStatus("");
    setImageView("");
    setMetaDataURl("");
    setTxURL("");
  };
  const handleFileUpload2 = event => {
    console.log("file2 for upload selected...");
    setUploadedFile2(event.target.files[0]);
  };
  const handleFileUpload3 = event => {
    console.log("file3 for upload selected...");
    setUploadedFile3(event.target.files[0]);
  };

  const uploadNFTContent = async (inputFile, inputFile2, inputFile3) => {
    const { name, description, ptype, paddress, pin, totalfraction, price } = formInput;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let accounts = await provider.send("eth_requestAccounts", []);
    let account = accounts[0];
    provider.on("accountsChanged", function (accounts) {
      account = accounts[0];
      console.log(address); // Print new address
      console.log(account); // Print new address
    });
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log("users account is: ", address);

    if (!name || !description || !ptype || !paddress || !pin || !totalfraction || !price || !inputFile) return;
    const nftStorage = new NFTStorage({ token: APIKEY });
    try {
      console.log("Trying to upload file to ipfs");
      setTxStatus("Uploading Item to IPFS & Filecoin via NFT.storage.");
      console.log("close to metadata generation");
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
      setMetaDataURl(metaData.url);
      //setMetaPrice(price);
      //setMetaFraction(totalfraction);
      console.log("metadata is: ", { metaData });
      return metaData;
    } catch (error) {
      setErrorMessage("Could store file to NFT.Storage - Aborted file upload.");
      console.log("Error Uploading Content", error);
    }
  };

  const sendTxToBlockchain = async metadata => {
    const { totalfraction, price } = formInput;
    try {
      setTxStatus("Adding transaction to Blockchain.");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const connectedContract = new ethers.Contract(
        fileShareAddress,
        RealEstateFractionalize.abi,
        provider.getSigner(),
      );
      console.log("Connected to contract", fileShareAddress);
      console.log("IPFS blockchain uri is ", metadata.url);

      //const price = ethers.utils.parseUnits(formInput.price, "ether");
      const TotalFraction = totalfraction.toString();
      const Price = price.toString();
      let listingPrice = await connectedContract.getListingPrice();
      listingPrice = listingPrice.toString();
      console.log("listingPrice", listingPrice);
      console.log("Price", Price);
      const chainTx = await connectedContract.registerProperty(Price, TotalFraction, metadata.url, {
        value: listingPrice,
      });
      console.log("Passed ChainTTX", chainTx);
      console.log("Property successfully created and added to Blockchain");
      await chainTx.wait();
      return chainTx;
    } catch (error) {
      setErrorMessage("Failed to send tx to Blockchain.");
      console.log(error);
    }
  };

  const previewNFT = (metaData, chainTx) => {
    console.log("getIPFSGatewayURL2 two is ...");
    const imgViewString = getIPFSGatewayURL(metaData.data.image.pathname);
    //const img2ViewString = getIPFSGatewayURL(metaData.data.image2.pathname);
    //const img3ViewString = getIPFSGatewayURL(metaData.data.image3.pathname);
    console.log("image ipfs path is", imgViewString);
    //console.log("image2 ipfs path is", img2ViewString);
    //console.log("image3 ipfs path is", img3ViewString);
    setImageView(imgViewString);
    setMetaDataURl(getIPFSGatewayURL(metaData.url));
    setTxURL(`https://sepolia-blockscout.lisk.com/tx/${chainTx.hash}`);
    setTxStatus("File addition was successfully!");
    console.log("File preview completed");
  };

  const mintNFTFile = async (e, uploadedFile, uploadedFile2, uploadedFile3) => {
    e.preventDefault();
    // 1. upload File content via NFT.storage
    const metaData = await uploadNFTContent(uploadedFile, uploadedFile2, uploadedFile3);

    // 2. Mint a NFT token on Blockchain
    const chainTx = await sendTxToBlockchain(metaData);

    // 3. preview the minted nft
    previewNFT(metaData, chainTx);

    //4. navigate("/explore");
    navigate.push("/explore");
  };

  const getIPFSGatewayURL = ipfsURL => {
    const urlArray = ipfsURL.split("/");
    console.log("urlArray = ", urlArray);
    const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.nftstorage.link/${urlArray[3]}`;
    console.log("ipfsGateWayURL = ", ipfsGateWayURL);
    return ipfsGateWayURL;
  };

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
            placeholder="Description of Property, state how it leverages ReFi (Regenerative Finance)"
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
