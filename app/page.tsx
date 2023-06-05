import React from "react";

import { Camera } from "@/components/Camera";
import { Checker } from "@/components/Checker";

const style = "w-96 border border-white p-6 gap-6";

export default function Home() {
  return (
    <main>
      <div className="p-12 h-screen flex gap-8 w-full justify-center items-center">
        <div className={style}>
          <Camera />
        </div>
        <div className={style}>
          <Checker />
        </div>
      </div>
    </main>
  );
}
