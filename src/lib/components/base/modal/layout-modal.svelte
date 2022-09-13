<script>
	import clsx from 'clsx';
	import { tailwind } from '../../../transition/tailwind';
	import ModalHeader from './modal-header.svelte';
</script>

<div
	transition:tailwind={{
		duration: 200,
		to: '!translate-x-0 !scale-100 !opacity-100'
	}}
	class={clsx(
		'z-10 flex h-screen w-screen flex-col items-stretch bg-brand-background pb-6 md:h-auto md:max-h-[85%] md:min-h-[560px] md:w-[375px] md:rounded-xl',
		'translate-x-3/4 opacity-0 md:translate-x-0 md:scale-90'
	)}
>
	<ModalHeader on:click>
		<slot name="title" />
	</ModalHeader>
	<slot />
</div>
