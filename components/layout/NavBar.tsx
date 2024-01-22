'use client';

import { UserButton, useAuth } from "@clerk/nextjs";
import Container from "../Container";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import SearchInput from "../SearchInput";
import { ModeToggle } from "../theme-toggle";
import { NavMenu } from "./NavMenu";


const NavBar = () => {

    // Setup the route for our onClick event
    const router = useRouter();

    // Setup our useAuth for Clerk so it knows if its either sign in or logout button to display
    const { userId } = useAuth();


    return (
        <div className="sticky top-0 border border-b-primary/10 bg-secondary z-50">
            <Container>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                        <Image src='/logo.png' alt="hotel logo" width={40} height={30} />
                        <div className="font-bold text-xl">Jannicks Hotel</div>
                    </div>
                    <SearchInput />
                    <div className="flex gap-3 items-center">
                        <div className="flex gap-1 items-center">
                            <ModeToggle />
                            <NavMenu />
                        </div>
                        <UserButton afterSignOutUrl="/" />
                        { !userId && <>
                            <Button onClick={() => router.push('/sign-in')} variant="outline" size="sm">Sign in</Button>
                            <Button onClick={() => router.push('/sign-up')} size="sm" >Sign up</Button>
                        </> }
                    </div>
                </div>
            </Container>
        </div>
    );

};

export default NavBar;
