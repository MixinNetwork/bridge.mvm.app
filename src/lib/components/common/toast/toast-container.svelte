<script lang="ts">
  import toastState from './toast-state';
  import ToastItem from './toast-item.svelte';
</script>

<div
    class="fixed top-2 left-1/2 -translate-x-1/2"
>
    {#each $toastState as { node, isOpen, contentProps } (node)}
        <ToastItem isOpen={isOpen}>
            <svelte:component this={node} {...contentProps || {}} />
        </ToastItem>
    {/each}
</div>
