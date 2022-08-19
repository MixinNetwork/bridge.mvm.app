import { ethers, utils, type BigNumberish } from 'ethers';
import { BRIDGE_ABI, ERC20_ABI, MVM_ERC20_ABI } from '../../constants/abis';
import {
	BRIDGE_ADDRESS,
	ETH_ASSET_ID,
	MAINNET_CHAIN_ID,
	MVM_CHAIN_ID,
	MVM_RPC_URL,
	networkParams
} from '../../constants/common';
import type { Network } from '../../types/network';
import type { Asset } from '$lib/types/asset';
import toHex from '../utils';
import { getWithdrawalExtra } from "../sign";
import { fetchWithdrawalFee } from "../api";

export const mainnetProvider = ethers.getDefaultProvider(1);
export const mvmProvider = ethers.getDefaultProvider(MVM_RPC_URL);

export const getBalance = async ({
	account,
	network,
	unitName = 18
}: {
	account: string;
	network: Network;
	unitName?: BigNumberish;
}) => {
	const provider = network === 'mainnet' ? mainnetProvider : mvmProvider;
	const balance = await provider.getBalance(account);
	return utils.formatUnits(balance, unitName);
};

export const getERC20Balance = async ({
	account,
	contractAddress,
	network,
}: {
	account: string;
	contractAddress: string;
	network: Network;
	unitName?: BigNumberish;
}) => {
	const provider = network === 'mainnet' ? mainnetProvider : mvmProvider;
	const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
	const decimals = await contract.decimals()
	const balance = await contract.balanceOf(account);
	return utils.formatUnits(balance, decimals);
};

export const switchNetwork = async (provider: ethers.providers.Web3Provider, network: Network) => {
	const number = network === 'mainnet' ? MAINNET_CHAIN_ID : MVM_CHAIN_ID;

	try {
		await provider.send('wallet_switchEthereumChain', [{ chainId: toHex(number) }]);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (switchError: any) {
		if (switchError.code === 4902) {
			await provider.send('wallet_addEthereumChain', [networkParams[toHex(number)]]);
		}
	}
};

export const deposit = async (
	provider: ethers.providers.Web3Provider,
	asset: Asset,
	amount: string
) => {
	const signer = provider.getSigner();

	if (asset.asset_id === ETH_ASSET_ID) {
		const transactionParameters = {
			from: ethers.utils.getAddress(await signer.getAddress()),
			to: asset.destination,
			value: ethers.utils.parseEther(amount).toString(),
			chainId: 0x1
		};
		return await signer.sendTransaction(transactionParameters);
	}

	if (asset.chain_id === ETH_ASSET_ID) {
		const tokenContract = new ethers.Contract(asset.asset_key, ERC20_ABI, signer);
		const tokenDecimal = await tokenContract.decimals();
		const value = ethers.utils.parseUnits(amount, tokenDecimal);
		return await tokenContract.transfer(asset.destination, value, {
			gasLimit: 300000
		});
	}
};

export const withdraw = async (
	provider: ethers.providers.Web3Provider,
	asset: Asset,
	userContract: string,
	amount: string,
	tag = ''
) => {
	const uuid = (await import('uuid'));
	const traceId = uuid.v4();

	const signer = provider.getSigner();
	const destination = await signer.getAddress();
	const assetExtra = await getWithdrawalExtra(destination, tag, traceId, true);
	const feeExtra = await getWithdrawalExtra(destination, tag, traceId, false);

	const bridge = new ethers.Contract(BRIDGE_ADDRESS, BRIDGE_ABI, signer);
	const fee = await fetchWithdrawalFee(asset.asset_id);
	const feeAmount = ethers.utils.parseEther(Number(fee).toFixed(8));

	if (asset.asset_id === ETH_ASSET_ID) {
		const assetAmount = ethers.utils.parseEther(Number(amount).toFixed(8));

		await bridge.release(userContract, assetExtra, {
			gasPrice: 10000000,
			gasLimit: 350000,
			value: assetAmount,
		});

		await bridge.release(userContract, feeExtra, {
			gasPrice: 10000000,
			gasLimit: 350000,
			value: feeAmount
		});
	}

	if (asset.chain_id === ETH_ASSET_ID) {
		const tokenAddress = asset.contract;
		const tokenContract = new ethers.Contract(tokenAddress!, MVM_ERC20_ABI, signer);
		const tokenDecimal = await tokenContract.decimals();
		const value = ethers.utils.parseUnits(amount, tokenDecimal);

		await tokenContract.transferWithExtra(userContract, value, assetExtra, {
			gasPrice: 10000000,
			gasLimit: 350000,
		});

		await bridge.release(userContract, feeExtra, {
			gasPrice: 10000000,
			gasLimit: 350000,
			value: feeAmount
		});
	}
}
