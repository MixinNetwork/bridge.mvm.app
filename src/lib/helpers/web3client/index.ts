import { providerKey, setProviderKey, setProviderLogo } from '../../stores/provider';
import { get } from '@square/svelte-store';
import Onboard, { type WalletState } from '@web3-onboard/core';
import { MVM_CHAIN_HEX_ID, MVM_RPC_URL, MVM_SCAN_URL, RPC_URL } from '../../constants/common';
import { i18nObject } from '$i18n/i18n-util';
import Logo from '$lib/assets/logo/logo.svg';
import { loadLocale } from '$i18n/i18n-util.sync';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import type { i18n } from '@web3-onboard/core/dist/types';

const injected = injectedModule();
const walletConnect = walletConnectModule();

loadLocale('en');

const en = i18nObject('en');

const onboard = Onboard({
	wallets: [injected, walletConnect],
	chains: [
		{
			id: '0x1',
			token: 'ETH',
			label: 'Ethereum Mainnet',
			rpcUrl: RPC_URL,
			blockExplorerUrl: 'https://etherscan.io/'
		},
		{
			id: MVM_CHAIN_HEX_ID,
			namespace: 'evm',
			token: 'ETH',
			label: 'Mixin Virtual Machine',
			rpcUrl: MVM_RPC_URL,
			blockExplorerUrl: MVM_SCAN_URL
		}
	],
	appMetadata: {
		name: en.meta.title(),
		description: en.meta.description(),
		icon: Logo,
		logo: Logo
	},
	accountCenter: {
		desktop: {
			enabled: false
		},
		mobile: {
			enabled: false
		}
	},
	i18n: {
		zh: {
			connect: {
				selectingWallet: {
					header: '可用钱包',
					sidebar: {
						heading: '开始',
						subheading: '连接你的钱包',
						paragraph: '连接你的钱包就像“登录”到 Web3。从选项中选择您的钱包以开始使用。'
					},
					installWallet: '您没有安装 {app} 支持的任何钱包，请使用支持的钱包',
					recommendedWalletsPart1: '{app} 只支持',
					recommendedWalletsPart2: '在这个平台上。请使用或安装其中一种受支持的钱包以继续',
					agreement: {
						agree: '我同意',
						terms: '条款',
						and: '和',
						privacy: '隐私政策'
					}
				},
				connectingWallet: {
					sidebar: {
						subheading: '授权连接',
						paragraph: '请允许您钱包中的连接并授权访问以继续。'
					},
					mainText: '正在连接...',
					paragraph: '确保选择您要授予访问权限的所有帐户。',
					rejectedText: '连接被拒绝！',
					rejectedCTA: '点击此处重试',
					primaryButton: '返回钱包列表',
					previousConnection:
						'{wallet} 已经有待处理的连接请求，请打开 {wallet} 应用程序登录并连接。'
				},
				connectedWallet: {
					header: '连接成功',
					sidebar: {
						subheading: '连接成功！',
						paragraph: '您的钱包现已连接到 {app}'
					},
					mainText: '已连接'
				}
			},
			modals: {
				actionRequired: {
					heading: '操作需要在 {wallet} 中完成',
					paragraph: '请切换您钱包中的活跃账户。',
					linkText: '了解更多。',
					buttonText: 'Okay'
				},
				switchChain: {
					heading: '切换网络',
					paragraph1: '{app} 需要您将钱包切换到 {nextNetworkName} 网络以继续。',
					paragraph2:
						'* 部分钱包可能不支持更改网络。如果您无法更改钱包中的网络，您可以考虑切换到不同的钱包。'
				},
				confirmDisconnectAll: {
					heading: '断开所有钱包',
					description: '您确定要断开所有钱包吗？',
					confirm: '确认',
					cancel: '取消'
				}
			}
		} as i18n
	}
});

export const connectWallet = async (cache = false) => {
	const $providerKey = get(providerKey);

	let wallets: WalletState[];

	if (cache && $providerKey) {
		let label = $providerKey;
		if (label === 'injected') label = 'MetaMask';
		if (label === 'walletconnect') label = 'WalletConnect';
		wallets = await onboard.connectWallet({
			autoSelect: {
				label: $providerKey,
				disableModals: true
			}
		});
	} else {
		wallets = await onboard.connectWallet();
	}

	if (!wallets.length) throw new Error('No Web3 Provider found');
	const { label, provider, icon } = wallets[0];

	setProviderLogo(icon);
	setProviderKey(label);

	return provider;
};

export const cacheConnectWallet = () => connectWallet(true);

export const disconnectWallet = (label: string) => onboard.disconnectWallet({ label });
