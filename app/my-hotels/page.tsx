
import { getHotelsByUserId } from "@/actions/getHotelsByUserId";
import HotelList from "@/components/hotel/HotelList";


const MyHotels = async() => {

    // construct the hotels with given props and pass it as a promise with getHotelsByUserId and invoke it with new values
    const hotels = await getHotelsByUserId();

    // if no hotels return div txt
    if(!hotels) {
        return <div>No hotels found!</div>
    }


    return ( 
        <div>
            <h2 className="text-2xl font-semibold">Here are your hotel properties</h2>
            {/* pass down hotels propery and pass it the hotels const */}
            <HotelList hotels={hotels} />
        </div>
    );

};


export default MyHotels;