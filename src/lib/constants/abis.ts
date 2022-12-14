export const ERC20_ABI = [
	{
		type: 'constructor',
		stateMutability: 'nonpayable',
		inputs: [
			{ type: 'uint128', name: '_id', internalType: 'uint128' },
			{ type: 'string', name: '_name', internalType: 'string' },
			{ type: 'string', name: '_symbol', internalType: 'string' }
		]
	},
	{
		type: 'event',
		name: 'Approval',
		inputs: [
			{
				type: 'address',
				name: 'owner',
				internalType: 'address',
				indexed: true
			},
			{
				type: 'address',
				name: 'spender',
				internalType: 'address',
				indexed: true
			},
			{
				type: 'uint256',
				name: 'value',
				internalType: 'uint256',
				indexed: false
			}
		],
		anonymous: false
	},
	{
		type: 'event',
		name: 'Transfer',
		inputs: [
			{
				type: 'address',
				name: 'from',
				internalType: 'address',
				indexed: true
			},
			{
				type: 'address',
				name: 'to',
				internalType: 'address',
				indexed: true
			},
			{
				type: 'uint256',
				name: 'value',
				internalType: 'uint256',
				indexed: false
			}
		],
		anonymous: false
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint256', name: 'remaining', internalType: 'uint256' }],
		name: 'allowance',
		inputs: [
			{ type: 'address', name: '_owner', internalType: 'address' },
			{ type: 'address', name: '_spender', internalType: 'address' }
		]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
		name: 'approve',
		inputs: [
			{ type: 'address', name: '_spender', internalType: 'address' },
			{ type: 'uint256', name: '_value', internalType: 'uint256' }
		]
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint256', name: 'balance', internalType: 'uint256' }],
		name: 'balanceOf',
		inputs: [{ type: 'address', name: '_owner', internalType: 'address' }]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [],
		name: 'burn',
		inputs: [
			{ type: 'address', name: 'to', internalType: 'address' },
			{ type: 'uint256', name: 'value', internalType: 'uint256' }
		]
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint8', name: '', internalType: 'uint8' }],
		name: 'decimals',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint128', name: '', internalType: 'uint128' }],
		name: 'id',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [],
		name: 'mint',
		inputs: [
			{ type: 'address', name: 'to', internalType: 'address' },
			{ type: 'uint256', name: 'value', internalType: 'uint256' }
		]
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'string', name: '', internalType: 'string' }],
		name: 'name',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'address', name: '', internalType: 'address' }],
		name: 'registry',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'string', name: '', internalType: 'string' }],
		name: 'symbol',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
		name: 'totalSupply',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
		name: 'transfer',
		inputs: [
			{ type: 'address', name: 'to', internalType: 'address' },
			{ type: 'uint256', name: 'value', internalType: 'uint256' }
		]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
		name: 'transferFrom',
		inputs: [
			{ type: 'address', name: 'from', internalType: 'address' },
			{ type: 'address', name: 'to', internalType: 'address' },
			{ type: 'uint256', name: 'value', internalType: 'uint256' }
		]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
		name: 'transferWithExtra',
		inputs: [
			{ type: 'address', name: 'to', internalType: 'address' },
			{ type: 'uint256', name: 'value', internalType: 'uint256' },
			{ type: 'bytes', name: 'extra', internalType: 'bytes' }
		]
	}
];

