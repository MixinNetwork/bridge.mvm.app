<script lang="ts">
	import { page } from '$app/stores';
	import Drawer from '$lib/components/base/drawer/drawer.svelte';
</script>

<div class="drawer-mobile drawer">
	{#key $page.url.pathname}
		<input id="drawer-toggle" type="checkbox" class="drawer-toggle" checked={false} />
	{/key}
	<div class="drawer-side">
		<label for="drawer-toggle" class="drawer-overlay" />
		<Drawer />
	</div>

	<div class="drawer-content flex flex-col">
		{#key $page.url.pathname}
			<slot />
		{/key}
	</div>
</div>
