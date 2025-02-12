import { getContentBySlug, parseModules } from '$lib/server/content';
import { ContentType } from '$lib/types';
import { error } from '@sveltejs/kit';


const contentType = ContentType.framework;

export const load = (async ({ params }) => {
	const modules = import.meta.glob(['../../../../../content/framework/*.md']);
	const contentItems = await parseModules(modules);
	const content = await getContentBySlug({ contentItems, slug: params.slug });
	if (!content) {
		throw error(404, {
			message: 'Not found'
		});
	}
	return {
		contentType,
		content
	};
});
