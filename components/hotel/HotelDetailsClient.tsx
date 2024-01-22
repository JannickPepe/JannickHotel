'use client';

import { Booking } from "@prisma/client";
import { HotelWithRooms } from "./AddHotelForm";
import useLocation from "@/hooks/useLocations";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { Car, Clapperboard, Dumbbell, MapPin, Shirt, ShoppingBasket, Utensils, Wine } from "lucide-react";
import { FaSwimmer, FaHotTub } from "react-icons/fa";
import RoomCard from "../room/RoomCard";



const HotelDetailsClient = ({hotel, bookings}: {hotel: HotelWithRooms, bookings?: Booking[]}) => {

    // Destrcutor some functions from locations
    const { getCountryByCode, getStateByCode } = useLocation();

    const country = getCountryByCode(hotel.country);

    const state = getStateByCode(hotel.country, hotel.state);

    return ( 
        <div className="flex flex-col gap-6 pb-2">

            <div className="aspect-square mx-auto overflow-hidden relative w-full h-[200px] md:h-[400px] rounded-lg z-0">
                <Image className="object-cover" fill src={hotel.image} alt={hotel.title} />
            </div>

            <div>
                <h3 className="font-semibold text-xl md:text-3xl">{hotel.title}</h3>
                <div className="font-semibold mt-4">
                    <AmenityItem><MapPin className="h-4 w-4" /> {country?.name} - {state?.name} - {hotel.city}</AmenityItem>
                </div>
                <h3 className="font-semibold text-lg mt-4 mb-2">Location Details</h3>
                <p className="text-primary/90 mb-2">{hotel.locationDescription}</p>
                <h3 className="font-semibold text-lg mt-4 mb-2">About this hotel</h3>
                <p className="text-primary/90 mb-2">{hotel.description}</p>
                <h3 className="font-semibold text-lg mt-4 mb-2">Popular Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 content-start text-sm">
                    {hotel.swimmingPool && <AmenityItem><FaSwimmer size={18} /> Pool</AmenityItem>}
                    {hotel.gym && <AmenityItem><Dumbbell className="w-4 h-4" /> Gym</AmenityItem>}
                    {hotel.spa && <AmenityItem><FaHotTub size={18} /> Spa</AmenityItem>}
                    {hotel.bar && <AmenityItem><Wine className="w-4 h-4" /> Bar</AmenityItem>}
                    {hotel.laundry && <AmenityItem><Shirt size={18} /> Laundry Facilities</AmenityItem>}
                    {hotel.restaurant && <AmenityItem><Utensils className="w-4 h-4" /> Restaurant</AmenityItem>}
                    {hotel.shopping && <AmenityItem><ShoppingBasket className="w-4 h-4" /> Shopping</AmenityItem>}
                    {hotel.freeParking && <AmenityItem><Car className="w-4 h-4" /> Free Parking</AmenityItem>}
                    {hotel.movieNights && <AmenityItem><Clapperboard className="w-4 h-4" /> Movie Nights</AmenityItem>}
                    {hotel.coffeeShop && <AmenityItem><Wine className="w-4 h-4" /> Coffee Shop</AmenityItem>}
                </div>
            </div>

            <div>
            {!!hotel.rooms.length && 
                <div>
                    <h3 className="text-lg font-semibold my-4">Hotel Rooms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {hotel.rooms.map((room) => {
                            return <RoomCard hotel={hotel} room={room} key={room.id} bookings={bookings} />
                        })}
                    </div>
                </div>
            }
        </div>

        </div>
    );

};


export default HotelDetailsClient;