import React, { useState } from "react"
import Image from "next/image"

import { sleep } from "@/lib/libs"

/**
 * 
 * @note: documentation here: https://replicate.com/docs/get-started/nextjs
 * 
 * 1. get image url from here
 * 2. push it on ipfs -> show on UI
 * 3. if the user submits nft -> create a metadata.json with this image as url 
 * 4. push this metadata to ipfs
 * 
 */
const ImageGenerator = () => {
    const [prediction, setPrediction] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch("/api/predictions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: e.target.prompt.value,
            }),
        })
        let prediction = await response.json()
        if (response.status !== 201) {
            setError(prediction.detail)
            return
        }
        setPrediction(prediction)

        while (prediction.status !== "succeeded" && prediction.status !== "failed") {
            await sleep(1000)
            const response = await fetch("/api/predictions/" + prediction.id)
            prediction = await response.json()
            if (response.status !== 200) {
                setError(prediction.detail)
                return
            }
            console.log({ prediction })
            setPrediction(prediction)
        }
    }

    return (
        <div>
            <p>
                Images Generated using
                <a href="https://replicate.com/stability-ai/stable-diffusion">ReplicateAI</a>
            </p>

            <form onSubmit={handleSubmit}>
                <input type="text" name="prompt" placeholder="Enter a prompt to display an image" />
                <button type="submit">Go!</button>
            </form>

            {error && <div>{error}</div>}

            {prediction && (
                <div>
                    {prediction.output && (
                        <div>
                            <Image
                                fill
                                src={prediction.output[prediction.output.length - 1]}
                                alt="output"
                                sizes="100vw"
                            />
                        </div>
                    )}
                    <p>status: {prediction.status}</p>
                </div>
            )}
        </div>
    )
}

export default ImageGenerator
