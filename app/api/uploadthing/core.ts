import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();


export const ourFileRouter = {

    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1, } })

    .middleware(async ({ req }) => {
        const { userId } = auth()

        if (!userId) throw new Error("Unauthorized");

        return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.url);
    
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
    }),

} satisfies FileRouter;


export type OurFileRouter = typeof ourFileRouter;