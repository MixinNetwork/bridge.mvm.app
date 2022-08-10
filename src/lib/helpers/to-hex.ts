export const toHex = (num: string | number) => {
	const val = Number(num);
	return '0x' + val.toString(16);
};

export default toHex;
