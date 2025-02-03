"use server";
import { expensesSchema } from "@/lib/zod-schemas";
import { authActionClient } from "./safe-action";
import { S3Client } from "bun";
import { env } from "env";
import { z } from "zod";

export const extractReceiptSchema = z.object({
  receiptFile: z.instanceof(File),
});

export const extractReceipt = authActionClient
  .schema(extractReceiptSchema)
  .action(async ({ clientInput }) => {
    const s3 = new S3Client({
      endpoint: env.R2_ENDPOINT,
      accessKeyId: env.R2_ACCESS_ID,
      secretAccessKey: env.R2_ACCESS_KEY,
      bucket: env.R2_BUCKET,
    });

    // return receiptUrl;
    const uniqueFileName = `receipts/${Date.now()}-${
      clientInput.receiptFile.name
    }`;

    // Upload the file to the "receipts" folder
    await s3.write(uniqueFileName, clientInput.receiptFile, {
      type: clientInput.receiptFile.type,
      acl: "public-read",
    });

    // Generate the file URL
    const receiptUrl = `${env.R2_ENDPOINT}/${env.R2_BUCKET}/${uniqueFileName}`;

    return receiptUrl;
  });

export const createExpense = authActionClient
  .schema(expensesSchema)
  .action(async () => {});