export const MVM_ERC20_ABI = [
	{
		type: 'constructor',
		stateMutability: 'nonpayable',
		inputs: [
			{ type: 'uint128', name: '_id', internalType: 'uint128' },
			{ type: 'string', name: '_name', internalType: 'string' },
			{ type: 'string', name: '_symbol', internalType: 'string' }
		]
	},
	{
		type: 'event',
		name: 'Approval',
		inputs: [
			{
				type: 'address',
				name: 'owner',
				internalType: 'address',
				indexed: true
			},
			{
				type: 'address',
				name: 'spender',
				internalType: 'address',
				indexed: true
			},
			{
				type: 'uint256',
				name: 'value',
				internalType: 'uint256',
				indexed: false
			}
		],
		anonymous: false
	},
	{
		type: 'event',
		name: 'Transfer',
		inputs: [
			{
				type: 'address',
				name: 'from',
				internalType: 'address',
				indexed: true
			},
			{
				type: 'address',
				name: 'to',
				internalType: 'address',
				indexed: true
			},
			{
				type: 'uint256',
				name: 'value',
				internalType: 'uint256',
				indexed: false
			}
		],
		anonymous: false
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint256', name: 'remaining', internalType: 'uint256' }],
		name: 'allowance',
		inputs: [
			{ type: 'address', name: '_owner', internalType: 'address' },
			{ type: 'address', name: '_spender', internalType: 'address' }
		]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
		name: 'approve',
		inputs: [
			{ type: 'address', name: '_spender', internalType: 'address' },
			{ type: 'uint256', name: '_value', internalType: 'uint256' }
		]
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint256', name: 'balance', internalType: 'uint256' }],
		name: 'balanceOf',
		inputs: [{ type: 'address', name: '_owner', internalType: 'address' }]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [],
		name: 'burn',
		inputs: [
			{ type: 'address', name: 'to', internalType: 'address' },
			{ type: 'uint256', name: 'value', internalType: 'uint256' }
		]
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint8', name: '', internalType: 'uint8' }],
		name: 'decimals',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint128', name: '', internalType: 'uint128' }],
		name: 'id',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [],
		name: 'mint',
		inputs: [
			{ type: 'address', name: 'to', internalType: 'address' },
			{ type: 'uint256', name: 'value', internalType: 'uint256' }
		]
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'string', name: '', internalType: 'string' }],
		name: 'name',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'address', name: '', internalType: 'address' }],
		name: 'registry',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'string', name: '', internalType: 'string' }],
		name: 'symbol',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
		name: 'totalSupply',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
		name: 'transfer',
		inputs: [
			{ type: 'address', name: 'to', internalType: 'address' },
			{ type: 'uint256', name: 'value', internalType: 'uint256' }
		]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
		name: 'transferFrom',
		inputs: [
			{ type: 'address', name: 'from', internalType: 'address' },
			{ type: 'address', name: 'to', internalType: 'address' },
			{ type: 'uint256', name: 'value', internalType: 'uint256' }
		]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
		name: 'transferWithExtra',
		inputs: [
			{ type: 'address', name: 'to', internalType: 'address' },
			{ type: 'uint256', name: 'value', internalType: 'uint256' },
			{ type: 'bytes', name: 'extra', internalType: 'bytes' }
		]
	}
];

export const REGISTRY_ABI = [
	{
		type: 'constructor',
		stateMutability: 'nonpayable',
		inputs: [
			{ type: 'bytes', name: 'raw', internalType: 'bytes' },
			{ type: 'uint128', name: 'pid', internalType: 'uint128' }
		]
	},
	{
		type: 'event',
		name: 'AssetCreated',
		inputs: [
			{ type: 'address', name: 'at', internalType: 'address', indexed: true },
			{ type: 'uint256', name: 'id', internalType: 'uint256', indexed: false }
		],
		anonymous: false
	},
	{
		type: 'event',
		name: 'Halted',
		inputs: [{ type: 'bool', name: 'state', internalType: 'bool', indexed: false }],
		anonymous: false
	},
	{
		type: 'event',
		name: 'Iterated',
		inputs: [
			{ type: 'uint256[4]', name: 'from', internalType: 'uint256[4]', indexed: false },
			{ type: 'uint256[4]', name: 'to', internalType: 'uint256[4]', indexed: false }
		],
		anonymous: false
	},
	{
		type: 'event',
		name: 'MixinEvent',
		inputs: [
			{ type: 'uint64', name: 'nonce', internalType: 'uint64', indexed: true },
			{ type: 'address', name: 'user', internalType: 'address', indexed: true },
			{ type: 'address', name: 'asset', internalType: 'address', indexed: true },
			{ type: 'uint256', name: 'amount', internalType: 'uint256', indexed: false },
			{ type: 'bytes', name: 'extra', internalType: 'bytes', indexed: false },
			{ type: 'uint64', name: 'timestamp', internalType: 'uint64', indexed: false }
		],
		anonymous: false
	},
	{
		type: 'event',
		name: 'MixinTransaction',
		inputs: [{ type: 'bytes', name: 'raw', internalType: 'bytes', indexed: false }],
		anonymous: false
	},
	{
		type: 'event',
		name: 'UserCreated',
		inputs: [
			{ type: 'address', name: 'at', internalType: 'address', indexed: true },
			{ type: 'bytes', name: 'members', internalType: 'bytes', indexed: false }
		],
		anonymous: false
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
		name: 'GROUP',
		inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }]
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
		name: 'HALTED',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint64', name: '', internalType: 'uint64' }],
		name: 'INBOUND',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint64', name: '', internalType: 'uint64' }],
		name: 'OUTBOUND',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint128', name: '', internalType: 'uint128' }],
		name: 'PID',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
		name: 'VERSION',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint128', name: '', internalType: 'uint128' }],
		name: 'assets',
		inputs: [{ type: 'address', name: '', internalType: 'address' }]
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
		name: 'balances',
		inputs: [{ type: 'uint128', name: '', internalType: 'uint128' }]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
		name: 'burn',
		inputs: [
			{ type: 'address', name: 'user', internalType: 'address' },
			{ type: 'uint256', name: 'amount', internalType: 'uint256' },
			{ type: 'bytes', name: 'extra', internalType: 'bytes' }
		]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
		name: 'claim',
		inputs: [
			{ type: 'address', name: 'asset', internalType: 'address' },
			{ type: 'uint256', name: 'amount', internalType: 'uint256' }
		]
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'address', name: '', internalType: 'address' }],
		name: 'contracts',
		inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [],
		name: 'halt',
		inputs: [{ type: 'bytes', name: 'raw', internalType: 'bytes' }]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [],
		name: 'iterate',
		inputs: [{ type: 'bytes', name: 'raw', internalType: 'bytes' }]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
		name: 'mixin',
		inputs: [{ type: 'bytes', name: 'raw', internalType: 'bytes' }]
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'bytes', name: '', internalType: 'bytes' }],
		name: 'users',
		inputs: [{ type: 'address', name: '', internalType: 'address' }]
	}
];

