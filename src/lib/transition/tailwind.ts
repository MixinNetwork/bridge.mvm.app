import type { TransitionConfig } from 'svelte/types/runtime/transition';
import { linear } from 'svelte/easing';

export interface ClassesParams {
	delay?: number;
	duration?: 75 | 100 | 150 | 200 | 300 | 500 | 700 | 1000;
	base?: string;
	from: string;
	to: string;
}

const convertDurationClass = (duration: ClassesParams['duration']) => {
	switch (duration) {
		case 75:
			return 'duration-75';
		case 100:
			return 'duration-100';
		case 150:
			return 'duration-150';
		case 200:
			return 'duration-200';
		case 300:
			return 'duration-300';
		case 500:
			return 'duration-500';
		case 700:
			return 'duration-700';
		case 1000:
			return 'duration-1000';
		default:
			return 'duration-150';
	}
};

const convertClasses = (clazz: string) => clazz.split(' ').filter(Boolean);

export default (
	node: Element,
	{ delay = 0, duration = 150, from, to, base }: ClassesParams
): TransitionConfig => {
	const durationClass = convertDurationClass(duration);
	const baseClass = base && convertClasses(base);

	const fromClasses = convertClasses(from);
	const toClasses = convertClasses(to);

	let lastT: number | undefined = undefined;
	let lastIsForward: boolean | undefined = undefined;
	let isForward: boolean | undefined = undefined;

	baseClass && node.classList.add(...baseClass);

	const play = (callback: () => void) => {
		if (node.classList.contains(durationClass)) {
			callback();
			return;
		}
		setTimeout(() => {
			node.classList.add(durationClass);
			setTimeout(callback, 0);
		}, 0);
	};

	return {
		delay,
		duration,
		easing: linear,
		tick: (t) => {
			if (lastT === undefined) {
				isForward = t === 0;
			} else {
				isForward = t > lastT;
			}

			if (lastIsForward != isForward) {
				if (isForward === true) {
					fromClasses.length && node.classList.add(...fromClasses);
					play(() => {
						fromClasses.length && node.classList.remove(...fromClasses);
						toClasses.length && node.classList.add(...toClasses);
					});
				} else if (isForward === false) {
					toClasses.length && node.classList.add(...toClasses);
					play(() => {
						toClasses.length && node.classList.remove(...toClasses);
						fromClasses.length && node.classList.add(...fromClasses);
					});
				}
			}

			lastT = t;
			lastIsForward = isForward;
		}
	};
};
