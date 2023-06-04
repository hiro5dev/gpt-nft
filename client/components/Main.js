import React, { useState } from "react"
import Head from "next/head"

import RightBar from "@/components/RightBar"
import Hero from "@/components/Hero"
import Gallery from "@/components/Gallery"
import Button from "@/components/Button"


const Main = () => {
    return (
        <>
            <Head>
                <style>
                    {`
                    .overflow-y-auto::-webkit-scrollbar {
                        width: 0;
                        background-color: transparent;
                    }
                    `}
                </style>
            </Head>
            <div className="flex justify-between pb-20 ">
                <div className="h-screen overflow-y-auto  lg:w-3/4 scrollbar-hide">
                    <div>
                        <Hero />
                    </div>
                    <div className="px-20 pt-5 md:px-10">
                        <Gallery />
                    </div>
                </div>

                {/* =========================== account section - Rightbar or buttons =========================== */}
                <div className="lg:w-1/4 h-screen hidden lg:block">
                    <div className="h-screen">
                        <RightBar />
                    </div>
                </div>

                <div className="fixed right-0 bottom-5 flex flex-col justify-start visible md:hidden">
                    <Button btnColor={"blue"} btnText={" Portfolio"} />
                    <br/>
                    <Button btnColor={"blue"} btnText={"Mint NFT"} />
                    {/* <button className="bg-blue-500 text-white py-2 px-4 rounded-lg m-2">
                        View Account
                    </button>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-lg m-2">
                        Mint NFT
                    </button> */}
                </div>
            </div>
        </>
    )
}

export default Main
