"use client";

import Image from "next/image";
import OceanLife from "../../../public/oceanlife.png";
import Pollution from "../../../public/pollution.png";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getAxiosLoginInstance } from "@/utils/axios";

export default function Home() {
  const [isHoveringPollution, setIsHoveringPollution] = useState(false);
  const [isSnitchingOnPollution, setIsSnitchingOnPollution] = useState(false);
  const [isHoveringOceanLife, setIsHoveringOceanLife] = useState(false);
  const [isSnitchingOnOceanLife, setIsSnitchingOnOceanLife] = useState(false);

  let axiosLoginInstance = undefined;
  const router = useRouter();
  if (typeof window !== "undefined") {
    axiosLoginInstance = getAxiosLoginInstance(localStorage.getItem("token"));
  }
  useEffect(() => {
    if (axiosLoginInstance !== undefined) {
      axiosLoginInstance
        .get("/verify")
        .then((res) => {
          router.push("/home");
        })
        .catch((e) => {
          console.error("deu merda chefe: ", e);
          router.push("/");
        });
    } else {
      router.push("/");
    }
  });

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="flex flex-col bg-[#87AEA5] p-10 rounded-md bg-opacity-80">
        {!isSnitchingOnOceanLife && !isSnitchingOnPollution && (
          <h1 className="text-5xl mb-12 mx-auto">
            {!isHoveringOceanLife &&
              !isHoveringPollution &&
              "Escolha uma opção"}
            {isHoveringOceanLife && "Relatar vida marinha"}
            {isHoveringPollution && "Relatar poluição"}
          </h1>
        )}
        {isSnitchingOnOceanLife && (
          <h1 className="text-5xl mb-12 mx-auto">Relatar vida marinha</h1>
        )}
        {isSnitchingOnPollution && (
          <h1 className="text-5xl mb-12 mx-auto">Relatar poluição</h1>
        )}
        {!isSnitchingOnOceanLife && !isSnitchingOnPollution && (
          <div className="flex">
            <Image
              src={Pollution}
              alt="pollution"
              className={`w-64 cursor-pointer ${
                isHoveringOceanLife ? "opacity-50" : ""
              }`}
              onMouseEnter={() => setIsHoveringPollution(true)}
              onMouseLeave={() => setIsHoveringPollution(false)}
              onClick={() => {
                setIsSnitchingOnPollution(true);
                setIsHoveringPollution(false);
              }}
            />
            <Image
              src={OceanLife}
              alt="ocean-life"
              className={`w-64 cursor-pointer ml-4 ${
                isHoveringPollution ? "opacity-50" : ""
              }`}
              onMouseEnter={() => setIsHoveringOceanLife(true)}
              onMouseLeave={() => setIsHoveringOceanLife(false)}
              onClick={() => {
                setIsSnitchingOnOceanLife(true);
                setIsHoveringOceanLife(false);
              }}
            />
          </div>
        )}
        {(isSnitchingOnOceanLife || isSnitchingOnPollution) && (
          <div className="">
            <div className="flex flex-col">
              Endereço (aproximado):
              <input
                className="rounded-md p-2 mb-2 text-black"
                type="text"
                placeholder="Rua*:"
              />
              <div>
                <input
                  className="rounded-md p-2 mb-2 mr-2 text-black"
                  type="number"
                  placeholder="Número:"
                />
                <input
                  className="rounded-md p-2 mb-2 text-black"
                  type="text"
                  placeholder="Cidade*:"
                />
              </div>
              <div>
                <input
                  className="rounded-md p-2 mb-2 mr-2 text-black"
                  type="text"
                  placeholder="Ponto de referência:"
                />
                <input
                  className="rounded-md p-2 mb-2 text-black"
                  type="text"
                  placeholder="Estado*:"
                />
              </div>
              Data e hora (aproximado)*:
              <input
                className="rounded-md p-2 mb-2 text-black"
                type="datetime-local"
              />
              Adicionar imagem:
              <input
                className="rounded-md p-2 mb-2 bg-white text-gray-400 file:bg-[#87AEA5] file:text-black file:border-black file:border file:rounded-md file:shadow-lg file:h-12"
                type="file"
              />
            </div>
            <div className="flex mt-4 items-center">
              <button
                className="ml-36 w-28 h-12 border border-black rounded-md text-black font-bold shadow-lg bg-[#87AEA5]"
                onClick={() => {
                  if (isSnitchingOnOceanLife) {
                    setIsSnitchingOnOceanLife(false);
                  }
                  if (isSnitchingOnPollution) {
                    setIsSnitchingOnPollution(false);
                  }
                }}
              >
                Enviar
              </button>{" "}
              <p className="ml-2">*obrigatório</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
