import { useState, useEffect } from "react"

const style = {
    wrapper: `p-4 w-full flex justify-between items-center dark:bg-[#28242B] dark:text-white`,
    dummy: `w-full min-h-[20rem] flex justify-center items-center`
}

const Account = () => {
    return (
        <div className={style.wrapper}>
            <div className={style.dummy}>
                Account Page
            </div> 
        </div>
    )
 }

export default Account
