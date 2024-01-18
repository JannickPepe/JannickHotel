import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


// Update Functionality
export async function PATCH(req: Request, {params}: {params: {hotelId: string}}) {

    try{
        const body = await req.json();
        const { userId } = auth();

        if(!params.hotelId) {
            return new NextResponse('HotelId is required!!', {status: 400});
        }

        if(!userId) {
            return new NextResponse('Unauthorized', {status: 401});
        };

        const hotel = await prismadb.hotel.update({
            where: {
                id: params.hotelId,
            },
            data: {
                ...body,
            }
        });

        return NextResponse.json(hotel);

    } catch (error) {
        console.log('Error at /api/hotel/hotelId PATCH', error);

        return new NextResponse('Internal Server Error', {status: 500});
    };

};


// Delete functionality
export async function DELETE(req: Request, {params}: {params: {hotelId: string}}) {

    try{
        const { userId } = auth();

        if(!params.hotelId) {
            return new NextResponse('HotelId is required!!', {status: 400});
        }

        if(!userId) {
            return new NextResponse('Unauthorized', {status: 401});
        };

        const hotel = await prismadb.hotel.delete({
            where: {
                id: params.hotelId,
            }
        });

        return NextResponse.json(hotel);

    } catch (error) {
        console.log('Error at /api/hotel/hotelId DELETE', error);

        return new NextResponse('Internal Server Error', {status: 500});
    };

};