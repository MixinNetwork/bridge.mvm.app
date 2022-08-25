<script lang="ts">
	import clsx from 'clsx';
	let clazz: string | undefined = undefined;
	export { clazz as class };
</script>

<div
	class={clsx(
		'flex h-5/6 w-full flex-col self-end rounded-t-2xl bg-white md:h-[550px] md:w-[375px] md:self-center md:rounded-xl',
		clazz
	)}
>
	<slot />
</div>
