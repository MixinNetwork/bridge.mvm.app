import type { TransitionConfig } from 'svelte/types/runtime/transition';
import { linear } from 'svelte/easing';

export interface ClassesParams {
	delay?: number;
	duration?: 75 | 100 | 150 | 200 | 300 | 500 | 700 | 1000;
	from?: string;
	to?: string;
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

export function tailwind(
	node: Element,
	{ delay = 0, duration = 150, from = '', to = '' }: ClassesParams = {}
): TransitionConfig {
	const durationClass = convertDurationClass(duration);

	const fromClasses = convertClasses(from);
	const toClasses = convertClasses(to);

	fromClasses.length && node.classList.add(...fromClasses);
	node.classList.add(durationClass);

	let lastT = 0;
	let isForward = true;

	return {
		delay,
		duration,
		easing: linear,
		tick: (t) => {
			if (t > lastT && !isForward) {
				fromClasses.length && node.classList.remove(...fromClasses);
				toClasses.length && node.classList.add(...toClasses);
			} else if (t < lastT && isForward) {
				toClasses.length && node.classList.remove(...toClasses);
				fromClasses.length && node.classList.add(...fromClasses);
			}

			isForward = t > lastT;
			lastT = t;
		}
	};
}
