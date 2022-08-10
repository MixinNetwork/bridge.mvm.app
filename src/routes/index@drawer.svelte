<script>
	import Brand from '$lib/components/brand.svelte';
	import Header from '$lib/components/header.svelte';

	import Helper from '$lib/assets/helper.svg?component';
	import UserInfo from '../lib/components/user-info.svelte';
</script>

<Header>
	<Brand class="space-x-2 md:hidden" logoClass="w-6" MVMClass="text-lg" bridgeClass="hidden" />
	<a href="/" class="md:hidden">
		<svelte:component this={Helper} />
	</a>
	<UserInfo class="sm:hidden md:flex" />
</Header>
