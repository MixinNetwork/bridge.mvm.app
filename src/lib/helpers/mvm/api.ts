export const getMvmTokens = async (address: string) => {
	const response = await fetch(
		`https://scan.mvm.dev/api?module=account&action=tokenlist&address=${address}`
	);
	const { result } = await response.json();
	if (!result) throw new Error('No result');
	return result as {
		balance: string;
		contractAddress: string;
		decimals: number;
		name: string;
		symbol: string;
		type: string;
	}[];
};
