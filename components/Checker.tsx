"use client";

import React from "react";
import { FileUploader } from "react-drag-drop-files";
import { Button } from "./Button";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Label } from "./label";
import { Input } from "./input";

async function imageUploaded(file: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = function () {
      const base64String = (reader?.result as string)
        ?.replace("data:", "")
        .replace(/^.+,/, "");

      resolve(base64String);
    };
    reader.readAsDataURL(file);
  });
}

export function Checker() {
  const [words, setWords] = React.useState<string>("");
  const [file, setFile] = React.useState<string | null | undefined>(null);
  const [response, setResponse] = React.useState<boolean | null | undefined>(
    null
  );

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    console.log("accepted files", acceptedFiles);
    const base64 = await imageUploaded(acceptedFiles[0]);
    setFile(`data:image/png;base64,${base64}`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async () => {
    const response = await fetch("api/check", {
      method: "POST",
      body: JSON.stringify({
        imageSrc: file,
        words,
      }),
    });
    const json = await response.json();

    setResponse(json.data);
  };

  const isLegit = response === true;
  const isNotLegit = response === false;

  return (
    <Card
      className={
        response === null ? "" : isLegit ? "border-green-400" : "border-red-400"
      }
    >
      {response === null && (
        <CardHeader>
          <CardTitle>Checker</CardTitle>
          <CardDescription>Check if image is legit</CardDescription>
        </CardHeader>
      )}
      {isLegit && (
        <CardHeader>
          <CardTitle className="text-green-400">Checker</CardTitle>
          <CardDescription className="text-green-400">
            Image is legit
          </CardDescription>
        </CardHeader>
      )}
      {isNotLegit && (
        <CardHeader>
          <CardTitle className="text-red-400">Checker</CardTitle>
          <CardDescription className="text-red-400">
            Image is NOT legit
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        {file ? (
          <div className="mb-2 py-2 min-h-[220px] flex justify-center items-center rounded-md border border-dashed border-gray-200">
            <Image src={file} alt="webcam" width={220} height={220} />
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="mb-2 py-2 min-h-[220px] flex justify-center items-center rounded-md border border-dashed border-gray-200"
          >
            Drop image here
            <input {...getInputProps()} />
          </div>
        )}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name">Code</Label>
          <Input
            id="name"
            placeholder="Code to check"
            value={words}
            onChange={(e) => setWords(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => {
            setWords("");
            setFile(null);
            setResponse(null);
          }}
        >
          Cancel
        </Button>
        <Button
          className={
            response === null ? "" : isLegit ? "bg-green-400" : "bg-red-400"
          }
          onClick={() => handleSubmit()}
        >
          Check
        </Button>
      </CardFooter>
    </Card>
  );
}
