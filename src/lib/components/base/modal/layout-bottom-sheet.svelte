<script lang="ts">
	import clsx from 'clsx';
	import tailwind from '../../../transition/tailwind';
	let clazz: string | undefined = undefined;
	export { clazz as class };
</script>

<div
	transition:tailwind|local={{
		duration: 200,
		from: 'translate-y-3/4 opacity-0 md:translate-y-0 md:scale-95 ease-in-out',
		to: 'translate-y-0 scale-100 opacity-100 ease-in-out'
	}}
	class={clsx(
		'flex max-h-[80%] w-full flex-col self-end rounded-t-2xl bg-white md:h-[560px] md:w-[375px] md:self-center md:rounded-xl overflow-y-auto',
		clazz
	)}
>
	<slot />
</div>
