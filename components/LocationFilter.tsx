'use client'

import qs from "query-string";
import { useEffect, useState } from "react";
import Container from "./Container"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import useLocation from "@/hooks/useLocations";
import { ICity, IState } from "country-state-city";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";


const LocationFilter = () => {

    const [country, setCountry] = useState('');
    const [state, setState] = useState('')
    const [city, setCity] = useState('')
    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);

    const { getAllCountries, getCountrystates, getStateCities } = useLocation();
    const countries = getAllCountries();
    const router = useRouter();
    const params = useSearchParams();

    // When country dependency array gets chnaged in the selector UI with a new country, refresh with new states list and then cities
    useEffect(() => {
        const countryStates = getCountrystates(country)
        if(countryStates) {
            setStates(countryStates)
            setState('')
            setCity('')
        }
    }, [country]);

    // When country and states get changes in the UI selector, refresh the new city list
    useEffect(() => {
        const stateCities = getStateCities(country, state)
        if(stateCities) {
            setCities(stateCities)
            setCity('')
        }
    }, [country, state]);

    // useEffect for all changes
    useEffect(() => {
        if(country === '' && state === '' && city === '') return router.push('/')

        let currentQuery: any = {}

        // if we have params update the current Query
        if(params) {
            // set currentQuery to have qs (query string) then parse it to the new params value
            currentQuery = qs.parse(params.toString())
        }

        if(country) {
            currentQuery = {
                ...currentQuery,
                country
            }
        }

        if(state) {
            currentQuery = {
                ...currentQuery,
                state
            }
        }

        if(city) {
            currentQuery = {
                ...currentQuery,
                city
            }
        }

        if(state === '' && currentQuery.state) {
            delete currentQuery.state
        }

        if(city === '' && currentQuery.city) {
            delete currentQuery.city
        }

        // update the URL
        const url = qs.stringifyUrl({
            url: '/',
            query: currentQuery,
        }, {skipNull: true, skipEmptyString: true})

        router.push(url)
    }, [country, state, city]);

    // Create handleClear function
    const handleClear = () => {
        router.push('/')
        setCountry('')
        setState('')
        setCity('')
    }

    
    return ( 
        <Container> 
            <div className="flex gap-2 md:gap-4 items-center justify-center text-sm">
                <div>
                    <Select onValueChange={(value) => setCountry(value)} value={country}>
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder='Country' />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map((country) => {
                                return <SelectItem key={country.isoCode} value={country.isoCode}>
                                    {country.name}
                                </SelectItem>
                            })}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Select onValueChange={(value) => setState(value)} value={state}>
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder='State' />
                        </SelectTrigger>
                        <SelectContent>
                            {states.length > 0 && states.map((state) => {
                                return <SelectItem key={state.isoCode} value={state.isoCode}>
                                    {state.name}
                                </SelectItem>
                            })}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Select onValueChange={(value) => setCity(value)} value={city}>
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder='City' />
                        </SelectTrigger>
                        <SelectContent>
                            {cities.length > 0 && cities.map((city) => {
                                return <SelectItem key={city.name} value={city.name}>
                                    {city.name}
                                </SelectItem>
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={() => handleClear()} variant='outline'>Clear Filters</Button>
            </div>
        </Container>
    );

};


export default LocationFilter;