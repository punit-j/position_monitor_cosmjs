import "dotenv/config";
import { fetchPrice, readFile, fetchJsonFile, getTokenSymbol } from "./utils/utils";
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

    var totalCollateral: number = 0;
    let collaterals = positionDetails.collateral[user];

    if (collaterals != undefined) {
      Object.keys(collaterals).forEach(async (key) => {
        let tokenSymbol = getTokenSymbol(tokenData, key)
        let price = await fetchPrice(tokenSymbol);
        totalCollateral += collaterals[key] * price["rate"];
      });
    }

    var totalDebt: number = 0;
    let debt = positionDetails.debt[user];

    if (debt != undefined) {
      Object.keys(debt).forEach(async (key) => {
        let tokenSymbol = getTokenSymbol(tokenData, key)
        let price = await fetchPrice(tokenSymbol);
        totalDebt += collaterals[key] * price["rate"];
      });
    }

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

computeCollateralisedRatio(
  "osmo1zacxlu90sl6j2zf90uctpddhfmux84ryrw794ywnlcwx2zeh5a4q67qtc9"
);
