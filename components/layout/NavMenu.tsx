"use client"

import * as React from "react"
import { BookOpenCheck, ChevronsUpDown, Hotel, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"


export function NavMenu() {

    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <ChevronsUpDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="hover:scale-125">
                <DropdownMenuItem className="overflow-hidden cursor-pointer flex gap-2 items-center" onClick={() => router.push("/hotel/new")}>
                    <div className="animate-text-reveal [animation-fill-mode:backwards] flex gap-2 items-center">
                        <Plus size={15} /> <span className=""> Add Hotel</span>
                    </div>
                    
                </DropdownMenuItem>
                <DropdownMenuItem className="overflow-hidden cursor-pointer flex gap-2 items-center" onClick={() => router.push("/my-hotels")}>
                    <div className="animate-text-reveal [animation-fill-mode:backwards] flex gap-2 items-center">
                        <Hotel size={15} /> <span className=""> My Hotels</span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="overflow-hidden cursor-pointer flex gap-2 items-center" onClick={() => router.push("/my-bookings")}>
                    <div className="animate-text-reveal [animation-fill-mode:backwards] flex gap-2 items-center">
                        <BookOpenCheck size={15} /> <span className=""> My Bookings</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

};
