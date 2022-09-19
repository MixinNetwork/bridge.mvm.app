<script context="module" lang="ts">
  import type { BaseProps as ToastBaseProps } from './toast-item.svelte';

  export type ToastType = 'success';
  export type BaseProps = {
    'toast-type': ToastType;
    'toast-opened': boolean;
    'toast-close': () => void;
    'toast-duration'?: number;
   } & Pick<ToastBaseProps, 'toast-class'>;
</script>

<script lang="ts">
  import { Portal } from '@yeungkc/svelte-portal';
  import {type SvelteComponentTyped, beforeUpdate, afterUpdate} from 'svelte';
  import Toast from './toast-item.svelte';
  import Success from './success.svelte';
  import { omit } from 'lodash-es';

  type Component = $$Generic<typeof SvelteComponentTyped<Record<string, any>>>;
  type Props = Component extends typeof SvelteComponentTyped<infer T extends Record<string, any>>
    ? T
    : never;

  type $$Props = BaseProps & Props;

  type ToastMap = {
    [key in ToastType]: Component;
  }
  const toastMap: ToastMap= {
    'success': Success
  };

  $: p = $$props as $$Props;

  $: opened = p['toast-opened'];
  $: component = toastMap[p['toast-type']];

  $: duration = $$props['toast-duration'] ?? 3000;
  $: close = $$props['toast-close'];

  $: props = omit(p, [
    'toast-opened',
    'toast-duration',
    'toast-type',
    'toast-close'
  ]);

  let lastState = false;
  beforeUpdate(() => {
    if (!lastState && opened) {
      setTimeout(() => {
        close();
      }, duration);
    }
  })
  afterUpdate(() => {
    lastState = opened;
  })
</script>

{#if opened}
    <Portal
        this={Toast}
        toast-content={component}
        {...props}
    />
{/if}
