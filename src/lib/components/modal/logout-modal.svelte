<script lang="ts">
	import Close from '$lib/assets/close.svg?component';
	import { logout } from '../../stores/user';

	export let onClose = () => {
		//
	};
</script>

<div class="min-w- flex flex-col rounded-2xl bg-white">
	<button class="mt-6 mr-6 self-end" on:click={onClose}>
		<Close />
	</button>

	<div class="space-y-10 p-10">
		<div class="text-xl font-bold">Are you sure want to logout?</div>
		<div class=" space-x-6 font-semibold child:h-12 child:w-28 child:rounded-full">
			<button class="bg-black bg-opacity-5" on:click={onClose}>Cancel</button>
			<button class="bg-brand-primary text-white" on:click={logout}>Yes</button>
		</div>
	</div>
</div>
