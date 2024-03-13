import { Attribute, CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { sha256 } from "@cosmjs/crypto";
import { toHex } from "@cosmjs/encoding";
import "dotenv/config";
import { PositionDetails } from "./types";
import { readFile, updateJson } from "./utils";

const rpc: string = `${process.env.RPC}`; // Osmosis RPC
const contractAddress: string =
  "osmo1c3ljch9dfw5kf52nfwpxd2zmj2ese7agnx0p9tenkrryasrle5sqf3ftpg"; // Replace with actual contract address
const actions: string[] = [
  "borrow",
  "liquidate",
  "deposit",
  "withdraw",
  "repay",
];

let positionDetails: PositionDetails;

const start = async (): Promise<void> => {
  try {
    const client: CosmWasmClient = await CosmWasmClient.connect(rpc);

    positionDetails = readFile();

    const latestHeight: number = await client.getHeight();
    let height: number = positionDetails.lastBlock;

    for (; height < latestHeight; height++) {
      await readTxEvents(client, height);
    }

    updateJson(positionDetails);

    while (true) {
      const currentHeight = await client.getHeight();

      if (currentHeight > height) {
        height++;
        await readTxEvents(client, height);
        updateJson(positionDetails);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

function updatePosition(
  action: string,
  attributes: readonly Attribute[]
): void {
  console.log("Case matched:", action);
  const userAttribute: Attribute | undefined =
    action !== "liquidate"
      ? attributes.find((attr: Attribute) => attr.key === "sender")
      : attributes.find((attr: Attribute) => attr.key === "user");
  const amountAttribute: Attribute | undefined =
    action !== "liquidate"
      ? attributes.find((attr: Attribute) => attr.key === "amount")
      : attributes.find((attr: Attribute) => attr.key === "collateral_amount");
  const denomAttribute: Attribute | undefined =
    action !== "liquidate"
      ? attributes.find((attr: Attribute) => attr.key === "denom")
      : attributes.find((attr: Attribute) => attr.key === "collateral_denom");

  if (!userAttribute || !amountAttribute || !denomAttribute) return;

  const user: string = userAttribute.value;
  const amount: number = Number(amountAttribute.value);
  const denom: string = denomAttribute.value;

  switch (action) {
    case "deposit":
      positionDetails.collateral[user] = positionDetails.collateral[user] || {};
      positionDetails.collateral[user][denom] =
        (positionDetails.collateral[user][denom] || 0) + amount;
      break;
    case "borrow":
      positionDetails.debt[user] = positionDetails.debt[user] || {};
      positionDetails.debt[user][denom] =
        (positionDetails.debt[user][denom] || 0) + amount;
      break;
    case "withdraw":
      positionDetails.collateral[user] = positionDetails.collateral[user] || {};
      positionDetails.collateral[user][denom] =
        (positionDetails.collateral[user][denom] || 0) - amount;
      break;
    case "repay":
      positionDetails.debt[user] = positionDetails.debt[user] || {};
      positionDetails.debt[user][denom] =
        (positionDetails.debt[user][denom] || 0) - amount;
      break;
    case "liquidate":
      positionDetails.debt[user] = positionDetails.debt[user] || {};
      positionDetails.debt[user][denom] =
        (positionDetails.debt[user][denom] || 0) - amount;

      positionDetails.collateral[user] = positionDetails.collateral[user] || {};
      positionDetails.collateral[user][denom] =
        (positionDetails.collateral[user][denom] || 0) - amount;
      break;
    default:
      throw new Error("Event not defined");
  }
}

const readTxEvents = async (client: CosmWasmClient, height: number) => {
  const txs: readonly Uint8Array[] = (await client.getBlock(height)).txs;
  for (const encodedTransaction of txs) {
    const id: string = toHex(sha256(encodedTransaction));
    const tx = await client.getTx(id);
    if (!tx || !tx.events) continue;

    for (const event of tx.events) {
      if (
        event.type === "wasm" &&
        event.attributes
          .find((attr: Attribute) => attr.key === "_contract_address")
          ?.value.toLowerCase() === contractAddress
      ) {
        const actionAttribute: Attribute | undefined =
          event.attributes.find(
            (attr: Attribute) => attr.key === "action"
          );
        if (actionAttribute) {
          const action: string = actionAttribute.value;
          if (actions.includes(action)) {
            updatePosition(action, event.attributes);
            console.log(
              event.attributes.find(
                (attr: Attribute) => attr.key === "_contract_address"
              )?.value
            );
            console.log(id);
          }
        }
      }
    }
    positionDetails.lastBlock = height;
  }
  return positionDetails
}
start();
