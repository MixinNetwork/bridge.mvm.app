<script lang="ts">
	import Header from '$lib/components/base/header.svelte';
	import Brand from '$lib/components/base/brand.svelte';
	import UserInfo from '$lib/components/base/user-info.svelte';
	import Error from '$lib/assets/error.svg?component';
	import Drawer from '$lib/components/base/layout/drawer.svelte';
	import LL from '$i18n/i18n-svelte';
</script>

<Drawer>
	<Header>
		<Brand class="space-x-2 md:hidden" logoClass="w-6" MVMClass="text-lg" bridgeClass="hidden" />
		<div />
		<UserInfo class="hidden md:flex" />
	</Header>

	<div class="flex grow flex-col items-center justify-center">
		<Error />
		<div class="font-bold opacity-20">{$LL.error.tips()}</div>
	</div>
</Drawer>
