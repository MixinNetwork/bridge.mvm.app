import { ethers } from "ethers";
import { REGISTRY_PID, STORAGE_ADDRESS } from "../constants/common";

const getWithdrawalAction = (destination: string, tag: string, traceId: string, isAsset: boolean): string => {
  const sign = isAsset ? 'A' : 'B';
  const action = {
    destination,
    tag,
    extra: `${traceId}:${sign}`,
  };
  return JSON.stringify(action);
};

export const getWithdrawalExtra = async (destination: string, tag: string, traceId: string, isAsset: boolean) => {
  const { Buffer } = await import('buffer');
  const action = getWithdrawalAction(destination, tag, traceId, isAsset);
  const value = Buffer.from(action).toString('hex');
  const hash = ethers.utils.keccak256(`0x${value}`).slice(2);
  return `0x${REGISTRY_PID}${STORAGE_ADDRESS.toLowerCase().slice(2)}${hash}${value}`;
}
