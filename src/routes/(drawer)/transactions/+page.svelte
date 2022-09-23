<script lang="ts">
	import clsx from 'clsx';
	import { fetchTransactions, type Transaction } from '$lib/helpers/mvm/api';
	import { page } from '$app/stores';
	import dayjs from 'dayjs';
	import Helper from '$lib/assets/helper.svg?component';
	import Header from '$lib/components/base/header.svelte';
	import UserInfo from '$lib/components/base/user-info.svelte';
	import { bigAdd, format } from '$lib/helpers/big';
	import Spinner from '$lib/components/common/spinner.svelte';
	import { scrollableParent } from '$lib/helpers/action';
	import { user } from '$lib/stores/user';
	import type { Asset } from '$lib/types/asset';
	import { assets } from '$lib/stores/model';
	import { ETH_ASSET_ID } from '$lib/constants/common';
	import { onMount, onDestroy } from 'svelte';

	const DEFAULT_ICON =
		'https://images.mixin.one/yH_I5b0GiV2zDmvrXRyr3bK5xusjfy5q7FX3lw3mM2Ryx4Dfuj6Xcw8SHNRnDKm7ZVE3_LvpKlLdcLrlFQUBhds=s128';

	let a: Asset[] | undefined = $page.data.assets;
	$: a && !$assets.length && assets.set(a);
	let transactions: Transaction[] = $page.data.transactions;
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

	let loading = false;

	const onScroll = async (event: CustomEvent<Element>) => {
		if (!hasMore) return;
		if (loading) return;
		if (event.detail.scrollTop + event.detail.clientHeight < event.detail.scrollHeight - 200) {
			return;
		}

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

	const updateTtransactions = async () => {
		if (!transactions.length) return;

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
	onMount(async () => (timer = setInterval(updateTtransactions, 1000 * 5)));
	onDestroy(() => timer && clearInterval(timer));
</script>

<Header>
	<div class="md:hidden">All Transactions</div>
	<a href="/" class="md:hidden">
		<Helper />
	</a>
	<UserInfo class="hidden md:flex" />
</Header>

<div
	class="bg-white md:my-8 md:mx-5 md:rounded-2xl xl:mx-16"
	use:scrollableParent
	on:parentScroll={onScroll}
>
	<div class="hidden px-5 py-4 text-lg font-semibold md:block">All Transactions</div>
	{#each txs as tx (tx.hash + tx.symbol)}
		<a
			class="flex h-[72px] items-center justify-between space-x-3 p-5 font-semibold"
			href={`https://scan.mvm.dev/tx/${tx.hash}`}
			target="_blank"
		>
			<div class="flex flex-1 items-center justify-between">
				<div class="flex flex-1 items-center space-x-3">
					<img src={tx.icon || DEFAULT_ICON} width="24" height="24" alt={tx.name} />
					<div class="grow">
						{tx.total < 0 ? (tx.value !== 0 ? 'Withdrawal' : 'Fee') : 'Deposit'}
					</div>
				</div>
				<div class="flex flex-1 justify-end space-x-2 text-sm md:grow">
					<div
						class={clsx({
							'text-red-500': tx.total < 0,
							'text-green-500': tx.total > 0
						})}
					>
						{format({ n: tx.total })}
					</div>
					<div>
						{tx.symbol}
					</div>
				</div>
			</div>

			<div class="hidden flex-1 justify-end text-sm font-medium text-black text-opacity-20 lg:flex">
				{tx.date}
			</div>
		</a>
	{/each}
	{#if hasMore}
		<div class="flex h-20 items-center justify-center">
			<Spinner class="stroke-slate-500" />
		</div>
	{/if}
</div>
