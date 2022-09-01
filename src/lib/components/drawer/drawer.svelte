<script>
	import Brand from '../brand.svelte';
	import DrawerItem from './drawer-item.svelte';

	import Assets from '$lib/assets/drawer/assets.svg?component';
	import Transactions from '$lib/assets/drawer/transactions.svg?component';
	import Swap from '$lib/assets/drawer/swap.svg?component';
	// import GasToken from '$lib/assets/drawer/gas-token.svg?component';
	// import Support from '$lib/assets/drawer/support.svg?component';
	import UserInfo from '../user-info.svelte';
	import Exporor from '$lib/assets/drawer/explorer.svg?component';
</script>

<div class="w-72 rounded-r-2xl bg-white md:w-64 md:rounded-none">
	<Brand class="hidden !space-x-2 px-5 py-4 md:mb-6 md:flex md:text-xl" logoClass="w-8" />
	<UserInfo class=" mt-20 mb-9 ml-8  md:hidden" />
	<DrawerItem logo={Assets} href="/" title="Assets" />
	<DrawerItem logo={Transactions} href="/transactions/" title="Transactions" />
	<DrawerItem logo={Swap} href="/swap/" title="Swap" />
	<!-- <DrawerItem logo={GasToken} href="/gas-token/" title="Gas Token" /> -->
	<!-- <DrawerItem logo={Support} href="/support/" title="Support" /> -->
	<DrawerItem logo={Exporor} href="https://scan.mvm.dev/" title="Explorer" target="_blank" />
</div>
