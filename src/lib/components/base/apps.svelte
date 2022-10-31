<script lang="ts">
	import clsx from 'clsx';
	import Apps from '$lib/assets/apps.svg?component';
	import Quill from '$lib/assets/apps/quill.svg';
	import PandoLeaf from '$lib/assets/apps/pando-leaf.svg';
	import PandoRings from '$lib/assets/apps/pando-rings.svg';
	import FourSwap from '$lib/assets/apps/4swap.svg';
	import Modal from '../common/modal/modal.svelte';
	import AppsModal from './apps-modal.svelte';
	import LL from '$i18n/i18n-svelte';

	$: data = [
		{
			name: 'Quill',
			description: $LL.apps.quill.description(),
			icon: Quill,
			href: 'https://quill.im/'
		},
		{
			name: 'Pando Leaf',
			description: $LL.apps.leaf.description(),
			icon: PandoLeaf,
			href: 'https://leaf.pando.im/'
		},
		{
			name: 'Pando Rings',
			description: $LL.apps.rings.description(),
			icon: PandoRings,
			href: 'https://rings.pando.im/'
		},
		{
			name: '4swap',
			description: $LL.apps.fourSwap.description(),
			icon: FourSwap,
			href: 'https://app.4swap.org/'
		},
		{
			name: 'Trident',
			description: $LL.apps.trident.description(),

			icon: 'https://mixin-images.zeromesh.net/UrECmX-_zO9twWDh8429lOUU9h7XgRapTM_McbovByNGWK9v-uPVKQw8ZbUvjRLJhEMKGGYs21VtKPNWXfujfVM_T49P4zY3XQgH=s256',
			href: 'https://thetrident.one/'
		},
		{
			name: 'OptionDance',
			description: $LL.apps.optionDance.description(),
			icon: 'https://mixin-images.zeromesh.net/3H9XZLLfHeIW4ARQXN99nIgIQQuhEzqsv0iG7_gec3T82UylqQPyOoJEFIVvYHWSo8Z4AN7RSF03qMOZqbOwCJy7srXwhpvPMnU=s256',
			href: 'https://option.dance/'
		}
	];

	let opened = false;

	let clazz: string | undefined = undefined;
	export { clazz as class };
</script>

<button
	class={clsx(
		'group relative flex items-center md:cursor-default select-none opacity-100 z-50 justify-center md:bg-white w-fit md:rounded-full space-x-3 md:py-2 md:px-4 transition mr-3',
		clazz
	)}
	on:click={() => {
		if (window.innerWidth > 720) return;
		opened = true;
	}}
>
	<Apps />
	<div class=" hidden text-sm font-semibold text-black text-opacity-80 md:block">Apps</div>

	<div
		class="invisible absolute top-10 -right-48 z-50 mt-3 hidden h-[480px] w-96 flex-col overflow-y-auto rounded-2xl bg-white py-5 opacity-0 shadow transition-all delay-100 group-hover:visible group-hover:opacity-100 md:flex lg:right-0"
	>
		{#each data as { name, description, icon, href } (name)}
			<a
				class=" default flex flex-row space-x-3 bg-brand-primary bg-opacity-0 py-4 px-5 hover:bg-opacity-5"
				{href}
				target="_blank"
				rel="noreferrer"
			>
				<img
					loading="lazy"
					src={icon}
					width="40"
					height="40"
					alt={name}
					class="h-10 w-10 shrink-0"
				/>
				<div class="flex flex-col items-start text-start">
					<div class=" font-bold text-black text-opacity-80">{name}</div>
					<div class=" text-sm font-semibold text-black text-opacity-20">{description}</div>
				</div>
			</a>
		{/each}
	</div>
</button>

<Modal this={AppsModal} {data} modal-opened={opened} modal-on-close={() => (opened = false)} />
