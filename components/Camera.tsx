"use client";

import React from "react";

import Webcam from "react-webcam";
import { Button } from "./Button";
import Image from "next/image";
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
import { Copy, RefreshCw } from "lucide-react";

export async function copyTextToClipboard(text: string) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

export function Camera() {
  const webcamRef = React.useRef<Webcam>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [cameraDirection, setCameraDirection] = React.useState("environment");
  const [imgSrc, setImgSrc] = React.useState<string | null | undefined>(null);
  const [response, setResponse] = React.useState<string | null | undefined>(
    null
  );

  const capture = React.useCallback(async () => {
    setIsLoading(true);
    const imageSrc = webcamRef?.current?.getScreenshot();
    setImgSrc(imageSrc);
    const repsonse = await fetch("api/upload", {
      method: "POST",
      body: JSON.stringify({ imageSrc }),
    });
    const json = await repsonse.json();

    setResponse(json.data);
    setIsLoading(false);
  }, [webcamRef]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Camera</CardTitle>
        <CardDescription>Take a piccy</CardDescription>
      </CardHeader>
      <CardContent>
        {imgSrc ? (
          <div className="mb-2 py-2 min-h-[220px] flex justify-center items-center rounded-md border border-dashed border-gray-200">
            <Image src={imgSrc} alt="webcam" height={220} width={220} />
          </div>
        ) : (
          <div className="mb-2 py-2 min-h-[220px] flex justify-center items-center rounded-md border border-dashed border-gray-200 relative">
            <Webcam
              ref={webcamRef}
              height={220}
              width={220}
              screenshotFormat="image/png"
              videoConstraints={{ facingMode: cameraDirection }}
            />
            <button
              className="absolute rounded-full border border-gray-200 flex justify-center items-center right-2 bottom-2 h-12 w-12 p-2 bg-white"
              onClick={() => {
                setCameraDirection(
                  cameraDirection === "user" ? "environment" : "user"
                );
              }}
            >
              <RefreshCw />
            </button>
          </div>
        )}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name">Generated code</Label>
          <div className="flex gap-4">
            <Input
              id="name"
              placeholder="Generated code will come"
              value={response || ""}
              disabled
            />
            <Button
              onClick={() => copyTextToClipboard(response || "")}
              disabled={!response}
            >
              <Copy className="h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => {
            setImgSrc(null);
            setResponse(null);
          }}
        >
          Cancel
        </Button>
        {imgSrc ? (
          <a href={imgSrc} download>
            <Button>Download</Button>
          </a>
        ) : (
          <Button onClick={capture}>
            {isLoading ? "Loading..." : "Capture"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
