import React, { useState } from "react"
import Button from "./Button"

const RightBar = () => {
    //TODO: move it to separate container
    const [rows, setRows] = useState([
    
        { left: "0x12456....6789", middle: "25 Dec, 2023", right: "1.005 ETH" },
        { left: "0x12456....6789", middle: "25 Dec, 2023", right: "1.005 ETH" },
        { left: "0x12456....6789", middle: "25 Dec, 2023", right: "1.005 ETH" },
        // Add more rows here
    ])
    const maxRows = 40

    return (
        <div className="flex flex-col items-center justify-start px-2 pt-7">
            {/* ==========================RecentActivities========================== */}
            <div className="flex flex-col p-4 rounded-3xl shadow-lg items-center h-[30rem] bg-gradient-to-tl from-slate-200 via-sky-50 to-slate-50 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-600">
                <div className=" text-slate-500 dark:text-zinc-300 text-md font-bold uppercase">
                    Recent Activities
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
            </div>

            <div className="flex flex-col p-4 mt-7 rounded-3xl shadow-lg items-center w-full bg-gradient-to-tl from-slate-200 via-sky-100 to-slate-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700">
                <button className="shadow-xl w-full h-full my-2 py-4 px-4 rounded-3xl cursor-pointer text-basis font-extrabold font-sans uppercase bg-[#27F3CB] hover:bg-gradient-to-b hover:from-teal-300 hover:to-teal-400 text-slate-800">
                    Mint New Nft
                </button>
            </div>

            <div className="flex flex-col py-5 px-4 mt-10 rounded-3xl shadow-lg w-full bg-gradient-to-tl from-slate-200 via-sky-100 to-slate-100 dark:from-black dark:via-zinc-900 dark:to-zinc-800">
                <div className="flex justify-between text-slate-500 dark:text-zinc-30 text-xs px-2">
                    <div>
                        <p>Your total Proceedings: </p>
                    </div>
                    <div>
                        <p>5.005 ETH</p>
                    </div>
                </div>
                <div className="flex justify-between mt-5">
                    <Button btnColor={"yellow"} btnText={"Collect Now"} />
                    <Button btnColor={"teal"} btnText={"Portfolio"} />
                </div>
            </div>
        </div>
    )
}

export default RightBar
