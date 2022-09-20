<script lang="ts">
	import { tailwind } from '../../transition/tailwind';

	import Spinner from './spinner.svelte';
</script>

<div
	transition:tailwind|local={{
		to: '!opacity-70'
	}}
	class="rounded-xl bg-black p-7 opacity-0"
>
	<Spinner class="stroke-white" />
</div>
