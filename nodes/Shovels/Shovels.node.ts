import type {
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

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
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['permit'],
					},
				},
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
						},
					},
				],
				default: 'search',
			},
			{
				displayName: 'Geo ID',
				name: 'geoId',
				type: 'string',
				default: '',
				required: true,
				description: 'State (CA) or ZIP (94103) directly; for a city/county/address, resolve it first',
				displayOptions: {
					show: {
						resource: ['permit'],
						operation: ['search'],
					},
				},
				routing: {
					send: {
						type: 'query',
						property: 'geo_id',
					},
				},
			},
			{
				displayName: 'Permit From',
				name: 'permitFrom',
				type: 'string',
				default: '',
				required: true,
				description: 'Start date, format YYYY-MM-DD',
				displayOptions: {
					show: {
						resource: ['permit'],
						operation: ['search'],
					},
				},
				routing: {
					send: {
						type: 'query',
						property: 'permit_from',
					},
				},
			},
			{
				displayName: 'Permit To',
				name: 'permitTo',
				type: 'string',
				default: '',
				required: true,
				description: 'End date, format YYYY-MM-DD',
				displayOptions: {
					show: {
						resource: ['permit'],
						operation: ['search'],
					},
				},
				routing: {
					send: {
						type: 'query',
						property: 'permit_to',
					},
				},
			},
		],
	};
}
