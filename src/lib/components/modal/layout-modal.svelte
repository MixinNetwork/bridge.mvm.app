<script>
	import ModalHeader from './modal-header.svelte';
</script>

<div
	class="z-10 flex h-screen w-screen flex-col items-stretch bg-brand-background pb-6 md:h-auto md:min-h-[550px] md:w-[375px] md:rounded-xl"
>
	<ModalHeader on:click>
		<slot name="title" />
	</ModalHeader>
	<slot />
</div>
