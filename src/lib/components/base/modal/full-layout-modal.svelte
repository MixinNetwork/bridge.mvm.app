<script>
	import clsx from 'clsx';
	import { tailwind } from '../../../transition/tailwind';
	import FullModalHeader from './full-modal-header.svelte';
</script>

<div
	transition:tailwind|local={{
		duration: 200,
		from: 'translate-x-3/4 opacity-0 md:translate-x-0 md:scale-90',
		to: 'translate-x-0 scale-100 opacity-100'
	}}
	class={clsx(
		'z-10 flex h-full w-screen flex-col items-stretch bg-brand-background pb-6 md:h-auto md:max-h-[85%] md:min-h-[560px] md:w-[375px] md:rounded-xl'
	)}
>
	<FullModalHeader on:click>
		<slot name="title" />
	</FullModalHeader>
	<slot />
</div>
