"use client"

import { useContext } from "react"
import { CursorContext } from "@/providers/CursorProvider"


export default function Hero() {

    const [cursorType, setCursorType] = useContext<any>(CursorContext)

    return (
        <div className="w-full bg flex items-center justify-center mb-10">
            <div className="flex items-center justify-center flex-col w-full p-4 rounded-xl gap-8">
                <div className="flex flex-col items-center"
                    onPointerEnter={() => setCursorType("hovered")}
                    onPointerLeave={() => setCursorType("default")}
                >
                    <h1 className="text-3xl">Welcome to Jannick&#39;s Hotel world</h1>
                    <h2 className="text-2xl">Your favorite site for Hotels And Rooms</h2>
                </div>
            </div>
        </div>
    );

};