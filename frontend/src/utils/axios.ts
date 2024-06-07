import axios from "axios";

export const getAxiosLoginInstance = (token: string | null) => {
  if (token)
    return axios.create({
      baseURL: "http://host.docker.internal:8000",
      headers: {
        Authorization: `${token}`,
      },
    });
  else
    return axios.create({
      baseURL: "http://host.docker.internal:8000",
    });
};
