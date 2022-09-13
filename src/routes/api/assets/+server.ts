import type { RequestHandler } from '@sveltejs/kit';
import { fetchAssets } from '$lib/helpers/api';

export const GET: RequestHandler<Record<string, string>> = async ({
	locals: { user, provider }
}) => {
	if (!user || !provider) return new Response(undefined, { status: 401 });
	const assets = await fetchAssets(user);
	return new Response(JSON.stringify(assets));
};
