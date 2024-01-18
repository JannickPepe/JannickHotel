'use client'

import * as z from 'zod';
import { Hotel, Room } from "@prisma/client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { useEffect, useState } from 'react';
import { UploadButton } from '../uploadthing';
import { useToast } from '../ui/use-toast';
import Image from 'next/image';
import { Button } from '../ui/button';
import { CheckCircle, Eye, Loader2, Pencil, PencilLine, PlusCircle, Terminal, Trash, XCircle } from 'lucide-react';
import axios from "axios";
import useLocation from '@/hooks/useLocations';
import { ICity, IState } from 'country-state-city';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import AddRoomForm from '../room/AddRoomForm';



interface AddHotelFormProps {
    hotel: HotelWithRooms | null;
};


export type HotelWithRooms = Hotel &  {
    rooms: Room[];
};

const formSchema = z.object({
    title: z.string().min(3, {
        message: 'Title must be at least 3 characters long'
    }),
    description: z.string().min(10, {
        message: 'Description must be at least 10 characters long'
    }),
    image: z.string().min(1, {
        message: 'Image is required'
    }), 
    country: z.string().min(1, {
        message: 'Country is required'
    }), 
    state: z.string().optional(), 
    city: z.string().optional(), 
    locationDescription: z.string().min(10, {
        message: 'Location description must be at least 3 characters long'
    }),
    gym: z.boolean().optional(),
    spa: z.boolean().optional(),
    bar: z.boolean().optional(),
    laundry: z.boolean().optional(), 
    restaurant: z.boolean().optional(), 
    shopping: z.boolean().optional(), 
    freeParking: z.boolean().optional(), 
    bikeRental: z.boolean().optional(),
    freeWifi: z.boolean().optional(), 
    movieNights: z.boolean().optional(), 
    swimmingPool: z.boolean().optional(), 
    coffeeShop: z.boolean().optional(),
});


