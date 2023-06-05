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

// export function Checker() {
//   const [words, setWords] = React.useState<string>("");
//   const [file, setFile] = React.useState<string | null | undefined>(null);
//   const [response, setResponse] = React.useState<string | null | undefined>(
//     null
//   );

//   const handleChange = async (file: any) => {
//     const base64 = await imageUploaded(file);
//     setFile(`data:image/png;base64,${base64}`);
//   };

//   const handleSubmit = async () => {
//     const response = await fetch("api/check", {
//       method: "POST",
//       body: JSON.stringify({
//         imageSrc: file,
//         words,
//       }),
//     });
//     const json = await response.json();

//     setResponse(json.data);
//   };

//   return (
//     <div className="flex flex-col justify-center gap-6 items-center">
//       {file ? (
//         <Image src={file} alt="webcam" width={220} height={220} />
//       ) : (
//         <FileUploader
//           handleChange={handleChange}
//           name="file"
//           className="h-42"
//         />
//       )}

//       <input
//         type="text"
//         className="text white border border-white bg-transparent rounded-md p-2"
//         value={words}
//         onChange={(e) => setWords(e.target.value)}
//       />
//       <div className="btn-container flex gap-6">
//         <Button onClick={() => handleSubmit()}>Submit</Button>
//         <Button
//           onClick={() => {
//             setWords("");
//             setFile(null);
//             setResponse(null);
//           }}
//         >
//           Reset
//         </Button>
//       </div>
//       {response !== null && <div>Is legit: {response ? "YES" : "NO"}</div>}
//     </div>
//   );
// }

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
    <Card className={response === null ? "" : isLegit ? "border-green-400" : "border-red-400"}>
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
          <div className="mb-2 h-[220px] flex justify-center items-center rounded-md border border-dashed border-gray-200">
            <Image src={file} alt="webcam" width={220} height={220} />
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="mb-2 h-[220px] flex justify-center items-center rounded-md border border-dashed border-gray-200"
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
        <Button onClick={() => handleSubmit()}>Check</Button>
      </CardFooter>
    </Card>
  );
}
