<script lang="ts">
	import clsx from 'clsx';
	import { fetchTransactions, type Transaction } from '$lib/helpers/mvm/api';
	import { page } from '$app/stores';
	import dayjs from 'dayjs';
	import Header from '$lib/components/base/header.svelte';
	import UserInfo from '$lib/components/base/user-info.svelte';
	import { bigAdd, format } from '$lib/helpers/big';
	import Spinner from '$lib/components/common/spinner.svelte';
	import { user } from '$lib/stores/user';
	import { assets } from '$lib/stores/model';
	import { ETH_ASSET_ID } from '$lib/constants/common';
	import { onMount, onDestroy } from 'svelte';
	import LL from '$i18n/i18n-svelte';
	import Apps from '$lib/components/base/apps.svelte';
	import DepositPending from '$lib/components/base/deposit-pending.svelte';
	import Empty from '$lib/components/base/empty.svelte';
	import { createVirtualizer } from '$lib/helpers/svelte-virtual';
	import { slide } from 'svelte/transition';
	import { browser } from '$app/environment';

	const DEFAULT_ICON =
		'https://images.mixin.one/yH_I5b0GiV2zDmvrXRyr3bK5xusjfy5q7FX3lw3mM2Ryx4Dfuj6Xcw8SHNRnDKm7ZVE3_LvpKlLdcLrlFQUBhds=s128';

	let transactions: Transaction[] = $page.data.transactions;

	$: transactions = $page.data.transactions;
	$: transactions = transactions.map((tx) => {
		const asset = $assets.find(({ asset_id, contract }) => {
			if (tx.contract) return contract?.toLowerCase() === tx.contract?.toLowerCase();
			return asset_id === ETH_ASSET_ID;
		});
		return { ...tx, icon: asset?.icon_url };
	});
	let hasMore = transactions.length >= 30;

	$: txs = transactions.map((tx) => {
		const total = bigAdd(tx.value, tx.fee);
		return {
			...tx,
			total: tx.isSend ? -total : +total,
			date: dayjs.unix(tx.timeStamp).subtract(12, 'hour').format('HH:mm:ss MM-DD-YYYY')
		};
	});

	$: tsxCount = txs.length;

	let parent: HTMLElement | undefined;
	let virtualizer: ReturnType<typeof createVirtualizer<Element, Element>> | undefined;

	$: scrollable = (browser && document.querySelector('div.drawer-content')) || null;

	$: virtualizerOptions = {
		getScrollElement: () => scrollable,
		initialRect: { height: 72 * tsxCount, width: 0 },
		count: tsxCount,
		estimateSize: () => 72,
		scrollMargin: parent?.offsetTop ?? 0,
		overscan: 6
	};

	$: $virtualizer?.setOptions(virtualizerOptions);
	$: !virtualizer && (virtualizer = createVirtualizer(virtualizerOptions));

	$: totalSize = $virtualizer?.getTotalSize() ?? 0;
	$: virtualItems = $virtualizer?.getVirtualItems() ?? [];
	$: lastIndex = [...virtualItems].slice(-1)?.[0]?.index;

	let loading = false;

	const loadMore = async (lastIndex: number) => {
		if (!$user) return;
		if (lastIndex < txs.length - 1) return;

		loading = true;
		try {
			const lastTransaction = transactions[transactions.length - 1];

			const result = await fetchTransactions({
				address: $user.address,
				endblock: lastTransaction?.blockNumber,
				lastHash: lastTransaction?.hash
			});
			hasMore = result.length >= 30;
			transactions = [...transactions, ...result];
		} finally {
			loading = false;
		}
	};

	$: parent && !loading && hasMore && $user && loadMore(lastIndex);

	const updateTtransactions = async () => {
		if (!transactions.length) return;
		if (!$user) return;

		const startblock = transactions[0].blockNumber;
		const firstHash = transactions[0].hash;

		const txs = await fetchTransactions({
			address: $user.address,
			startblock,
			firstHash
		});

		transactions = [...txs, ...transactions];
	};

	let timer: ReturnType<typeof setInterval> | undefined;
	onMount(async () => (timer = setInterval(updateTtransactions, 1000 * 10)));
	onDestroy(() => timer && clearInterval(timer));
</script>

<Header>
	<div class="md:hidden">{$LL.allTransactions()}</div>
	<UserInfo class="hidden md:flex" />
	<Apps />
	<DepositPending />
</Header>

<div class="flex grow flex-col bg-white md:my-8 md:mx-5 md:rounded-2xl xl:mx-16">
	<div class="hidden px-5 py-4 text-lg font-semibold md:block">{$LL.allTransactions()}</div>
	<div bind:this={parent}>
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
	</div>
	{#if !txs.length}
		<Empty />
	{/if}
	{#if hasMore}
		<div transition:slide|local class="flex h-20 items-center justify-center">
			<Spinner class="stroke-slate-500" />
		</div>
	{/if}
</div>