export const BRIDGE_ABI = [
	{
		type: 'constructor',
		stateMutability: 'nonpayable',
		inputs: [
			{ type: 'address', name: 'factory', internalType: 'address' },
			{ type: 'address', name: 'xin', internalType: 'address' }
		]
	},
	{
		type: 'event',
		name: 'Bound',
		inputs: [
			{
				type: 'address',
				name: 'from',
				internalType: 'address',
				indexed: true
			},
			{
				type: 'address',
				name: 'to',
				internalType: 'address',
				indexed: true
			}
		],
		anonymous: false
	},
	{
		type: 'event',
		name: 'Through',
		inputs: [
			{
				type: 'address',
				name: 'asset',
				internalType: 'address',
				indexed: true
			},
			{
				type: 'address',
				name: 'from',
				internalType: 'address',
				indexed: true
			},
			{
				type: 'address',
				name: 'to',
				internalType: 'address',
				indexed: true
			},
			{
				type: 'uint256',
				name: 'amount',
				internalType: 'uint256',
				indexed: false
			}
		],
		anonymous: false
	},
	{
		type: 'event',
		name: 'Vault',
		inputs: [
			{
				type: 'address',
				name: 'from',
				internalType: 'address',
				indexed: true
			},
			{
				type: 'uint256',
				name: 'amount',
				internalType: 'uint256',
				indexed: false
			}
		],
		anonymous: false
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
		name: 'BASE',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'address', name: '', internalType: 'address' }],
		name: 'FACTORY',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'address', name: '', internalType: 'address' }],
		name: 'OWNER',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'address', name: '', internalType: 'address' }],
		name: 'XIN',
		inputs: []
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [],
		name: 'bind',
		inputs: [{ type: 'address', name: 'receiver', internalType: 'address' }]
	},
	{
		type: 'function',
		stateMutability: 'view',
		outputs: [{ type: 'address', name: '', internalType: 'address' }],
		name: 'bridges',
		inputs: [{ type: 'address', name: '', internalType: 'address' }]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [],
		name: 'pass',
		inputs: [
			{ type: 'address', name: 'asset', internalType: 'address' },
			{ type: 'uint256', name: 'amount', internalType: 'uint256' }
		]
	},
	{
		type: 'function',
		stateMutability: 'payable',
		outputs: [],
		name: 'release',
		inputs: [
			{ type: 'address', name: 'receiver', internalType: 'address' },
			{ type: 'bytes', name: 'input', internalType: 'bytes' }
		]
	},
	{
		type: 'function',
		stateMutability: 'nonpayable',
		outputs: [],
		name: 'vault',
		inputs: [
			{ type: 'address', name: 'asset', internalType: 'address' },
			{ type: 'uint256', name: 'amount', internalType: 'uint256' }
		]
	},
	{ type: 'receive', stateMutability: 'payable' }
];
