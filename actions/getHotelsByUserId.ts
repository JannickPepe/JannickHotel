
import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs";

// we do not pass any id in the async method like we did with gotHotelById, because we got the userId from Clerk
export const getHotelsByUserId = async() => {

    try {
        const { userId } = auth()

        // Check if userId excist
        if(!userId) {
            throw new Error('Unauthorized')
        }

        const hotels = await prismadb.hotel.findMany({
            where: {
                userId
            },
            include: {
                rooms: true,
            },
        });

        if(!hotels) return null;
        
        return hotels;
        
    } catch (error: any) {
        throw new Error(error)
    }

};