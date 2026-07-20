// Pure routing config for the Shovels REST API. No imperative HTTP, no runtime deps.
// Not implemented (deferred): polling triggers (v1.1), batching, webhooks, custom transport.
import type {
	INodeType,
	INodeTypeDescription,
	INodeProperties,
} from 'n8n-workflow';

const genericPagination = {
	pagination: {
		type: 'generic' as const,
		properties: {
			continue: '={{ $response.body.next_page !== null }}',
			request: {
				qs: {
					page: '={{ $response.body.next_page }}',
				},
			},
		},
	},
};

const unwrapItems = [
	{
		type: 'rootProperty' as const,
		properties: {
			property: 'items',
		},
	},
];

const searchDisplayOptions: INodeProperties['displayOptions'] = {
	show: {
		resource: ['permit', 'contractor'],
		operation: ['search'],
	},
};

export class Shovels implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Shovels',
		name: 'shovels',
		icon: 'file:shovels.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Query building permits and contractors from the Shovels API',
		defaults: {
			name: 'Shovels',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'shovelsApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.shovels.ai/v2',
			headers: {
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Permit', value: 'permit' },
					{ name: 'Contractor', value: 'contractor' },
					{ name: 'Address', value: 'address' },
				],
				default: 'permit',
			},
			// permit operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Search',
						value: 'search',
						action: 'Search permits',
						routing: {
							request: {
								method: 'GET',
								url: '/permits/search',
							},
							operations: genericPagination,
							output: {
								postReceive: unwrapItems,
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get a permit',
						routing: {
							request: {
								method: 'GET',
								url: '=/permits/{{ $parameter.permitId }}',
							},
						},
					},
				],
				default: 'search',
				displayOptions: {
					show: {
						resource: ['permit'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Search',
						value: 'search',
						action: 'Search contractors',
						routing: {
							request: {
								method: 'GET',
								url: '/contractors/search',
							},
							operations: genericPagination,
							output: {
								postReceive: unwrapItems,
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get a contractor',
						routing: {
							request: {
								method: 'GET',
								url: '=/contractors/{{ $parameter.contractorId }}',
							},
						},
					},
				],
				default: 'search',
				displayOptions: {
					show: {
						resource: ['contractor'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Resolve',
						value: 'resolve',
						action: 'Resolve address to geo_id',
						routing: {
							request: {
								method: 'GET',
								url: '/addresses/search',
							},
							output: {
								postReceive: unwrapItems,
							},
						},
					},
				],
				default: 'resolve',
				displayOptions: {
					show: {
						resource: ['address'],
					},
				},
			},
			// search fields, shared across Permit + Contractor
			{
				displayName: 'Geo ID',
				name: 'geoId',
				type: 'string',
				default: '',
				required: true,
				description: 'State (CA) or ZIP (94103) directly; for a city/county/address, resolve it first',
				displayOptions: searchDisplayOptions,
				routing: {
					send: {
						type: 'query',
						property: 'geo_id',
					},
				},
			},
			{
				displayName: 'From Date',
				name: 'fromDate',
				type: 'string',
				default: '',
				required: true,
				description: 'Start date, format YYYY-MM-DD',
				displayOptions: searchDisplayOptions,
				routing: {
					send: {
						type: 'query',
						property: 'permit_from',
					},
				},
			},
			{
				displayName: 'To Date',
				name: 'toDate',
				type: 'string',
				default: '',
				required: true,
				description: 'End date, format YYYY-MM-DD',
				displayOptions: searchDisplayOptions,
				routing: {
					send: {
						type: 'query',
						property: 'permit_to',
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: searchDisplayOptions,
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
					maxValue: 500,
				},
				displayOptions: {
					show: {
						resource: ['permit', 'contractor'],
						operation: ['search'],
						returnAll: [false],
					},
				},
				routing: {
					output: {
						postReceive: [
							{
								type: 'limit',
								properties: {
									maxResults: '={{ $value }}',
								},
							},
						],
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: searchDisplayOptions,
				options: [
					{
						displayName: 'Property Type',
						name: 'propertyType',
						type: 'options',
						default: '',
						options: [
							{ name: 'Residential', value: 'residential' },
							{ name: 'Commercial', value: 'commercial' },
						],
						routing: {
							send: {
								type: 'query',
								property: 'property_type',
							},
						},
					},
					{
						displayName: 'Permit Tags',
						name: 'permitTags',
						type: 'string',
						default: '',
						description: 'Comma-separated tags. Use -tag to exclude. E.g. solar,-roofing',
						routing: {
							send: {
								type: 'query',
								property: 'permit_tags',
							},
						},
					},
				],
			},
			// get fields
			{
				displayName: 'Permit ID',
				name: 'permitId',
				type: 'string',
				default: '',
				required: true,
				description: 'The Shovels permit ID',
				displayOptions: {
					show: {
						resource: ['permit'],
						operation: ['get'],
					},
				},
			},
			{
				displayName: 'Contractor ID',
				name: 'contractorId',
				type: 'string',
				default: '',
				required: true,
				description: 'The Shovels contractor ID',
				displayOptions: {
					show: {
						resource: ['contractor'],
						operation: ['get'],
					},
				},
			},
			// address fields
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				required: true,
				description: 'Street address to resolve to geo_id(s)',
				displayOptions: {
					show: {
						resource: ['address'],
						operation: ['resolve'],
					},
				},
				routing: {
					send: {
						type: 'query',
						property: 'address',
					},
				},
			},
		],
	};
}
