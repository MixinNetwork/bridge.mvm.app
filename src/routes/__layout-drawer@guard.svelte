<script lang="ts">
	import Drawer from '$lib/components/drawer/drawer.svelte';
</script>

<div class="drawer drawer-mobile">
	<input id="drawer-toggle" type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<label for="drawer-toggle" class="drawer-overlay" />
		<Drawer />
	</div>
	<div class="drawer-content">
		<slot />
	</div>
</div>
