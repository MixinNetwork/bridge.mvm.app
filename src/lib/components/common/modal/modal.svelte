<script context="module" lang="ts">
	import type { BaseProps as OverlayBaseProps } from './overlay.svelte';
	export type BaseProps = {
		'modal-opened': boolean;
		'modal-mask-closeable'?: boolean;
		'modal-keyboard-closeable'?: boolean;
		'modal-on-close'?: () => void;
	} & Pick<OverlayBaseProps, 'overlay-class'>;
</script>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any */
	import { Portal } from '@yeungkc/svelte-portal';
	import type { SvelteComponentTyped } from 'svelte';
	import Overlay from './overlay.svelte';
	import { omit } from 'lodash-es';

	type Component = $$Generic<typeof SvelteComponentTyped<Record<string, any>>>;
	type Props = Component extends typeof SvelteComponentTyped<infer T extends Record<string, any>>
		? T
		: never;

	type $$Props = BaseProps &
		Props & {
			this: Component;
		};

	$: p = $$props as $$Props;

	$: opened = p['modal-opened'];
	$: maskCloseable = p['modal-mask-closeable'] ?? true;
	$: keyboardCloseable = p['modal-keyboard-closeable'] ?? true;
	$: onClose = p['modal-on-close'];
	$: component = p['this'];

	$: props = omit(p, [
		'modal-opened',
		'modal-mask-closeable',
		'modal-keyboard-closeable',
		'modal-on-close',
		'this'
	]);
</script>

{#if opened}
	<Portal
		this={Overlay}
		overlay-content={component}
		overlay-on-click={maskCloseable ? onClose : undefined}
		overlay-on-escape={keyboardCloseable ? onClose : undefined}
		close={onClose}
		{...props}
	/>
{/if}
