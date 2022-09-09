<script lang="ts">
	import Header from '$lib/components/base/header.svelte';
	import Brand from '$lib/components/base/brand.svelte';
	import UserInfo from '$lib/components/base/user-info.svelte';
	import Error from '$lib/assets/error.svg?component';

	import Layout from './__layout-drawer@guard.svelte';
</script>

<Layout>
	<Header>
		<Brand class="space-x-2 md:hidden" logoClass="w-6" MVMClass="text-lg" bridgeClass="hidden" />
		<div />
		<UserInfo class="hidden md:flex" />
	</Header>

	<div class="flex grow flex-col items-center justify-center">
		<Error />
		<div class=" font-bold opacity-20">Error</div>
	</div>
</Layout>
