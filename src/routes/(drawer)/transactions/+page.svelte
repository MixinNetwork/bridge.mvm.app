<script lang="ts">
	import clsx from 'clsx';
	import { deepWritable } from '$lib/helpers/store/deep';
	import { fetchTransactions, type Transaction } from '$lib/helpers/mvm/api';
	import { page } from '$app/stores';
	import * as dayjs from 'dayjs';
	import Helper from '$lib/assets/helper.svg?component';
	import Header from '$lib/components/base/header.svelte';
	import UserInfo from '$lib/components/base/user-info.svelte';
	import { bigAdd } from '$lib/helpers/big';
	import Spinner from '$lib/components/common/spinner.svelte';
	import { scrollableParent } from '$lib/helpers/action';
	import { user } from '$lib/stores/user';

	const DEFAULT_ICON =
		'https://images.mixin.one/yH_I5b0GiV2zDmvrXRyr3bK5xusjfy5q7FX3lw3mM2Ryx4Dfuj6Xcw8SHNRnDKm7ZVE3_LvpKlLdcLrlFQUBhds=s128';

	const transactions = deepWritable<Transaction[]>([]);

	const t: Transaction[] = $page.data.transactions;
	let hasMore = t.length >= 30;
	$: t.length && !$transactions.length && transactions.set(t);

	$: txs = $transactions.map((tx) => ({
		...tx,
		total: +bigAdd(tx.value, tx.fee),
		date: dayjs.unix(tx.timeStamp).subtract(12, 'hour').format('HH:mm:ss MM-DD-YYYY')
	}));

	let loading = false;

	const onScroll = async (event: CustomEvent<Element>) => {
		if (!hasMore) return;
		if (loading) return;
		if (event.detail.scrollTop + event.detail.clientHeight < event.detail.scrollHeight - 200) {
			return;
		}

		loading = true;

		try {
			const lastTransaction = $transactions[$transactions.length - 1];

			const result = await fetchTransactions(
				$user,
				lastTransaction?.blockNumber,
				lastTransaction?.hash
			);

			hasMore = result.length >= 30;

			transactions.set([...$transactions, ...result]);
		} finally {
			loading = false;
		}
	};
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
					<div class="grow">{tx.total < 0 ? 'Withdrawal' : 'Deposit'}</div>
				</div>
				<div class="flex flex-1 justify-end space-x-2 text-sm md:grow">
					<div
						class={clsx({
							'text-red-500': tx.total < 0,
							'text-green-500': tx.total > 0
						})}
					>
						{tx.total}
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
