import { utils } from 'ethers';
import { sortBy } from 'lodash-es';
import { bigMul } from '../big';

export const fetchMvmTokens = async (address: string) => {
	const response = await fetch(
		`https://scan.mvm.dev/api?module=account&action=tokenlist&address=${address}`
	);
	const { result, status } = await response.json();
	if (!status) throw new Error('No result');
	return result as {
		balance: string;
		contractAddress: string;
		decimals: string;
		name: string;
		symbol: string;
		type: string;
	}[];
};

interface MvmTransaction {
	blockHash: string;
	blockNumber: number;
	confirmations: number;
	contractAddress: string | undefined;
	cumulativeGasUsed: number;
	from: string;
	gas: number;
	gasPrice: number;
	gasUsed: number;
	hash: string;
	input: string;
	isError: number;
	nonce: number;
	timeStamp: number;
	to: string;
	transactionIndex: number;
	txreceipt_status: number;
	value: number;
}

interface MvmTokenTransfer extends MvmTransaction {
	contractAddress: string;
	tokenDecimal: number;
	tokenName: string;
	tokenSymbol: string;
}

const fetchMvmTransactions = async ({
	address,
	startblock,
	endblock
}: {
	address: string;
	startblock?: number;
	endblock?: number;
}) => {
	const url = new URL('https://scan.mvm.dev/api?module=account&action=txlist');
	url.searchParams.set('address', address);
	startblock && url.searchParams.set('startblock', `${startblock}`);
	endblock && url.searchParams.set('endblock', `${endblock}`);

	const response = await fetch(url.href);
	const { result, status } = await response.json();
	if (!status) throw new Error('No result');
	return result as MvmTransaction[];
};

const fetchMvmTokenTransactions = async ({
	address,
	startblock,
	endblock
}: {
	address: string;
	startblock?: number;
	endblock?: number;
}) => {
	const url = new URL('https://scan.mvm.dev/api?module=account&action=tokentx');
	url.searchParams.set('address', address);
	startblock && url.searchParams.set('startblock', `${startblock}`);
	endblock && url.searchParams.set('endblock', `${endblock}`);

	const response = await fetch(url.href);
	const { result, status } = await response.json();
	if (!status) throw new Error('No result');
	return result as MvmTokenTransfer[];
};

export interface Transaction {
	contract?: string;
	hash: string;
	blockNumber: number;
	timeStamp: number;
	name: string;
	fee: number;
	value: number;
	symbol: string;
	isSend: boolean;
	icon?: string;
}

interface TransactionParams {
	address: string;
}

interface TransactionParamsWithEndblock extends TransactionParams {
	lastHash: string;
	endblock: number;
}

interface TransactionParamsWithStartblock extends TransactionParams {
	firstHash: string;
	startblock: number;
}

export const fetchTransactions = async ({
	...params
}: TransactionParams | TransactionParamsWithEndblock | TransactionParamsWithStartblock) => {
	const [tx, tokenTx] = await Promise.all([
		fetchMvmTransactions(params),
		fetchMvmTokenTransactions(params)
	]);

	const mvmTransactions: (Partial<MvmTokenTransfer> & MvmTransaction)[] = sortBy(
		[...tx, ...tokenTx],
		(tx) => -tx.timeStamp
	);

	let transactions = mvmTransactions.map(
		({
			blockNumber,
			hash,
			timeStamp,
			from,
			value,
			gasPrice,
			gasUsed,
			tokenDecimal,
			tokenName,
			tokenSymbol,
			contractAddress
		}) => {
			const isSend = from.toLowerCase() === params.address.toLowerCase();
			const formattedValue = utils.formatUnits(value || 0, tokenDecimal || 18);
			return {
				hash,
				blockNumber,
				timeStamp,
				name: tokenName || 'Etheruem',
				fee: tokenSymbol || !isSend ? 0 : +utils.formatUnits(bigMul(gasUsed, gasPrice), 18),
				value: +formattedValue,
				isSend,
				symbol: tokenSymbol || 'ETH',
				contract: tokenSymbol ? contractAddress : undefined
			};
		}
	);

	if ('lastHash' in params) {
		const lastHash = params.lastHash;
		const lastIndex = lastHash ? mvmTransactions.findIndex((tx) => tx.hash === lastHash) : 0;

		transactions = transactions
			.slice(lastIndex)
			.filter((tx) => tx.hash !== lastHash)
			.slice(0, 30);
	}

	if ('firstHash' in params) {
		const firstHash = params.firstHash;
		const firstIndex = firstHash ? mvmTransactions.findIndex((tx) => tx.hash === firstHash) : 0;

		transactions = transactions.slice(0, firstIndex).slice(-30);
	}

	return transactions;
};
