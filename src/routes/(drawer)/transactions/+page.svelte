<script lang="ts">
	import clsx from 'clsx';
	import { fetchTransactions, type Transaction } from '$lib/helpers/mvm/api';
	import dayjs from 'dayjs';
	import Header from '$lib/components/base/header.svelte';
	import UserInfo from '$lib/components/base/user-info.svelte';
	import { bigAdd, format } from '$lib/helpers/big';
	import Spinner from '$lib/components/common/spinner.svelte';
	import { user } from '$lib/stores/user';
	import { assets, transactions as transactionStore } from '$lib/stores/model';
	import { ETH_ASSET_ID } from '$lib/constants/common';
	import { onMount } from 'svelte';
	import LL from '$i18n/i18n-svelte';
	import Apps from '$lib/components/base/apps.svelte';
	import DepositPending from '$lib/components/base/deposit-pending.svelte';
	import Empty from '$lib/components/base/empty.svelte';
	import { createVirtualizer } from '$lib/helpers/svelte-virtual';
	import { slide } from 'svelte/transition';
	import { browser } from '$app/environment';
	import type { VirtualItem } from '@tanstack/virtual-core';
	import { showToast } from '../../../lib/components/common/toast/toast-container.svelte';
	import { isEqual, unionBy } from 'lodash-es';

	const DEFAULT_ICON =
		'https://images.mixin.one/yH_I5b0GiV2zDmvrXRyr3bK5xusjfy5q7FX3lw3mM2Ryx4Dfuj6Xcw8SHNRnDKm7ZVE3_LvpKlLdcLrlFQUBhds=s128';

	let transactions: Transaction[];

	$: transactions = $transactionStore || [];
	$: initialized = !!$transactionStore;

	$: transactions = transactions.map((tx) => {
		const asset = $assets.find(({ asset_id, contract }) => {
			if (tx.contract) return contract?.toLowerCase() === tx.contract?.toLowerCase();
			return asset_id === ETH_ASSET_ID;
		});
		return { ...tx, icon: asset?.icon_url };
	});
	$: hasMore = transactions.length >= 30;

	$: txs = transactions.map((tx) => {
		const total = bigAdd(tx.value, tx.fee);
		return {
			...tx,
			total: tx.isSend ? -total : +total,
			date: dayjs.unix(tx.timeStamp).subtract(12, 'hour').format('HH:mm:ss MM-DD-YYYY')
		};
	});

	$: tsxCount = txs.length;

	let virtualizer: ReturnType<typeof createVirtualizer<Element, Element>> | undefined;
	$: scrollable = browser ? document.querySelector('.drawer-content') : null;

	let virtualItems: VirtualItem[];
	let totalSize: number;
	let lastIndex: number;

	$: {
		const options = {
			getScrollElement: () => scrollable,
			count: tsxCount,
			estimateSize: () => 72,
			overscan: 24
		};

		if (virtualizer && $virtualizer) {
			$virtualizer.setOptions(options);
		} else {
			virtualizer = createVirtualizer(options);
		}

		virtualItems = $virtualizer?.getVirtualItems() ?? [];
		totalSize = $virtualizer?.getTotalSize() ?? 0;
		lastIndex = [...virtualItems].slice(-1)?.[0]?.index;
	}

	let loading = false;

	const loadMore = async (lastIndex: number) => {
		if (!$user) return;
		if (lastIndex < txs.length - 1) return;

		loading = true;
		try {
			const lastTransaction = $transactionStore?.[$transactionStore?.length - 1];

			const result = await fetchTransactions({
				address: $user.address,
				endblock: lastTransaction?.blockNumber,
				lastHash: lastTransaction?.hash
			});
			hasMore = result.length >= 30;
			$transactionStore = [...($transactionStore || []), ...result];
		} catch (e) {
			showToast('common', $LL.error.tips());
		} finally {
			loading = false;
		}
	};

	$: !loading && (hasMore || !initialized) && $user && loadMore(lastIndex);

	onMount(async () => {
		const timer = setInterval(async () => {
			if (!$transactionStore?.length) return;
			if (!$user) return;

			const startblock = $transactionStore[0].blockNumber;
			const firstHash = $transactionStore[0].hash;

			const txs = await fetchTransactions({
				address: $user.address,
				startblock,
				firstHash
			});

			const newTxs = unionBy([...txs, ...($transactionStore || [])], (tx) => [
				tx.hash,
				tx.contract
			]);

			if (isEqual(newTxs, $transactionStore)) return;

			$transactionStore = newTxs;
		}, 1000 * 10);
		return () => clearInterval(timer);
	});
</script>

<Header>
	<div class="md:hidden">{$LL.allTransactions()}</div>
	<UserInfo class="hidden md:flex" />
	<Apps />
	<DepositPending />
</Header>

<div class="flex grow flex-col bg-white md:my-8 md:mx-5 md:rounded-2xl xl:mx-16">
	<div class="hidden px-5 py-4 text-lg font-semibold md:block">{$LL.allTransactions()}</div>
	<div class="relative w-full" style:height={`${totalSize}px`}>
		{#each virtualItems as virtualRow (virtualRow.key)}
			<a
				class="absolute top-0 left-0 flex h-[72px] w-full items-center justify-between space-x-3 p-5 font-semibold"
				href={`https://scan.mvm.dev/tx/${txs[virtualRow.index].hash}`}
				target="_blank"
				rel="noreferrer"
				style:transform={`translateY(${virtualRow.start}px)`}
			>
				<div class="flex flex-1 items-center justify-between">
					<div class="flex flex-1 items-center space-x-3">
						<img
							loading="lazy"
							src={txs[virtualRow.index].icon || DEFAULT_ICON}
							width="24"
							height="24"
							alt={txs[virtualRow.index].name}
						/>
						<div class="grow">
							{txs[virtualRow.index].total < 0
								? txs[virtualRow.index].value !== 0
									? $LL.withdraw()
									: $LL.fee()
								: $LL.deposit()}
						</div>
					</div>
					<div class="flex flex-1 justify-end space-x-2 text-sm md:grow">
						<div
							class={clsx({
								'text-red-500': txs[virtualRow.index].total < 0,
								'text-green-500': txs[virtualRow.index].total > 0
							})}
						>
							{format({ n: txs[virtualRow.index].total })}
						</div>
						<div>
							{txs[virtualRow.index].symbol}
						</div>
					</div>
				</div>

				<div
					class="hidden flex-1 justify-end text-sm font-medium text-black text-opacity-20 lg:flex"
				>
					{txs[virtualRow.index].date}
				</div>
			</a>
		{/each}
	</div>
	{#if !txs.length && !loading}
		<Empty />
	{/if}
	{#if hasMore || loading}
		<div transition:slide|local class="flex h-20 items-center justify-center">
			<Spinner class="stroke-slate-500" />
		</div>
	{/if}
</div>
