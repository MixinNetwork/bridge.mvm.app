<script lang="ts">
	import Header from '$lib/components/base/header.svelte';
	import Brand from '$lib/components/base/brand.svelte';
	import ComingSoon from '$lib/assets/coming-soon.svg?component';
	import UserInfo from '$lib/components/base/user-info.svelte';
</script>

<Header>
	<Brand class="space-x-2 md:hidden" logoClass="w-6" MVMClass="text-lg" bridgeClass="hidden" />
	<div />
	<UserInfo class="hidden md:flex" />
</Header>

<div class="flex grow flex-col items-center justify-center">
	<ComingSoon />
	<div class=" font-bold opacity-20">Coming Soon</div>
</div>
