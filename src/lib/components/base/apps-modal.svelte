<script lang="ts">
	import LayoutBottomSheet from './modal/layout-bottom-sheet.svelte';
	import ModalHeader from './modal/modal-header.svelte';

	export let close = () => {
		//
	};
	export let data: {
		name: string;
		description: string;
		icon: string;
		href: string;
	}[];
</script>

<LayoutBottomSheet class="!h-auto p-5">
	<ModalHeader {close}>APPS</ModalHeader>
	{#each data as { name, description, icon, href } (name)}
		<a class="flex flex-row space-x-3 py-4" {href} target="_blank" rel="noreferrer">
			<img loading="lazy" src={icon} width="40" height="40" alt={name} class=" shrink-0" />
			<div class="flex flex-col items-start">
				<div class=" font-bold text-black text-opacity-80">{name}</div>
				<div class=" text-sm font-semibold text-black text-opacity-20">{description}</div>
			</div>
		</a>
	{/each}
</LayoutBottomSheet>
