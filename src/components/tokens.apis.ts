import axios from "axios";
import { GEN_TOKEN_API_PATH } from "../configs";

const axioInstance = axios.create({
  baseURL: GEN_TOKEN_API_PATH,
});

export const getRtmToken = async (payload: {
  uid?: number;
  channelName: string;
}) => {
  return axioInstance.post("/gen-rtm", payload);
};
