import { createRouteHandler } from "uploadthing/next";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

interface FileUploadMetadata {
  userId: string;
}

interface FileUploadResponse {
  metadata: FileUploadMetadata;
  file: {
    url: string;
    name: string;
    size: number;
  };
}

const ourFileRouter = {
  businessLogo: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      return { userId: "user" };
    })
    .onUploadComplete(async ({ metadata, file }: FileUploadResponse) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
}); 