import React, { useState } from "react"

import { AiOutlineCloseCircle } from "react-icons/ai"

const FormPopup = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }
    return (
        <>
            <button className="btn bg-yellow text-zinc-800 rounded" onClick={toggleModal}>
                Open Form
            </button>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black backdrop-blur-sm bg-opacity-70 z-50 flex flex-col items-center overflow-auto bg-blur">
                    <div className="relative mt-10 max-w-sm bg-white p-8 rounded-3xl shadow-xl">
                        {children}
                        {/* <button
                            className="absolute top-0 right-0 btn bg-red-500 text-zinc-800 rounded p-2"
                            onClick={() => setShowForm(false)}
                        >
                            X
                        </button> */}
                        <div className="absolute top-0 right-0 flex items-center p-3 rounded-full text-zinc-500 hover:text-zinc-800 cursor-pointer">
                            <AiOutlineCloseCircle size={35} onClick={toggleModal} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default FormPopup
