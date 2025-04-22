import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const uploadReceipt = async (
  receiptFile: File,
  env: {
    R2_BUCKET: string;
    R2_ACCESS_KEY: string;
    R2_ACCESS_ID: string;
    R2_ENDPOINT: string;
    R2_PUBLIC_URL: string;
  },
) => {
  console.log("Starting receipt upload");

  const s3 = new S3Client({
    endpoint: env.R2_ENDPOINT,
    credentials: {
      accessKeyId: env.R2_ACCESS_ID,
      secretAccessKey: env.R2_ACCESS_KEY,
    },
    region: "auto", // for Cloudflare R2
  });

  const uniqueFileName = `receipts/${Date.now()}`;

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
      }),
    );

    console.log("Uploaded file successfully");
  } catch (err) {
    console.error("Failed to upload file", err);
    throw err;
  }

  // Generate the file URL using the public bucket URL from env
  const receiptUrl = `${env.R2_PUBLIC_URL}/${uniqueFileName}`;

  console.log("Receipt url", receiptUrl);

  return receiptUrl;
};
