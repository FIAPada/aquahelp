"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [registeredSuccessfully, setRegisteredSuccessfully] = useState(false);
  const [registerFailed, setRegisterFailed] = useState(false);

  const router = useRouter();
  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  useEffect(() => {
    if (token !== null) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.get("http://localhost:8000/verify").then((res) => {
        router.push("/home");
      });
    }
  });

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-5xl mb-12">
        {isRegistering ? "Registro" : "Aqua Help"}
      </h1>
      <div className="flex flex-col bg-[#87AEA5] p-2 rounded-md bg-opacity-80">
        Email:
        <input
          type="text"
          className="rounded-md h-8 text-black"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        Senha:
        <input
          type="password"
          className="rounded-md h-8 text-black"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        {isRegistering && (
          <>
            Nome:
            <input
              type="text"
              className="rounded-md h-8 text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}
        <div className="mt-8">
          {!isRegistering && (
            <button
              className="w-28 h-12 border border-black rounded-md text-black font-bold shadow-lg bg-[#87AEA5]"
              onClick={() => {
                axios
                  .post("http://localhost:8000/login", {
                    password,
                    email,
                  })
                  .then((res) => {
                    localStorage.setItem("token", res.data.token);
                    router.push("/home");
                  })
                  .catch((e) => {
                    console.error("deu merda chefe: ", e);
                  });
              }}
            >
              Login
            </button>
          )}
          <button
            className={`${
              isRegistering ? "ml-12" : "ml-2"
            } w-28 h-12 border border-black rounded-md text-black font-bold shadow-lg bg-[#87AEA5]`}
            onClick={() => {
              isRegistering &&
                axios
                  .post("http://localhost:8000/register", {
                    name,
                    password,
                    email,
                  })
                  .then((res) => {
                    setRegisteredSuccessfully(true);
                  })
                  .catch((e) => {
                    setRegisterFailed(true);
                  });
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
