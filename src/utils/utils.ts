import * as fs from "fs";
import "dotenv/config";
import axios from "axios";
import { PositionDetails } from "../types";

const dataPath = "./data.json";

export const fetchPrice = async (token: string) => {
  const apiUrl: string = "https://rest.coinapi.io/v1/exchangerate/";
  const apiKey: string = `${process.env.COINAPI_KEY}`; // should be stored in env
  const underlyingAsset: string = "USDT";
  const queryParams: string = `${token + `/` + underlyingAsset}`;
  try {
    const response = await axios.get(apiUrl + queryParams, {
      headers: {
        "X-Coinapi-Key": apiKey,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const readFile = (): PositionDetails => {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
};

export const updateJson = (positionDetails: PositionDetails): void => {
  fs.writeFileSync(dataPath, JSON.stringify(positionDetails, null, 2));
};

export const fetchJsonFile = async () => {
  const jsonFileUrl =
    "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/osmosis-1/osmosis-1.assetlist.json"
  try {
    const response = await axios.get(jsonFileUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTokenSymbol = (jsonData: any, base: string) => {
  const assets = jsonData?.assets;
  for (const asset of assets) {
    if (asset?.base === base) {
      return asset?.symbol;
    }
  }
  return null;
};
