'use client'

import { usePathname, useRouter } from "next/navigation";
import { HotelWithRooms } from "./AddHotelForm";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { Dumbbell, MapPin, Waves } from "lucide-react";
import useLocation from "@/hooks/useLocations";
import { Button } from "../ui/button";

const HotelCard = ({hotel}: {hotel: HotelWithRooms}) => {

    // Create the pathname for the route
    const pathname = usePathname()
    const isMyHotels = pathname.includes('my-hotels')

    // Setup router for the onClick event
    const router = useRouter()

    // For getting the country value since we stored the country as a call
    const {getCountryByCode} = useLocation()
    const country = getCountryByCode(hotel.country)


    // With cn we overwrite in our classname between the 2x ('') with the given style keyword for if no Hotels or with Hotels boolean
    return ( 
        <div onClick={() => !isMyHotels  && router.push(`/hotel-details/${hotel.id}`)} className={cn('col-span-1 cursor-pointer transition hover:scale-105', isMyHotels && 'cursor-default')} >
            <div className="flex gap-2 bg-background/50 border border-primary/10 rounded-lg">
                <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px] rounded-s-lg">
                    <Image className="w-full h-full object-cover" fill src={hotel.image} alt={hotel.title} />
                </div>

                <div className="flex flex-1 flex-col justify-between h-[210px] gap-1 p-1 py-2 text-sm">
                    <h3 className="font-semibold text-xl">{hotel.title}</h3>
                    <div className="text-primary/90">{hotel.description.substring(0, 45)}...</div>
                    <div className="text-primary/90">
                        <AmenityItem>
                            <MapPin className="size-4" /> {country?.name} - {hotel.city}
                        </AmenityItem>
                        {hotel.swimmingPool && 
                            <AmenityItem>
                                <Waves className="size-4" /> Pool
                            </AmenityItem>
                        }
                        {hotel.gym && 
                            <AmenityItem>
                                <Dumbbell className="size-4" /> Gym
                            </AmenityItem>
                        }
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            {hotel?.rooms[0]?.roomPrice && <>
                                <div className="font-semibold text-base">${hotel?.rooms[0].roomPrice}</div>
                                <div className="text-xs">/ 24hrs</div>
                            </>}
                        </div>
                    {isMyHotels && <Button onClick={() => router.push(`/hotel/${hotel.id}`)} variant='outline'>Edit</Button>}
                    </div>
                </div>
            </div>
        </div>
    );

};


export default HotelCard;