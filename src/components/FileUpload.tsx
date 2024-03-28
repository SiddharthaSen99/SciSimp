"use client";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// https://github.com/aws/aws-sdk-js-v3/issues/4126

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("https://www.scisimp.com" + "/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb!
        toast.error("File too large");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        console.log("meow", data);
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong");
          return;
        }
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created!");
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            toast.error("Error creating chat");
            console.error(err);
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });
  return (
    <div className="p-1 bg-white rounded-xl"> {/* Reduced outer padding for a tighter look */}
      <div
        {...getRootProps({
          className: "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-2 px-6 flex justify-center items-center flex-col min-h-[80px] max-w-md", // Further adjusted padding, reduced min-height, and adjusted max-width
        })}
      >
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" /> {/* Scaled down icons */}
            <p className="mt-1 text-xs text-slate-400">Spilling Tea to GPT...</p> {/* Reduced margin-top and font size */}
          </>
        ) : (
          <>
            <Inbox className="w-8 h-8 text-blue-500" /> {/* Scaled down icons */}
            <p className="mt-1 text-xs text-slate-400">New Conversation</p> {/* Reduced margin-top and font size */}
          </>
        )}
      </div>
    </div>
  );
};


export default FileUpload;
