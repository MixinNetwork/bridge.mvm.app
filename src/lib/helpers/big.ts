import BigNumber from 'bignumber.js';

export function bigAdd(...args: Array<BigNumber.Value>): string {
	return args
		.reduce((prev, cur) => {
			const _prev = isNum(prev);
			const _cur = isNum(cur);
			const bigPrev = new BigNumber(_prev);
			const bigCur = new BigNumber(_cur);
			const res = bigPrev.plus(bigCur);
			return isNum(res).toString();
		})
		.toString();
}

export function bigSub(...args: Array<BigNumber.Value>): string {
	return args
		.reduce((prev, cur) => {
			const _prev = isNum(prev);
			const _cur = isNum(cur);
			const bigPrev = new BigNumber(_prev);
			const bigCur = new BigNumber(_cur);
			const res = bigPrev.minus(bigCur);
			return isNum(res).toString();
		})
		.toString();
}

export function bigMul(...args: Array<BigNumber.Value>): string {
	return args
		.reduce((prev, cur) => {
			const _prev = isNum(prev);
			const _cur = isNum(cur);
			const bigPrev = new BigNumber(_prev);
			const bigCur = new BigNumber(_cur);
			const res = bigPrev.times(bigCur);
			return isNum(res).toString();
		})
		.toString();
}

export function bigDiv(...args: Array<BigNumber.Value>): string {
	return args
		.reduce((prev, cur) => {
			const _prev = isNum(prev);
			const _cur = isNum(cur);
			const bigPrev = new BigNumber(_prev);
			const bigCur = new BigNumber(_cur);
			const res = bigPrev.div(bigCur);
			return isNum(res).toString();
		})
		.toString();
}

export function bigAbs(num: BigNumber.Value): string {
	const bigNum = new BigNumber(num);
	return bigNum.abs().toString();
}

export function bigGt(a: BigNumber.Value, b: BigNumber.Value): boolean {
	return new BigNumber(a).gt(b);
}

export function bigGte(a: BigNumber.Value, b: BigNumber.Value): boolean {
	return new BigNumber(a).gte(b);
}

export function bigLt(a: BigNumber.Value, b: BigNumber.Value): boolean {
	return new BigNumber(a).lt(b);
}

export function bigLte(a: BigNumber.Value, b: BigNumber.Value): boolean {
	return new BigNumber(a).lte(b);
}

export function isNum(num: BigNumber.Value): BigNumber.Value | BigNumber {
	if (!num || !Number(num)) return 0;
	if (Number(num) === Infinity) return 0;
	if (Number(num) === -Infinity) return 0;
	return num;
}

/**
 * get default decimal place depend on number value
 *
 * @export
 * @param {BigNumber.Value} n
 * @return {*}
 */
export function getDefaultDecimalPlace(n: BigNumber.Value): number {
	const num = new BigNumber(n);

	return num.gt(1e4) ? 2 : num.gt(1) ? 4 : 8;
}

export function format(opts: {
	n: BigNumber.Value;
	dp?: number;
	max_dp?: number;
	fixed?: boolean;
	mode?: BigNumber.RoundingMode;
}): string {
	const num = new BigNumber(opts.n);
	const mode = opts.mode ?? BigNumber.ROUND_DOWN;
	let dp = opts.dp || getDefaultDecimalPlace(num);

	if (opts.max_dp) {
		dp = Math.min(dp, opts.max_dp);
	}

	return opts.fixed ? num.toFormat(dp, mode) : num.decimalPlaces(dp, mode).toFormat();
}

/**
 * change number to equal percent format
 *
 * @export
 * @param {{
 *   n: BigNumber.Value;
 *   symbol?: boolean;
 *   dp?: number;
 * }} opts
 * @return {*}
 */
export function toPercent(opts: { n: BigNumber.Value; symbol?: boolean; dp?: number }) {
	const { dp = 2, n, symbol = false } = opts;
	const bn = new BigNumber(n);
	const s = symbol ? (bn.gte(0) ? '+' : '') : '';

	return `${s}${bn.multipliedBy(100).toFixed(dp)}%`;
}
