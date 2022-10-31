import type { Translation } from '../i18n-types';

const zh: Translation = {
	meta: {
		title: 'MVM Bridge',
		description: '最好的跨链桥。',
		keywords: {
			crossChainBridge: '跨链桥',
			bitcoin: '比特币',
			bridge: '区块链桥',
			ethereumBridge: '以太坊桥',
			mobileCoinMetaMask: 'MobileCoin MetaMask'
		}
	},
	error: {
		tips: '发生错误'
	},
	assets: '资产',
	transactions: '交易',
	swap: '兑换',
	swapForGas: '兑换手续费',
	explorer: '浏览器',
	audit: '审计',
	docs: '文档',
	logout: {
		title: '登出',
		description: '您确定要登出吗？'
	},
	yes: '确认',
	cancel: '取消',
	deposit: '存入',
	withdraw: '提出',
	searchBar: {
		title: '搜索',
		placeholder: '名称、代号或地址'
	},
	depositModal: {
		title: '存入到 MVM',
		qrCode: '二维码',
		tips1: '存款到账需要 {0} 个区块确认。',
		tips2: '最少存入 0.00000001 {0}。'
	},
	withdrawModal: {
		l1Gas: 'L1 Gas: ',
		l2Gas: 'L2 Gas: ',
		l1GasTip: 'L1 Gas 费支付给以太坊矿工',
		l2GasTip: 'L2 Gas 费支付 MVM 节点 '
	},
	from: '来自',
	to: '到',
	address: '地址',
	memo: 'Memo（备注）',
	allTransactions: '全部交易',
	fee: '手续费',
	balanceOf: '余额：{0} {1}',
	copied: '已复制',
	swapPage: {
		tips: {
			price: '价格：',
			minReceived: '至少获得：',
			fee: '手续费：',
			priceImpact: '价格影响：',
			warning: '流动性不足，请减少兑换金额'
		},
		faq: {
			description1: '它是如何工作的？',
			description2:
				'MVM Bridge 使用 4swap 和 MixPay 的跨链闪兑服务，更低的费用、更快的交易速度和更好的深度。',
			description3: '4swap',
			description4:
				'一个自动化做市商的去中心化交易所，提供超过 140 个交易对， TVL 超过 1 亿美金，访问 ',
			description5: ' 了解更多。',
			description6: 'MixPay',
			description7:
				'去中心化 Web3 支付协议，支持几乎任意币种兑换，对接币安、 火币、Gate 等流动性最好的交易所，访问 ',
			description8: ' 了解更多。'
		}
	},
	login: {
		title: '登录',
		connectBrowserWalletDescription: '使用浏览器钱包连接',
		connectWalletConnectDescription: '使用 WalletConnect 连接',
		pleaseInstallMetaMaskFirst: '请先安装 MetaMask'
	},
	max: '最大',
	apps: {
		quill: {
			description: 'Quill 正在 Web3 上为作者和读者建立一个创作应用。'
		},
		leaf: {
			description: '一个去中心化的金融网络，实施一个衍生品流动性协议。'
		},
		rings: {
			description: '一个算法的、自主的利率协议。'
		},
		fourSwap: {
			description: '一项完全分散的自动流动性供应协议。'
		},
		trident: {
			description: '世界上最简单易用的 NFT 市场。'
		},
		optionDance: {
			description: '我们为投资者重新发明了期权交易，每个人都可以像大师一样交易期权。'
		}
	},
	tokenNA: '暂无价格',
	tokenName: '代币名称',
	tokenSymbol: '代币符号',
	depositConfirmations: '存入确认区块',
	addToMetaMask: '添加到 MetaMask',
	swapForGasPage: {
		tip: 'ETH 用于支付交易手续费',
		providedTip: '本服务由 Crypto Gas Station 提供',
		itemTip: '可用 {0} 次交易',
		customAmount: '自定义数量'
	},
	amount: '数量'
};

export default zh;
