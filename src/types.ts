export interface PositionDetails {
  lastBlock: number;
  collateral: { [user: string]: { [denom: string]: number } };
  debt: { [user: string]: { [denom: string]: number } };
}
