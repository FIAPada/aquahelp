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

  const [addressNumber, setAddressNumber] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [referencePoint, setReferencePoint] = useState("");
  const [reportedAt, setReportedAt] = useState("");
  const [streetName, setStreetName] = useState("");
  const [image, setImage] = useState<File | null>(null);

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
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
              />
              <div>
                <input
                  className="rounded-md p-2 mb-2 mr-2 text-black"
                  type="number"
                  placeholder="Número:"
                  value={addressNumber}
                  onChange={(e) => setAddressNumber(e.target.value)}
                />
                <input
                  className="rounded-md p-2 mb-2 text-black"
                  type="text"
                  placeholder="Cidade*:"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <input
                  className="rounded-md p-2 mb-2 mr-2 text-black"
                  type="text"
                  placeholder="Ponto de referência:"
                  value={referencePoint}
                  onChange={(e) => setReferencePoint(e.target.value)}
                />
                <input
                  className="rounded-md p-2 mb-2 text-black"
                  type="text"
                  placeholder="Estado*:"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                />
              </div>
              Data e hora (aproximado)*:
              <input
                className="rounded-md p-2 mb-2 text-black"
                type="datetime-local"
                value={reportedAt}
                onChange={(e) => setReportedAt(e.target.value)}
              />
              Adicionar imagem:
              <input
                className="rounded-md p-2 mb-2 bg-white text-gray-400 file:bg-[#87AEA5] file:text-black file:border-black file:border file:rounded-md file:shadow-lg file:h-12"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files !== null ? setImage(e.target.files[0]) : null
                }
              />
            </div>
            <div className="flex mt-4 items-center">
              <button
                className="ml-36 w-28 h-12 border border-black rounded-md text-black font-bold shadow-lg bg-[#87AEA5]"
                onClick={() => {
                  if (isSnitchingOnOceanLife) {
                    const formData = new FormData();
                    formData.append("address_number", addressNumber);
                    formData.append("city", city);
                    formData.append("province", province);
                    formData.append("reference_point", referencePoint);
                    formData.append("reported_at", reportedAt);
                    formData.append("street_name", streetName);
                    if (image) formData.append("image", image);

                    axios({
                      method: "post",
                      url: "http://host.docker.internal:8001/animal_report",
                      data: formData,
                    });
                  }
                  if (isSnitchingOnPollution) {
                    setIsSnitchingOnPollution(false);
                    const formData = new FormData();
                    formData.append("address_number", addressNumber);
                    formData.append("city", city);
                    formData.append("province", province);
                    formData.append("reference_point", referencePoint);
                    formData.append("reported_at", reportedAt);
                    formData.append("street_name", streetName);
                    if (image) formData.append("image", image);

                    axios({
                      method: "post",
                      url: "http://host.docker.internal:8001/pollution_report",
                      data: formData,
                    });
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
