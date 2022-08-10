<script lang="ts">
	import Modal from './modal/modal.svelte';
	import Spinner from './spinner.svelte';

	export let isOpen: boolean;
</script>

<Modal {isOpen} containerClass="rounded-xl p-7 bg-black opacity-70 ">
	<Spinner class="stroke-white" />
</Modal>
