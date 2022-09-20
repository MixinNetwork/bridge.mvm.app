import { ethers, utils, type BigNumberish } from 'ethers';
import { v4 } from 'uuid';
import { BRIDGE_ABI, ERC20_ABI, MVM_ERC20_ABI } from '../../constants/abis';
import {
	BRIDGE_ADDRESS,
	ETH_ASSET_ID,
	MAINNET_CHAIN_ID,
	MVM_CHAIN_ID,
	MVM_RPC_URL,
	networkParams, WHITELIST_ASSET_4SWAP
} from '../../constants/common';
import type { Network } from '../../types/network';
import type { RegisteredUser } from '$lib/types/user';
import type { Asset } from '$lib/types/asset';
import { toHex } from '../utils';
import { generateExtra, getWithdrawalExtra } from '../sign';
import { checkOrder, createAction } from '../4swap/api';
import { fetchCode } from '../api';
import type { Order } from '../4swap/route';

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
	network
}: {
	account: string;
	contractAddress: string;
	network: Network;
}) => {
	const provider = network === 'mainnet' ? mainnetProvider : mvmProvider;
	const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
	const decimals = await contract.decimals();
	const balance = await contract.balanceOf(account);
	return utils.formatUnits(balance, decimals);
};

export const switchNetwork = async (provider: ethers.providers.Web3Provider, network: Network) => {
	const request = provider.provider.request;
	if (!request) throw new Error('Web3Provider.provider.request must be defined');

	const number = network === 'mainnet' ? MAINNET_CHAIN_ID : MVM_CHAIN_ID;

	try {
		await request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: toHex(number) }]
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (switchError: any) {
		if (switchError?.code !== 4902) return;
		await request({
			method: 'wallet_addEthereumChain',
			params: [networkParams[toHex(number)]]
		});
	}
};

export const deposit = async (
	provider: ethers.providers.Web3Provider,
	asset: Asset,
	amount: string
) => {
	await switchNetwork(provider, 'mainnet');

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
	destination: string,
	tag = '',
	fee: string
) => {
	await switchNetwork(provider, 'mvm');

	const signer = provider.getSigner();

	if (asset.asset_id === ETH_ASSET_ID) {
		const extra = await getWithdrawalExtra(destination, tag, amount);
		const totalAmount = ethers.utils.parseEther((Number(amount) + Number(fee)).toFixed(8));

		const bridge = new ethers.Contract(BRIDGE_ADDRESS, BRIDGE_ABI, signer);
		await bridge.release(userContract, extra, {
			gasPrice: 10000000,
			gasLimit: 350000,
			value: totalAmount
		});
		return;
	}

	if (asset.contract) {
		const tokenContract = new ethers.Contract(asset.contract, MVM_ERC20_ABI, signer);
		const tokenDecimal = await tokenContract.decimals();

		const extra = await getWithdrawalExtra(destination, tag, amount, tokenDecimal);
		const value = ethers.utils.parseUnits(
			(Number(amount) + Number(fee)).toFixed(tokenDecimal).toString(),
			tokenDecimal
		);

		await tokenContract.transferWithExtra(userContract, value, extra, {
			gasPrice: 10000000,
			gasLimit: 350000
		});
		return;
	}

	throw new Error('Invalid asset');
};

export const swapAsset = async (
	provider: ethers.providers.Web3Provider,
	user: RegisteredUser,
	order: Order,
	inputAsset: Asset,
	minReceived: string
) => {
	await switchNetwork(provider, 'mvm');


	const trace_id = v4();
	const swapAction = `3,${user.user_id},${trace_id},${order.fill_asset_id},${order.routes},${minReceived}`;
	const actionResp = await createAction({
		action: swapAction,
		amount: order.funds,
		asset_id: order.pay_asset_id,
		broker_id: ''
	});

	const codeResp = await fetchCode(actionResp.code);
	const extra = generateExtra(
		JSON.stringify({
			receivers: codeResp.receivers,
			threshold: codeResp.threshold,
			extra: codeResp.memo
		})
	);

	const signer = provider.getSigner();

	if (inputAsset.asset_id === ETH_ASSET_ID) {
		const bridge = new ethers.Contract(BRIDGE_ADDRESS, BRIDGE_ABI, signer);
		const assetAmount = ethers.utils.parseEther(Number(order.funds).toFixed(8)).toString();

		await bridge.release(user.contract, extra, {
			gasPrice: 10000000,
			gasLimit: 500000,
			value: assetAmount
		});
		return await checkOrder(actionResp.follow_id, user);
	}

	if (inputAsset.contract) {
		const tokenAddress = inputAsset.contract;
		const tokenContract = new ethers.Contract(tokenAddress, MVM_ERC20_ABI, signer);
		const tokenDecimal = await tokenContract.decimals();
		const value = ethers.utils.parseUnits(`${order.funds}`, tokenDecimal);

		await tokenContract.transferWithExtra(user.contract, value, extra, {
			gasPrice: 10000000,
			gasLimit: 450000
		});
		return await checkOrder(actionResp.follow_id, user);
	}

	throw new Error('Invalid asset');
};
