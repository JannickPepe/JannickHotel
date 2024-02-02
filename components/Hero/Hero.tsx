"use client"

import { useContext } from "react"
import { CursorContext } from "@/providers/CursorProvider"
import { Button } from "../ui/button";
import { LeafyGreen, Lightbulb } from "lucide-react";
import Link from "next/link";


export default function Hero() {

    const [cursorType, setCursorType] = useContext<any>(CursorContext)

    return (
        <div className="w-full bg flex items-center justify-center mt-2 mb-6">
            <div className="flex items-center justify-center flex-col w-full p-4 rounded-xl gap-8">
                <div className="flex flex-col items-center"
                    onPointerEnter={() => setCursorType("hovered")}
                    onPointerLeave={() => setCursorType("default")}
                >
                    <h1 className="text-3xl">Welcome to Jannick&#39;s Hotel World</h1>
                    <h2 className="text-2xl">Your favorite site for Hotels And Rooms</h2>
                    <Button className="text-indigo-500 bg-transparent border border-solid border-indigo-500 hover:bg-indigo-500 hover:text-white active:bg-indigo-600 font-bold uppercase text-sm px-6 py-3 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 mt-4" type="button">
                        <Lightbulb className="mr-2" /> Discover More
                    </Button>
                    <p className="text-xs mt-2 font-semibold">Got any questions? <Link className="hover-underline-animation" href='#'>Contact Us Here</Link></p>
                </div>
            </div>
        </div>
    );

};