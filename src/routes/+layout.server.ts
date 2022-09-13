import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user, provider } = locals;
	if (user && provider) return { user, provider };
};
