<script context="module" lang="ts">
	import '../css/app.css';
	import type { Load } from '@sveltejs/kit';
	import { browser } from '$app/env';

	export const load: Load = ({ routeId, url }) => {
		console.log('routeId', routeId, 'url', url.origin);
	};
</script>

<script lang="ts">
</script>

<slot />
