'use client';

import qs from "query-string";
import { Input } from "./ui/input";
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useDebounceValue } from "@/hooks/useDebounceValue";

const SearchInput = () => {

    // To get our title
    const searchParams = useSearchParams();
    const title = searchParams.get('title');

    // default state with value - empty string 
    const [value, setValue] = useState(title || '');

    const pathname = usePathname();
    const router = useRouter();

    // Using debounce with type string for not having every character to request from the DB. 
    const debounceValue = useDebounceValue<string>(value);

    // useEffect - setup what should be shown in our new state
    useEffect(() => {
        const query = {
            title: debounceValue
        }

        const url = qs.stringifyUrl({
            url: window.location.href,
            query,
        }, {skipNull: true, skipEmptyString: true})

        router.push(url)
    }, [debounceValue, router])

    // create onChange function with a type onto interface HTMLInputElement. Pass parameter e 
    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {{
        setValue(e.target.value)
    }}

    // boolean for pathname 
    if(pathname !== '/') return null


    return (
        <div className="relative sm:block hidden">
            <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
            <Input value={value} onChange={onChange} placeholder="Search" className="pl-10 bg-primary/10" />
        </div>
    );

};


export default SearchInput;
