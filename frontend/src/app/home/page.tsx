"use client";

import Image from "next/image";
import OceanLife from "../../../public/oceanlife.png";
import Pollution from "../../../public/pollution.png";
import { useState } from "react";

export default function Home() {
  const [isHoveringPollution, setIsHoveringPollution] = useState(false);
  const [isHoveringOceanLife, setIsHoveringOceanLife] = useState(false);

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="flex flex-col bg-[#87AEA5] p-10 rounded-md bg-opacity-80">
        <h1 className="text-5xl mb-12 mx-auto">
          {!isHoveringOceanLife && !isHoveringPollution && "Escolha uma opção"}
          {isHoveringOceanLife && "Relatar vida marinha"}
          {isHoveringPollution && "Relatar poluição"}
        </h1>
        <div className="flex">
          <Image
            src={Pollution}
            alt="pollution"
            className={`w-64 cursor-pointer ${
              isHoveringOceanLife ? "opacity-50" : ""
            }`}
            onMouseEnter={() => setIsHoveringPollution(true)}
            onMouseLeave={() => setIsHoveringPollution(false)}
          />
          <Image
            src={OceanLife}
            alt="ocean-life"
            className={`w-64 cursor-pointer ml-4 ${
              isHoveringPollution ? "opacity-50" : ""
            }`}
            onMouseEnter={() => setIsHoveringOceanLife(true)}
            onMouseLeave={() => setIsHoveringOceanLife(false)}
          />
        </div>
      </div>
    </main>
  );
}
