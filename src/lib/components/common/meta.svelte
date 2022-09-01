<script lang="ts">
	export let title: string;
	export let description: string;
	export let keywords: string[];
	export let twitter: string | undefined = undefined;

	$: keywordsString = keywords.join(', ');
</script>

<svelte:head>
	<meta charset="utf-8" />
	<title>{title}</title>
	<meta name="keywords" content={keywordsString} />
	<meta name="description" content={description} />
	<meta name="og:title" content={title} />
	<meta name="og:description" content={description} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:card" content="summary" />
	{#if !!twitter}
		<meta name="twitter:site" content={`@${twitter}`} />
		<meta name="twitter:creator" content={`@${twitter}`} />
	{/if}
	<meta name="og:keywords" content={keywordsString} />
</svelte:head>
