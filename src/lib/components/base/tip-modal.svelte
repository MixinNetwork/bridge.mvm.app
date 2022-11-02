<script lang="ts">
	import LayoutBottomSheet from './modal/layout-bottom-sheet.svelte';
	import ModalHeader from './modal/modal-header.svelte';

	export let close = () => {
		//
	};
	export let title: string;
	export let description: string;
</script>

<LayoutBottomSheet class="!h-auto p-5">
	<ModalHeader {close}>{title}</ModalHeader>

	<div class="mb-12 font-semibold">
		{description}
	</div>
</LayoutBottomSheet>
