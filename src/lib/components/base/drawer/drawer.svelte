<script>
	import Brand from '../brand.svelte';
	import DrawerItem from './drawer-item.svelte';

	import Assets from '$lib/assets/drawer/assets.svg?component';
	import Transactions from '$lib/assets/drawer/transactions.svg?component';
	import Swap from '$lib/assets/drawer/swap.svg?component';
	import SwapForGas from '$lib/assets/drawer/swap-for-gas.svg?component';
	// import Support from '$lib/assets/drawer/support.svg?component';
	import UserInfo from '../user-info.svelte';
	import Exporor from '$lib/assets/drawer/explorer.svg?component';
	import Audit from '$lib/assets/drawer/audit.svg?component';
	import Docs from '$lib/assets/drawer/docs.svg?component';
	import LL from '$i18n/i18n-svelte';
	import LogoutButton from '$lib/components/base/logout-button.svelte';
	import Logout from '$lib/assets/logout.svg?component';

	import Discrod from '$lib/assets/drawer/discord.svg?component';
	import Telegram from '$lib/assets/drawer/telegram.svg?component';
	import Mixin from '$lib/assets/drawer/mixin.svg?component';
	import Twitter from '$lib/assets/drawer/twitter.svg?component';
	import { version } from '$lib/constants/common';
</script>

<div class="flex w-72 flex-col rounded-r-2xl bg-white md:w-64 md:rounded-none">
	<Brand class="hidden !space-x-2 px-5 py-4 md:mb-6 md:flex md:text-xl" logoClass="w-8" />
	<UserInfo class=" mt-20 mb-9 ml-8  md:hidden" />
	<DrawerItem logo={Assets} href="/" title={$LL.assets()} />
	<DrawerItem logo={Transactions} href="/transactions/" title={$LL.transactions()} />
	<DrawerItem logo={Swap} href="/swap/" title={$LL.swap()} />
	<DrawerItem logo={SwapForGas} href="/swap-for-gas/" title={$LL.swapForGas()} />
	<!-- <DrawerItem logo={Support} href="/support/" title="Support" /> -->
	<DrawerItem
		logo={Exporor}
		href="https://scan.mvm.dev/"
		title={$LL.explorer()}
		target="_blank"
		rel="noreferrer"
	/>
	<DrawerItem
		logo={Audit}
		href="https://github.com/MixinNetwork/audits/"
		title={$LL.audit()}
		target="_blank"
		rel="noreferrer"
	/>
	<DrawerItem
		logo={Docs}
		href="https://mvm.dev/"
		title={$LL.docs()}
		target="_blank"
		rel="noreferrer"
	/>

	<LogoutButton
		class="mt-5 flex items-center justify-start space-x-4 p-2 pl-8 font-semibold md:hidden"
	>
		<Logout />
		<div>
			{$LL.logout.title()}
		</div>
	</LogoutButton>

	<div class="mb-5 flex grow flex-col items-center justify-end">
		<div class=" flex space-x-1 child:p-2">
			<a href="https://discord.gg/JER9jmbRB6" target="_blank" rel="noreferrer">
				<Discrod />
			</a>
			<a href="https://t.me/mvmbridge " target="_blank" rel="noreferrer">
				<Telegram />
			</a>
			<a href="https://mvm-bridge.mixin.group" target="_blank" rel="noreferrer">
				<Mixin />
			</a>
			<a href="https://twitter.com/MvmBridge" target="_blank" rel="noreferrer">
				<Twitter />
			</a>
		</div>
		<div class="text-sm opacity-40">v{version}</div>
	</div>
</div>
