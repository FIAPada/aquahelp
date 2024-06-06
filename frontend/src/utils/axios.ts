import axios from "axios";

export const getAxiosLoginInstance = (token: string | null) => {
  if (token)
    return axios.create({
      baseURL: "http://localhost:8000",
      headers: {
        Authorization: `${token}`,
      },
    });
  else
    return axios.create({
      baseURL: "http://localhost:8000",
    });
};
