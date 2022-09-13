<script lang="ts">
	import clsx from 'clsx';
	import logo from '$lib/assets/logo/logo.svg';

	let clazz: string | undefined = undefined;
	let logoClass: string | undefined = undefined;
	let MVMClass: string | undefined = undefined;
	let bridgeClass: string | undefined = undefined;

	export { clazz as class, logoClass, MVMClass, bridgeClass };
</script>

<a class={clsx('flex items-center space-x-3 text-3xl', clazz)} href="/">
	<img src={logo} width="45" height="48" alt="logo" class={clsx(logoClass)} />
	<div class={clsx('font-extrabold', MVMClass)}>MVM</div>
	<div class={clsx('font-light', bridgeClass)}>Bridge</div>
</a>
