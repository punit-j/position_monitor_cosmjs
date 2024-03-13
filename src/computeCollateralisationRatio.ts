import "dotenv/config";
import {
  fetchPrice,
  readFile,
  fetchJsonFile,
  getTokenSymbol,
} from "./utils";
import { PositionDetails } from "./types";

const computeCollateralisedRatio = async (user: string) => {
  try {
    const positionDetails: PositionDetails = readFile();
    if (
      positionDetails.collateral[user] == undefined &&
      positionDetails.debt[user] == undefined
    ) {
      console.log("ACCOUNT DATA NOT FOUND");
      return;
    }

    let tokenData = await fetchJsonFile();

    let totalCollateral: number = 0;
    let collaterals = positionDetails.collateral[user];
    let totalDebt: number = 0;
    let debt = positionDetails.debt[user];

    Object.keys(collaterals).forEach(async (key) => {
      let tokenSymbol = getTokenSymbol(tokenData, key);
      let price = await fetchPrice(tokenSymbol);
      totalCollateral += collaterals[key] * price["rate"];
    });

    Object.keys(debt).forEach(async (key) => {
      let tokenSymbol = getTokenSymbol(tokenData, key);
      let price = await fetchPrice(tokenSymbol);
      totalDebt += collaterals[key] * price["rate"];
    });

    console.log(
      "Collateralisation ratio for user " +
        user +
        " is " +
        totalDebt / totalCollateral
    );
  } catch (error) {
    console.error("Error:", error);
  }
};

// This is only for a single address, we can iterate over addresses for it to check for all addresses
computeCollateralisedRatio(
  "osmo1zacxlu90sl6j2zf90uctpddhfmux84ryrw794ywnlcwx2zeh5a4q67qtc9"
);
