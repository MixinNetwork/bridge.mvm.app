<script lang="ts">
	import SuccessIcon from '$lib/assets/success.svg';

	export let message: string;
</script>

<div class="inline-block">
	<img loading="lazy" src={SuccessIcon} alt="success-icon" />
</div>

<div class="inline-block font-semibold leading-10">{message}</div>
