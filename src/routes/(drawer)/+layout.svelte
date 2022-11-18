<script lang="ts">
	import { page } from '$app/stores';
	import Drawer from '$lib/components/base/layout/drawer.svelte';
	import Guard from '$lib/components/base/layout/guard.svelte';
	import { assets } from '$lib/stores/model';
	import type { Asset } from '$lib/types/asset';

	let a: Asset[] | undefined = $page.data.assets;
	a?.length && !$assets.length && assets.set(a);
	$: a?.length && !$assets.length && assets.set(a);
</script>

<Drawer>
	<Guard>
		<slot />
	</Guard>
</Drawer>
