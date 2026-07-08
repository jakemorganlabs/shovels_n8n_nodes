/**
 * ShovelsApi credential type.
 * Invariant: stores exactly one secret (API key) and injects it as a header.
 * Does NOT validate the key's permissions — that is n8n's test-request responsibility.
 * Does NOT read process.env or fs; the key comes from n8n's encrypted credential store.
 */
import type {
	ICredentialTestRequest,
	ICredentialType,
	IAuthenticateGeneric,
	INodeProperties,
} from 'n8n-workflow';

export class ShovelsApi implements ICredentialType {
	name = 'shovelsApi';
	displayName = 'Shovels API';
	documentationUrl = 'https://docs.shovels.ai';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{ $credentials.apiKey }}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.shovels.ai/v2',
			url: '/permits/search',
			qs: {
				geo_id: 'CA',
				permit_from: '2024-01-01',
				permit_to: '2024-01-02',
				size: 1,
			},
		},
	};
}
