import React, { useState } from "react"

const style = {
    blue: `bg-[#27F3CB] hover:bg-gradient-to-b hover:from-[#9ffcea] hover:to-[#00f1c2] text-slate-800 shadow-lg`,
    yellow: `bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-slate-800`,
    teal: `bg-gradient-to-b from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-600 text-slate-800 dark:bg-gradient-to-b dark:from-teal-600 dark:to-teal-700 dark:hover:from-teal-400 dark:hover:to-teal-600 dark:text-slate-800`,
}

const Button = (props) => {

    const { btnColor, btnText, handleClick, ...rest } = props
    const btnStyle = style[btnColor] || style.blue

    return (
        <button
            type="button"
            className={`cursor-pointer font-sans uppercase text-xs font-semibold self-center rounded-full py-2 px-4 mx-2 ${btnStyle} ${rest}`}
            onClick={handleClick}
        >
            {btnText}
        </button>
    )
}

export default Button
