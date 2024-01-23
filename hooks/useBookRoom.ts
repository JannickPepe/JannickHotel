
import { Room } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";


// Interface for BookRoomStore which we be connected to types by setRoomData and being used in our useBookRoom const
interface BookRoomStore {
  bookingRoomData: RoomDataType | null;
  paymentIntentId: string | null;
  clientSecret: string | undefined;
  setRoomData: (data: RoomDataType) => void;
  setPaymentIntentId: (paymentIntentId: string) => void;
  setClientSecret: (clientSecret: string) => void;
  resetBookRoom: () => void;
}

// Type - where we define the RoomDataType
type RoomDataType = {
  room: Room;
  totalPrice: number;
  breakFastIncluded: boolean;
  startDate: Date;
  endDate: Date;
};


// Usage of useBookRoom with persist and we invoke that with the () after <BookRoomStore>
const useBookRoom = create<BookRoomStore>()(
  // Usage of persist where we have set as the first parameter with the given properties and then we have name: "BookRoom" as second paremeter with the property name.
  persist(
    (set) => ({
      bookingRoomData: null,
      paymentIntentId: null,
      clientSecret: undefined,
      setRoomData: (data: RoomDataType) => {
        set({ bookingRoomData: data });
      },
      setPaymentIntentId: (paymentIntentId: string) => {
        set({ paymentIntentId });
      },
      setClientSecret: (clientSecret: string) => {
        set({ clientSecret });
      },
      resetBookRoom: () => {
        set({
          bookingRoomData: null,
          paymentIntentId: null,
          clientSecret: undefined,
        });
      },
    }),
    // We use LocalStorage as default
    {
      name: "BookRoom",
    }
  )

);


export default useBookRoom;
