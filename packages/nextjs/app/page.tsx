"use client";

import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
//import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

//import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  //const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-5xl font-bold">PropertyBlocks</span>
            <span className="block text-2xl mb-2">Welcome to</span>
          </h1>

          <div
            className="flex flex-col p-6  
                     justify-center  
                    items-center"
          >
            <div className="w-full relative bg-slate-300 mb-5">
              <img
                className="w-full h-3/5 object-cover"
                alt="banner"
                src="https://media.licdn.com/dms/image/D4D12AQE7QmFts4WD6g/article-cover_image-shrink_720_1280/0/1707776096849?e=2147483647&v=beta&t=Lb7ZSWRAhfSridnUZ82qf1rDV2K3bUhYjkfX1qn0uAw"
              />
            </div>

            {/**
            <h1
              className="text-2xl text-center  
                     font-semibold text-green-600"
            >
              Available Real Estate for Purchase or Rent
            </h1>
  */}
            <div className="flex flex-row">
              <Image
                alt="1"
                src={
                  "https://www.tpihomes.com.ng/wp-content/uploads/2023/08/lekki-foreshore-estate-cypress-detached-duplex-2.jpg"
                }
                width={300}
                height={300}
                className="shadow-2xl bg-red rounded-xl  
                    p-4 m-4   shadow-rose-400  
                     hover:rotate-45 duration-150  
                     ease-in-out "
              />
              <Image
                alt="2"
                src={
                  "https://media.istockphoto.com/id/1409298953/photo/real-estate-agents-shake-hands-after-the-signing-of-the-contract-agreement-is-complete.jpg?b=1&s=612x612&w=0&k=20&c=CZnxPVVMkJEuEo0wwHZALFl3kxwcc8UTHacyltADwt0="
                }
                width={300}
                height={300}
                className="shadow-2xl bg-red rounded-xl  
                     p-4 m-4 shadow-cyan-400  
                     hover:scale-125  
                     duration-150 ease-in-out "
              />
              <Image
                alt="3"
                src={"https://www.propertypro.ng/offers/wp-content/themes/reserville/images/0-main-slider/9.jpg"}
                width={300}
                height={300}
                className="shadow-2xl bg-red  
                     rounded-xl p-4 m-4  
                     shadow-green-400  
                     hover:skew-x-12  
                     duration-150 ease-in-out "
              />
              <Image
                alt="4"
                src={
                  "https://www.preleaseproperty.com/assets/images/blogs_static/fractional-owenership/Fractional-Ownership--The-new-reality-of-the-Real-Estate-Market-1.jpg"
                }
                width={300}
                height={300}
                className="shadow-2xl bg-red rounded-xl  
                     p-4 m-4 shadow-pink-400  
                     hover:skew-y-12 duration-150  
                     ease-in-out "
              />
            </div>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row mx-20 px-10">
            <img
              className="w-full h-3/5 object-cover"
              alt="benefit"
              src="https://newdoorrealtors.in/admin/uploadimg/blog_1702026044.png"
            />
          </div>
        </div>

        <div>
          <div className="relative w-full h-full overflow-hidden">
            <Image
              className="rounded-sm"
              object-fit="cover"
              priority={true}
              fill={true}
              alt="landing pic"
              src="https://www.propertypro.ng/offers/wp-content/themes/reserville/images/0-main-slider/9.jpg"
            />
          </div>

          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">
              <Image src="/thumbnail.jpg" alt="landing pic" width={1326} height={300}></Image>
            </p>
          </div>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
