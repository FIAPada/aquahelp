"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-5xl mb-12">
        {isRegistering ? "Registro" : "Aqua Help"}
      </h1>
      <div className="flex flex-col bg-[#87AEA5] p-2 rounded-md bg-opacity-80">
        Email:
        <input type="text" className="rounded-md h-8" />
        Senha:
        <input type="text" className="rounded-md h-8" />
        {isRegistering && (
          <>
            Nome:
            <input type="text" className="rounded-md h-8" />
          </>
        )}
        <div className="mt-8">
          {!isRegistering && (
            <button className="w-28 h-12 border border-black rounded-md text-black font-bold shadow-lg bg-[#87AEA5]">
              Login
            </button>
          )}
          <button
            className={`${
              isRegistering ? "ml-12" : "ml-2"
            } w-28 h-12 border border-black rounded-md text-black font-bold shadow-lg bg-[#87AEA5]`}
            onClick={(e) => {
              setIsRegistering(!isRegistering);
            }}
          >
            Registrar
          </button>
        </div>
      </div>
    </main>
  );
}
