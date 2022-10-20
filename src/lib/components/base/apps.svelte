<script lang="ts">
	import clsx from 'clsx';
	import Apps from '$lib/assets/apps.svg?component';
	import Quill from '$lib/assets/apps/quill.svg';
	import PandoLeaf from '$lib/assets/apps/pando-leaf.svg';
	import PandoRings from '$lib/assets/apps/pando-rings.svg';
	import FourSwap from '$lib/assets/apps/4swap.svg';

	const data = [
		{
			name: 'Quill',
			description: 'Write to Earn',
			icon: Quill,
			href: 'https://quill.im/'
		},
		{
			name: 'Pando Leaf',
			description: 'A decentralized financial network, implement a derivatives liquidity protocol.',
			icon: PandoLeaf,
			href: 'https://leaf.pando.im/'
		},
		{
			name: 'Pando Rings',
			description: 'An algorithmic, autonomous interest rate protocol.',
			icon: PandoRings,
			href: 'https://rings.pando.im/'
		},
		{
			name: '4Swap',
			description:
				'4swap is the automated market-making trading platform of Fox, similar to Uniswap.',
			icon: FourSwap,
			href: 'https://app.4swap.org/'
		}
	];

	let clazz: string | undefined = undefined;
	export { clazz as class };
</script>

<div
	class={clsx(
		'group relative md:flex hidden items-center select-none z-50 justify-center md:bg-white w-fit md:rounded-full space-x-3 md:py-2 md:px-4 transition mr-3',
		clazz
	)}
>
	<Apps />
	<div class=" text-sm font-semibold text-black text-opacity-80">APPS</div>

	<div
		class="invisible absolute top-10 right-0 z-50 mt-3 hidden w-96 flex-col rounded-2xl bg-white px-5 py-5 opacity-0 shadow transition-all delay-100 group-hover:visible group-hover:opacity-100 md:flex"
	>
		{#each data as { name, description, icon, href } (name)}
			<a class=" flex flex-row space-x-3 py-4" {href} target="_blank" rel="noreferrer">
				<img src={icon} width="40" height="40" alt={name} class=" shrink-0" />
				<div class="flex flex-col">
					<div class=" font-bold text-black text-opacity-80">{name}</div>
					<div class=" text-sm font-semibold text-black text-opacity-20">{description}</div>
				</div>
			</a>
		{/each}
	</div>
</div>
