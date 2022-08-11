export const ERC20_ABI = [
	'event Approval(address indexed _owner, address indexed _spender, uint256 _value)',
	'event Transfer(address indexed _from, address indexed _to, uint256 _value)',
	'function allowance(address _owner, address _spender) public view returns (uint256 remaining)',
	'function approve(address _spender, uint256 _value) public returns (bool success)',
	'function balanceOf(address _owner) public view returns (uint256 balance)',
	'function decimals() public view returns (uint8)',
	'function name() public view returns (string)',
	'function symbol() public view returns (string)',
	'function totalSupply() public view returns (uint256)',
	'function transfer(address _to, uint256 _value) public returns (bool success)',
	'function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)'
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