const AddHotelForm = ({hotel} : AddHotelFormProps) => {

    const [image, setImage] = useState<string | undefined>(hotel?.image);
    const [imageIsDeleting, setImageIsDeleting] = useState(false);

    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    // create the state for delete hotel
    const [isHotelDeleting, setIsHotelDeleting] = useState(false);

    // state for your room dialog
    const [open, setOpen] = useState(false);

    const { toast } = useToast();

    const router = useRouter();

    // Destructur from our useLocation objects
    const { getAllCountries, getCountrystates, getStateCities } = useLocation();
    
    // get All Countries by setting countries to the getAll method
    const countries = getAllCountries();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        // If we dont have hotel these empty fields will be applied
        defaultValues: hotel || {
            title: '',
            description: '', 
            image: '',
            country: '',
            state: '',
            city: '',
            locationDescription: '', 
            gym: false, 
            spa: false,  
            bar: false,  
            laundry: false,  
            restaurant: false,  
            shopping: false,  
            freeParking: false,  
            bikeRental: false,  
            freeWifi: false,  
            movieNights: false,  
            swimmingPool: false,  
            coffeeShop: false,  
        },
    });


    // UseEffect for the hotel image upload in creating
    useEffect(() => {
        if(typeof image === 'string') {
            form.setValue('image', image, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            })
        }
    }, [image])

    // We will use useEffect and watch method to the string country
    useEffect(() => {
        const selectedCountry = form.watch('country');

        const countryStates = getCountrystates(selectedCountry);
        if (countryStates) {
            setStates(countryStates);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch('country')])

    // useEffect for updating our cities
    useEffect(() => {
        const selectedCountry = form.watch('country');
        const selectedState = form.watch('state');
        const stateCities = getStateCities(selectedCountry, selectedState)
        if (stateCities) {
            setCities(stateCities);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch('country'), form.watch('state')])


    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        // Perform a check
        if(hotel) {
            // update
            axios.patch(`/api/hotel/${hotel.id}`, values).then((res) => {
                toast({
                    variant: 'success',
                    description: 'Hotel Updated!!'
                })
                router.push(`/hotel/${res.data.id}`)
                setIsLoading(false)
            }).catch((err) => {
                console.log(err);
                toast({
                    variant: 'destructive',
                    description: 'Something went wrong!!'
                })
                setIsLoading(false)
            })
        } else {
            axios.post('/api/hotel', values).then((res) => {
                toast({
                    variant: 'success',
                    description: 'Hotel Created!!'
                })
                router.push(`/hotel/${res.data.id}`)
                setIsLoading(false)
            }).catch((err) => {
                console.log(err);
                toast({
                    variant: 'destructive',
                    description: 'Something went wrong!!'
                })
                setIsLoading(false)
            })
        }
    };

    // Create our OnClick function handleDeleteHotel
    const handleDeleteHotel = async (hotel: HotelWithRooms) => {
        setIsHotelDeleting(true);

        // Getting the ImageKey whenever we call that function
        const getImageKey = (src: string) => src.substring(src.lastIndexOf('/') + 1)

        try {
            const imagekey = getImageKey(hotel.image);
            await axios.post('/api/uploadthing/delete', {imagekey});
            await axios.delete(`/api/hotel/${hotel.id}`);

            setIsHotelDeleting(false);
            toast({
                variant: 'success',
                description: 'Hotel Deleted!!'
            })
            // change the URL after hotel has been deleted
            router.push('/hotel/new')

        } catch (error: any) {
            console.log(error);

            setIsHotelDeleting(false);
            toast({
                variant: 'destructive',
                description: `Hotel deletion could not be completed!! ${error.message}`
            })
        }
    };

    // Create our Onclick function handleImageDelet
    const handleImageDelete = (image: string) => {
        setImageIsDeleting(true);
        const imagekey = image.substring(image.lastIndexOf('/') + 1);

        axios.post('/api/uploadthing/delete', {imagekey}).then((res) => {
            if(res.data.success) {
                setImage('');
                toast({
                    variant: 'success',
                    description: 'Image Removed'
                })
            }
        }).catch(() => {
            toast({
                variant: 'destructive',
                description: 'Something went wrong!!'
            })
        }).finally(() => {
            setImageIsDeleting(false)
        })
    };

    // Create the handleDialogueOpen function
    const handleDialogueOpen = () => {
        // get the oppisite of the previous state
        setOpen(prev => !prev)
    }


    return ( 
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <h3 className='text-lg font-semibold'>{hotel ? 'Update your Hotel!' : 'Descripe your Hotel!'}</h3>
                    <div className='flex flex-col md:flex-row gap-6'>
                        <div className='flex-1 flex flex-col gap-6'>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hotel Title *</FormLabel>
                                        <FormDescription>
                                            Provide your Hotel name
                                        </FormDescription>
                                        <FormControl>
                                            <Input placeholder="Beach Hotel" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hotel Description *</FormLabel>
                                        <FormDescription>
                                            Provide your Description
                                        </FormDescription>
                                        <FormControl>
                                            <Textarea placeholder="Jannicks Hotel contains the best luxerious service" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div>
                                <FormLabel>Choose Amenities</FormLabel>
                                <FormDescription>Choose Popular Amenities at your Hotel</FormDescription>
                                <div className='grid grid-cols-2 gap-4 mt-2'>
                                    <FormField 
                                        control={form.control}
                                        name="gym"
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className='dark:text-blue-500'>Gym</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField 
                                        control={form.control}
                                        name="spa"
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className='dark:text-blue-500'>Spa</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField 
                                        control={form.control}
                                        name="bar"
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className='dark:text-blue-500'>Bar n Pubs</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField 
                                        control={form.control}
                                        name="laundry"
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className='dark:text-blue-500'>Laundry Machines</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField 
                                        control={form.control}
                                        name="restaurant"
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className='dark:text-blue-500'>Restaurant</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField 
                                        control={form.control}
                                        name="shopping"
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className='dark:text-blue-500'>Shopping Facilities</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField 
                                        control={form.control}
                                        name="freeParking"
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className='dark:text-blue-500'>Free Parking</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField 
                                        control={form.control}
                                        name="bikeRental"
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className='dark:text-blue-500'>Bike Rentals</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField 
                                        control={form.control}
                                        name="freeWifi"
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className='dark:text-blue-500'>Free Wifi</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField 
                                        control={form.control}
                                        name="movieNights"
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className='dark:text-blue-500'>Movie theatres</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField 
                                        control={form.control}
                                        name="swimmingPool"
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className='dark:text-blue-500'>Swimming Pool</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField 
                                        control={form.control}
                                        name="coffeeShop"
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className='dark:text-blue-500'>Coffe Shop</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <FormField 
                                control={form.control}
                                name='image'
                                render={({field}) => (
                                    <FormItem className='flex flex-col space-y-3'>
                                        <FormLabel>Upload an Image *</FormLabel>
                                        <FormDescription>Choose an Image for your Hotel</FormDescription>
                                        <FormControl>
                                            {image ? 
                                            <>
                                                <div className='relative max-w-[400px] min-w-[200px] max-h[400px] min-h-[200px] mt-4'>
                                                    <Image fill src={image} alt='Hotal Image' className='object-contain' />
                                                    <Button onClick={() => handleImageDelete(image)} type='button' size='icon' variant='ghost' className='absolute right-[-12px] top-0'>
                                                        { imageIsDeleting ? <Loader2 /> : <XCircle /> }
                                                    </Button>
                                                </div>
                                            </> : 
                                            <>
                                                <div className='flex flex-col items-center max-w-[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4'>
                                                    <UploadButton
                                                        endpoint="imageUploader"
                                                        onClientUploadComplete={(res) => {
                                                            // Do something with the response
                                                            console.log("Files: ", res);
                                                            setImage(res[0].url)
                                                            toast({
                                                                variant: 'success',
                                                                description: 'Upload Completed'
                                                            })
                                                        }}
                                                        onUploadError={(error: Error) => {
                                                            // Do something with the error.
                                                            toast({
                                                                variant: 'destructive',
                                                                description: `ERROR ${error.message}`
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </>}
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex-1 flex flex-col gap-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <FormField 
                                    control={form.control}
                                    name='country'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>select a country *</FormLabel>
                                            <FormDescription>In which country is your property located?</FormDescription>
                                            <Select
                                                disabled={isLoading}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                            >
                                            <SelectTrigger className="bg-background">
                                                <SelectValue defaultValue={field.value} placeholder="Select a Country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countries.map((country) => {
                                                    return  <SelectItem key={country.isoCode} value={country.isoCode}>{country.name}</SelectItem> 
                                                })}
                                            </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control}
                                    name='state'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Select a State *</FormLabel>
                                            <FormDescription>In which state is your property located?</FormDescription>
                                            <Select
                                                disabled={isLoading || states.length < 1}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                            >
                                            <SelectTrigger className="bg-background">
                                                <SelectValue defaultValue={field.value} placeholder="Select a State" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {states.map((state) => {
                                                    return  <SelectItem key={state.isoCode} value={state.isoCode}>{state.name}</SelectItem> 
                                                })}
                                            </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField 
                                control={form.control}
                                name='city'
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>select City</FormLabel>
                                        <FormDescription>In which city is your property located?</FormDescription>
                                        <Select
                                            disabled={isLoading || cities.length < 1}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                        <SelectTrigger className="bg-background">
                                            <SelectValue defaultValue={field.value} placeholder="Select a City" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cities.map((city) => {
                                                return  <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem> 
                                            })}
                                        </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="locationDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location description *</FormLabel>
                                        <FormDescription>
                                            Provide your location description of your Hotel
                                        </FormDescription>
                                        <FormControl>
                                            <Textarea placeholder="Located at the very end of the world" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {hotel && !hotel.rooms.length && <Alert className='bg-indigo-600 text-white'>
                                <Terminal className="h-4 w-4 stroke-white" />
                                <AlertTitle>One Last Step!</AlertTitle>
                                <AlertDescription>
                                    Your Hotel was created successfully<CheckCircle className='ml-2 h-4 w-4 inline-block text-lime-500' />
                                    <div>- Please add some Rooms to complete your Hotel setup</div>
                                </AlertDescription>
                            </Alert>}

                            <div className='flex flex-wrap justify-between gap-2'>
                                {/* Delete button */}
                                {
                                    hotel && <Button onClick={() => handleDeleteHotel(hotel)} variant='ghost' type='button' className='max-w-[150px]' disabled={isHotelDeleting || isLoading} >
                                        {isHotelDeleting ? 
                                        <><Loader2 className='mr-2 h-4 w-4'/> Deleting</> 
                                        : 
                                        <><Trash className='mr-2 h-4 w-4'/> Delete</>}
                                    </Button>
                                }

                                {/* View button */}
                                {hotel && <Button onClick={() => router.push(`/hotel-details/${hotel.id}`)} variant='outline' type='button'><Eye className='mr-2 h-4 w-4' /> View</Button>}

                                {/* Open Modal button */}
                                {hotel && 
                                    <Dialog open={open} onOpenChange={setOpen} >
                                        <DialogTrigger>
                                            <Button type='button' variant='outline' className='max-w-[150px]' >
                                                <PlusCircle className='mr-2 h-4 w-4' /> Add Room
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-[900px] w-[90%]">
                                            <DialogHeader className='px-2'>
                                                <DialogTitle>Add a Room</DialogTitle>
                                                <DialogDescription>
                                                    Add the details about the Room in the Hotel
                                                </DialogDescription>
                                            </DialogHeader>
                                            <AddRoomForm hotel={hotel} handleDialogueOpen={handleDialogueOpen}/>
                                        </DialogContent>
                                    </Dialog>
                                }

                                {/* Updating button */}
                                {
                                    hotel ? 
                                    <Button className='max-w-[150px]' disabled={isLoading}>
                                        {isLoading ? <><Loader2 className='mr-2 h-4 w-4' /> Updating</> 
                                        : <><PencilLine className='mr-2 h-4 w-4' /> Update</>}
                                    </Button> 
                                    : 
                                    <Button className='max-w-[150px]' disabled={isLoading}>
                                        {isLoading ? <><Loader2 className='mr-2 h-4 w-4' /> Creating</> 
                                        : <><Pencil className='mr-2 h-4 w-4' /> Create Hotel</>}
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );

};


export default AddHotelForm;