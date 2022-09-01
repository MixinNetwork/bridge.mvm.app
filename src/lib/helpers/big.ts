import Big, { type BigSource } from 'big.js';

export function bigAdd(...args: Array<BigSource>): string {
	return args
		.reduce((prev, cur) => {
			const _prev = isNum(prev);
			const _cur = isNum(cur);
			const bigPrev = new Big(_prev);
			const bigCur = new Big(_cur);
			const res = bigPrev.add(bigCur);
			return isNum(res).toString();
		})
		.toString();
}

export function bigSub(...args: Array<BigSource>): string {
	return args
		.reduce((prev, cur) => {
			const _prev = isNum(prev);
			const _cur = isNum(cur);
			const bigPrev = new Big(_prev);
			const bigCur = new Big(_cur);
			const res = bigPrev.sub(bigCur);
			return isNum(res).toString();
		})
		.toString();
}

export function bigMul(...args: Array<BigSource>): string {
	return args
		.reduce((prev, cur) => {
			const _prev = isNum(prev);
			const _cur = isNum(cur);
			const bigPrev = new Big(_prev);
			const bigCur = new Big(_cur);
			const res = bigPrev.mul(bigCur);
			return isNum(res).toString();
		})
		.toString();
}

export function bigDiv(...args: Array<BigSource>): string {
	return args
		.reduce((prev, cur) => {
			const _prev = isNum(prev);
			const _cur = isNum(cur);
			const bigPrev = new Big(_prev);
			const bigCur = new Big(_cur);
			const res = bigPrev.div(bigCur);
			return isNum(res).toString();
		})
		.toString();
}

export function bigAbs(num: BigSource): string {
	const bigNum = new Big(num);
	return bigNum.abs().toString();
}

export function bigGt(a: BigSource, b: BigSource): boolean {
	return new Big(a).gt(b);
}

export function bigGte(a: BigSource, b: BigSource): boolean {
	return new Big(a).gte(b);
}

export function bigLt(a: BigSource, b: BigSource): boolean {
	return new Big(a).lt(b);
}

export function bigLte(a: BigSource, b: BigSource): boolean {
	return new Big(a).lte(b);
}

export function toRounding(num: BigSource, precision: number): string {
	const _num = isNum(num);
	const bigNum = new Big(_num);
	return bigNum.toFixed(precision);
}

export function toPrecision(num: BigSource, precision: number): string {
	const _num = isNum(num);
	const bigNum = new Big(_num);
	const res = bigNum.round(precision, 0);
	return res.toFixed(precision);
}

export function toBigString(num: string): string {
	return num.replace(/(?:\.0*|(\.\d+?)0+)$/, '$1');
}

export function isNum(num: BigSource): BigSource | Big {
	if (!num || !Number(num)) return 0;
	if (Number(num) === Infinity) return 0;
	if (Number(num) === -Infinity) return 0;
	return num;
}

export function formatCurrency(num: BigSource) {
	return toRounding(num, 2);
}
