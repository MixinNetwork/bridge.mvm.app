<script lang="ts">
	import Close from '$lib/assets/close.svg?component';
	import { logout } from '../../../stores/user';
	import { tailwind } from '../../../transition/tailwind';

	export let close = () => {
		//
	};
</script>

<div
	transition:tailwind={{
		to: '!scale-100 !opacity-100'
	}}
	class="min-w flex flex-col rounded-2xl bg-white opacity-0 md:scale-90"
>
	<button class="mt-6 mr-6 self-end" on:click={close}>
		<Close />
	</button>

	<div class="space-y-10 p-10">
		<div class="text-xl font-bold">Are you sure want to logout?</div>
		<div class=" space-x-6 font-semibold child:h-12 child:w-28 child:rounded-full">
			<button class="bg-black bg-opacity-5" on:click={close}>Cancel</button>
			<button class="bg-brand-primary text-white" on:click={logout}>Yes</button>
		</div>
	</div>
</div>
