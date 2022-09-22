<script lang="ts">
	import clsx from 'clsx';
	import Empty from '$lib/assets/empty.svg?component';

	let clazz: string | undefined = undefined;
	export { clazz as class };
</script>

<div class={clsx('flex flex-col items-center justify-center space-y-3 py-14', clazz)}>
	<Empty />
	<div class="font-semibold uppercase opacity-20">No Result</div>
</div>
