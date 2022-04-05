import axios, { AxiosPromise, AxiosRequestConfig, Method } from "axios";

export type Params = {
  limit?: number;
  time_range?: string;
};

export function spotifyRequestHelper(
  method: Method,
  url: string,
  accessToken: string,
  params?: Params
): AxiosPromise<any> {
  const options: AxiosRequestConfig = {
    url,
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    params,
    method,
  };
  return axios(options);
}
