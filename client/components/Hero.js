import React, { useState } from "react"
import Button from "./Button"

const Hero = () => {

    //TODO: move it to separate container
    const [rows, setRows] = useState([
        { left: "0x12456....6789", middle: "25 Dec, 2023", right: "1.005 ETH" },
        { left: "0x12456....6789", middle: "25 Dec, 2023", right: "1.005 ETH" },
        { left: "0x12456....6789", middle: "25 Dec, 2023", right: "1.005 ETH" },
        // Add more rows here
    ])
    const maxRows = 4


    return (
        <section className="py-8 pl-5 pr-2">
            <div className="container mx-auto flex items-center justify-between">
                <div className="md:w-3/5 pr-20">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-lato font-extrabold text-transparent bg-clip-text bg-gradient-to-tl from-black  via-gray-800 to-amber-600 dark:bg-gradient-to-r dark:from-amber-100 dark:via-amber-200 dark:to-amber-200">
                        GPT Meets NFTs
                    </h1>
                    <h1 className="text-md md:text-xl lg:text-2xl leading-10 tracking-wide font-lato font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-tl from-black via-gray-800 to-amber-600 dark:bg-gradient-to-r dark:from-amber-100 dark:via-amber-200 dark:to-amber-200">
                        :Future of Digital Art is here
                    </h1>
                    <p className="text-xs md:text-base  mt-7 font-lato text-zinc-600 dark:text-zinc-400">
                        Our marketplace is introducing a new generation of digital art that is
                        unique, one-of-a-kind, and created by the combination of cutting-edge AI
                        technology and GPT Generative Model.
                    </p>
                    <p className="text-xs md:text-base font-bold mt-4 font-lato text-zinc-600 dark:text-zinc-400">
                        Join the revolution of digital art and own a piece of the future!
                    </p>
                </div>
                <div className="hidden md:block md:w-2/5">
                    <div className="flex flex-col p-4 rounded-3xl shadow-lg items-center justify-between h-[15rem] bg-gradient-to-tl from-slate-200 via-sky-50 to-slate-50 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-600">
                        <div className=" text-slate6500 dark:text-zinc-300 text-md font-bold uppercase">
                            Your Portfolio
                        </div>
                        {/* TODO: make it a separate component */}
                        <div className="text-slate-500 dark:text-zinc-300 text-xs">
                            <table className="table-auto">
                                <thead>
                                    <tr className="text-left">
                                        <th className="px-6 py-3">Item </th>
                                        <th className="px-4 py-3">Sold On</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.slice(0, maxRows).map((row, index) => (
                                        <tr key={index} className="text-left">
                                            <td className="px-6 py-1">{row.left}</td>
                                            <td className="px-4 py-1">{row.middle}</td>
                                            <td className="px-4 py-1 text-right">{row.right}</td>
                                        </tr>
                                    ))}
                                    <tr className="text-left">
                                        <td className="px-6 py-1">........</td>
                                        <td className="px-4 py-1">........</td>
                                        <td className="px-4 py-1 text-right">......</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between">
                            <Button btnColor={"yellow"} btnText={"Mint NFT"} />
                            <Button btnColor={"teal"} btnText={"Show All"} />
                            <Button btnColor={"yellow"} btnText={"Withdraw"} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
