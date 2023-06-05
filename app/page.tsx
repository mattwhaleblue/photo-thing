import React from "react";

import { Camera } from "@/components/Camera";
import { Checker } from "@/components/Checker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";

export default function Home() {
  return (
    <main className="w-full pt-4 flex justify-center items-center">
      <Tabs defaultValue="take" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="take">Take a photo</TabsTrigger>
          <TabsTrigger value="check">Check a photo</TabsTrigger>
        </TabsList>
        <TabsContent value="take">
          <Camera />
        </TabsContent>
        <TabsContent value="check">
          <Checker />
        </TabsContent>
      </Tabs>
    </main>
  );
}
