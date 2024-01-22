import { HotelWithRooms } from "./AddHotelForm";
import HotelCard from "./HotelCard";

// Make HotelWithRooms as an [] so its not a single room we get
const HotelList = ({hotels}: {hotels: HotelWithRooms[]}) => {

    return ( 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-4">
            {hotels.map((hotel) => 
                <div key={hotel.id}>
                    <HotelCard hotel={hotel} />
                </div>
            )}
        </div>
    );

};


export default HotelList;