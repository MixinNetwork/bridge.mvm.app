<script>
	import Drawer from '$lib/components/base/layout/drawer.svelte';
	import Guard from '$lib/components/base/layout/guard.svelte';
</script>

<Drawer>
	<Guard>
		<slot />
	</Guard>
</Drawer>
