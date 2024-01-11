import { PrismaClient } from "@prisma/client";

// Set your variable prisma to PrismaClient and declare it global
declare global {
    var primsa: PrismaClient | undefined;
};

// construc prismadb and set it equal to global on the prisma or make a new PrismaClient
const prismadb = globalThis.primsa || new PrismaClient();

//
if(process.env.NODE_ENV !== 'production') globalThis.primsa = prismadb;


export default prismadb;
