<script context="module" lang="ts">
  import clsx from 'clsx';
  import { fade } from 'svelte/transition';
  import { onMount } from "svelte";
</script>

<script lang="ts">

  let clazz: string | undefined = undefined;
  let isOpen = false;

  export { isOpen, clazz as class };

  $: opacity = isOpen ? 'opacity-1' : 'opacity-0';

  onMount(() => {
    setTimeout(() => {
        isOpen = false;
    }, 3000)
  })
</script>

<div
    transition:fade
    class={clsx("flex w-44 rounded-full bg-white py-2 px-2 align-middle", opacity, clazz)}
>
    <slot />
</div>
