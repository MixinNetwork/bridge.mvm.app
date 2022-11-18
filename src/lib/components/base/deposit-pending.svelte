<script lang="ts" context="module">
	import { mapTemplate } from '../../helpers/store/map-template';
	import type { User } from '../../types/user';
	import {
		AssetClient,
		ExternalClient,
		type ExternalTransactionResponse
	} from '@mixin.dev/mixin-node-sdk';
	import { deepReadable } from '../../helpers/store/deep';
	import { user } from '../../stores/user';
	import type { Asset } from '../../types/asset';
	import Pending from '$lib/assets/pending.svg?component';
	import { fade } from 'svelte/transition';
	import DepositPendingModal from './deposit-pending-modal.svelte';
	import Modal from '../common/modal/modal.svelte';
	import LL from '$i18n/i18n-svelte';
	import { flatMap } from 'lodash-es';

	export type ExternalTransactionResponseWithAsset = ExternalTransactionResponse & {
		asset: Asset;
	};

	const DepositPendingStore = mapTemplate((user: User | undefined) => {
		if (!user) return deepReadable<ExternalTransactionResponseWithAsset[]>([]);
		const assetClient = AssetClient({
			keystore: { ...user, ...user.key }
		});
		const externalClient = ExternalClient({
			keystore: { ...user, ...user.key }
		});

		return deepReadable<ExternalTransactionResponseWithAsset[]>([], (set) => {
			const update = async () => {
				const assets = await assetClient.fetchList();
				if (!assets.length) return;

				const chains = assets.filter((asset) => asset.chain_id === asset.asset_id);

				const result = await Promise.all(
					chains.map((chain) =>
						externalClient.deposits({ limit: 500, destination: chain.destination, tag: chain.tag })
					)
				);

				const deposits = flatMap(result);

				const d = deposits
					.map((d) => {
						const existed = assets.find((asset) => asset.asset_id === d.asset_id);
						const chainExisted = chains.find((asset) => asset.asset_id === d.chain_id);
						if (!existed || !chainExisted) return;

						const asset: Asset = Object.assign(existed, {
							chain_icon_url: chainExisted.icon_url,
							chain_name: chainExisted.name,
							chain_symbol: chainExisted.symbol
						});

						return Object.assign(d, { asset });
					})
					.filter((d) => !!d && +d.confirmations < d.asset.confirmations);

				set(d as ExternalTransactionResponseWithAsset[]);
			};

			update();

			const timer = setInterval(async () => {
				update();
			}, 1000 * 5);

			return () => {
				clearInterval(timer);
			};
		});
	});
</script>

<script lang="ts">
	const depositPendingStore = DepositPendingStore($user);

	let opened = false;
	$: $depositPendingStore;
</script>

{#if $depositPendingStore.length}
	<button
		transition:fade|local
		class="relative md:rounded-full md:bg-brand-primary md:py-2 md:px-4"
		on:click={() => (opened = true)}
	>
		<Pending class="md:hidden" />
		<div
			class="absolute -top-1 -right-1 flex h-4 items-center justify-center rounded-full bg-red-500 p-1 text-[8px] text-white md:hidden"
		>
			{$depositPendingStore.length}
		</div>
		<div class="hidden h-6 items-center text-sm font-semibold text-white md:flex">
			{$LL.pending($depositPendingStore.length)}
		</div>
	</button>
{/if}

<Modal
	this={DepositPendingModal}
	data={$depositPendingStore}
	modal-opened={opened}
	modal-on-close={() => (opened = false)}
/>
