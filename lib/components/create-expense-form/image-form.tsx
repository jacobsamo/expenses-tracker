import type { CreateNewExpenseSchema } from "@/lib/zod-schemas";
import imageCompress from "browser-image-compression";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

const ImageForm = () => {
  const form = useFormContext<z.infer<typeof CreateNewExpenseSchema>>();
  const [loadingImage, setLoadingImage] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const imageUrl = uploadFile
    ? URL.createObjectURL(uploadFile)
    : form.watch("content.expense.receiptUrl");

  const setFile = (file: File) => {
    setUploadFile(file);
    form.setValue("type", "receipt");
    form.setValue("content.receiptFile", file);
  };

  const convertToJpg = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d", { alpha: false });
          ctx!.drawImage(img, 0, 0);
          const jpgDataUrl = canvas.toDataURL("image/jpeg");
          resolve(jpgDataUrl);
        };
        img.onerror = (e) => {
          console.error("Error converting image to jpg", e);
          reject(e);
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (file: File) => {
    try {
      setLoadingImage(true);
      console.log("File: ", file);
      let convertedFile = file;

      if (file.type != "image/jpeg") {
        if (file.type === "image/heic" || file.type === "image/heif") {
          const heic2Any = (await import("heic2any")).default; // dynamic import
          const blob = await heic2Any({ blob: file, toType: "image/jpeg" });

          convertedFile = new File(
            [blob as Blob],
            file.name.replace(/\.heic$/i, ".jpeg"),
            { type: "image/jpeg" },
          );
        } else {
          const jpgDataURL = await convertToJpg(file);
          const blob = await (await fetch(jpgDataURL)).blob();

          convertedFile = new File([blob], file.name.replace(/\.[^.]*/i, ".jpeg"), {
            type: "image/jpeg",
          });
        }
      }

      if (convertedFile.size > 1024 * 1024 * 2) {
        convertedFile = await imageCompress(convertedFile, {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
      }

      setLoadingImage(false);
      setFile(convertedFile);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Error processing image", {
        description: "Try uploading a jpeg or png instead",
      });
      setLoadingImage(false);
    }
  };

  return (
    <>
      <Dropzone
        onDrop={(acceptedFiles: File[]) => {
          console.log("Files uploaded", acceptedFiles);
          handleFileChange(acceptedFiles[0]!);
        }}
        maxFiles={1}
        // maxSize={1024 * 1024 * 3}
        // accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-700 hover:bg-gray-600"
          >
            {!imageUrl && !loadingImage && (
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <Upload className="mb-3 h-10 w-10 text-gray-400" />
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG</p>
                <p className="text-xs text-gray-400">Max size 3mb</p>
              </div>
            )}
            {imageUrl && !loadingImage && (
              <img
                src={imageUrl ?? "/placeholder.svg"}
                alt="uploaded image"
                className="h-full w-full rounded-lg object-cover"
              />
            )}
            {loadingImage && (
              <div className="flex flex-col items-center justify-center">
                Uploading image...
                <Loader2 className="h-16 w-16 animate-spin" />
              </div>
            )}

            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>
    </>
  );
};

export default ImageForm;
