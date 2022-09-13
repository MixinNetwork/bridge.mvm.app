<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { browser } from '$app/environment';

	let value = '';
	let size: number | undefined = undefined;
	let clazz: string | undefined = undefined;

	export { value, clazz as class, size };

	let image = '';

	async function generateQrCode() {
		image = await QRCode.toDataURL(value, {
			margin: 0
		});
	}

	$: if (value && browser) {
		generateQrCode();
	}

	onMount(() => {
		generateQrCode();
	});
</script>

<img src={image} alt={image && value} class={clazz} height={size} width={size} />
