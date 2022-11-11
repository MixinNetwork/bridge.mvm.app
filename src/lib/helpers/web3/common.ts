import { ethers, utils, type BigNumberish } from 'ethers';
import { BRIDGE_ABI, ERC20_ABI, MVM_ERC20_ABI } from '../../constants/abis';
import {
	BRIDGE_ADDRESS,
	ETH_ASSET_ID,
	MAINNET_CHAIN_HEX_ID,
	MVM_CHAIN_HEX_ID,
	MVM_RPC_URL,
	networkParams
} from '../../constants/common';
import type { Network } from '../../types/network';
import type { RegisteredUser } from '$lib/types/user';
import type { Asset } from '$lib/types/asset';
import type { Order, SwapSource } from '$lib/types/swap';
import { getWithdrawalExtra } from '../sign';
import { fetch4SwapTxInfo } from '../4swap/api';
import { checkOrder } from '../api';
import { fetchMixPayTxInfo } from '../mixpay/api';
import { format } from '../big';

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

export const getAssetBalance = async (asset: Asset, address: string, network: Network) => {
	if (asset.asset_id === ETH_ASSET_ID) return getBalance({ account: address, network });

	const contract = network === 'mvm' ? asset?.contract : asset?.asset_key;
	if (!contract) return '0';

	const balance = await getERC20Balance({
		account: address,
		contractAddress: contract,
		network
	});

	return format({ n: balance, dp: 8, fixed: true });
};

export const switchNetwork = async (provider: ethers.providers.Web3Provider, network: Network) => {
	const request = provider.provider.request;
	if (!request) throw new Error('Web3Provider.provider.request must be defined');

	const hex = network === 'mainnet' ? MAINNET_CHAIN_HEX_ID : MVM_CHAIN_HEX_ID;

	try {
		await request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: hex }]
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (switchError: any) {
		if (
			!(
				switchError?.code === 4902 ||
				switchError?.code === -32603 ||
				switchError?.data?.orginalError?.code === 4902 ||
				switchError?.data?.orginalError?.code === -32603
			)
		)
			return;
		await request({
			method: 'wallet_addEthereumChain',
			params: [networkParams[hex]]
		});
		await switchNetwork(provider, network);
	}
};

export const deposit = async (
	provider: ethers.providers.Web3Provider,
	asset: Asset,
	destination: string,
	amount: string
) => {
	await switchNetwork(provider, 'mainnet');

	const signer = provider.getSigner();

	if (asset.asset_id === ETH_ASSET_ID) {
		const transactionParameters = {
			from: ethers.utils.getAddress(await signer.getAddress()),
			to: destination,
			value: ethers.utils.parseEther(amount).toString(),
			chainId: 0x1
		};
		return await signer.sendTransaction(transactionParameters);
	}

	if (asset.chain_id === ETH_ASSET_ID) {
		const tokenContract = new ethers.Contract(asset.asset_key, ERC20_ABI, signer);
		const tokenDecimal = await tokenContract.decimals();
		const value = ethers.utils.parseUnits(amount, tokenDecimal);
		return await tokenContract.transfer(destination, value, {
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
	source: SwapSource,
	order: Order,
	inputAsset: Asset,
	minReceived: string
) => {
	await switchNetwork(provider, 'mvm');

	let info: {
		extra: string;
		getFollowId: (t: number) => Promise<string>;
	};
	if (source === '4Swap') info = await fetch4SwapTxInfo(user, order, minReceived);
	else info = fetchMixPayTxInfo(user, order);

	const signer = provider.getSigner();

	if (inputAsset.asset_id === ETH_ASSET_ID) {
		const assetAmount = ethers.utils.parseEther(Number(order.funds).toFixed(8)).toString();
		const bridge = new ethers.Contract(BRIDGE_ADDRESS, BRIDGE_ABI, signer);

		console.log('before send tx', new Date());
		const t = Date.now();
		const r = await bridge.release(user.contract, info.extra, {
			gasPrice: 10000000,
			gasLimit: 500000,
			value: assetAmount
		});
		console.log('sended', new Date());
		await r.wait();
		console.log('get tx receipt', new Date());

		const follow_id = await info.getFollowId(t);
		return await checkOrder(source, follow_id, user);
	}

	if (inputAsset.contract) {
		const tokenAddress = inputAsset.contract;
		const tokenContract = new ethers.Contract(tokenAddress, MVM_ERC20_ABI, signer);
		const tokenDecimal = await tokenContract.decimals();
		const value = ethers.utils.parseUnits(`${order.funds}`, tokenDecimal);

		console.log('before send tx', new Date());
		const t = Date.now();
		const r = await tokenContract.transferWithExtra(user.contract, value, info.extra, {
			gasPrice: 10000000,
			gasLimit: 450000
		});
		console.log('sended', new Date());
		await r.wait();
		console.log('get tx receipt', new Date());

		const follow_id = await info.getFollowId(t);
		return await checkOrder(source, follow_id, user);
	}

	throw new Error('Invalid asset');
};
