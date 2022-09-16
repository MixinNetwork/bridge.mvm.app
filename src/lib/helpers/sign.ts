import { ethers } from 'ethers';
import { base64RawURLEncode } from '@mixin.dev/mixin-node-sdk';
import { REGISTRY_PID, STORAGE_ADDRESS } from '../constants/common';

export const generateExtra = (action: string) => {
	const value = Buffer.from(action).toString('hex');
	const hash = ethers.utils.keccak256(`0x${value}`).slice(2);
	return `0x${REGISTRY_PID}${STORAGE_ADDRESS.toLowerCase().slice(2)}${hash}${value}`;
};

const getWithdrawalAction = (destination: string, tag: string, amount: string, units: number): string => {
	const action = {
		receivers: [import.meta.env.VITE_WITHDRAWAL_BOT_CLIENT_ID],
		threshold: 1,
		extra: base64RawURLEncode(`${destination}~~${tag}~~${Number(amount).toFixed(units)}`)
	};
	return JSON.stringify(action);
};

export const getWithdrawalExtra = async (destination: string, tag: string, amount: string, units = 8) => {
	const action = getWithdrawalAction(destination, tag, amount, units);
	return generateExtra(action);
};
