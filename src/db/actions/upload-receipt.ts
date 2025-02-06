import "server-only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "env";

export const uploadReceipt = async (receiptFile: File) => {
  console.log("Starting upload");

  const s3 = new S3Client({
    endpoint: env.R2_ENDPOINT,
    credentials: {
      accessKeyId: env.R2_ACCESS_ID,
      secretAccessKey: env.R2_ACCESS_KEY,
    },
    region: "auto", // for Cloudflare R2
  });

  const uniqueFileName = `receipts/${Date.now()}-${receiptFile.name}`;

  try {
    // Convert File to Buffer
    const buffer = Buffer.from(await receiptFile.arrayBuffer());

    await s3.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET,
        Key: uniqueFileName,
        Body: buffer,
        ContentType: receiptFile.type,
        ACL: "public-read",
      })
    );

    console.log("Uploaded file successfully");
  } catch (err) {
    console.error("Failed to upload file", err);
    throw err;
  }

  // Generate the file URL using the public bucket URL from env
  const receiptUrl = `${env.R2_PUBLIC_URL}/${uniqueFileName}`;

  return receiptUrl;
};
