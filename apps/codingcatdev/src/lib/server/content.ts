import fs from 'node:fs';
import path from 'node:path';
import { ContentType, ContentPublished, type DirectoryStub, type FileStub } from '$lib/types';
import type { Content, Course, Podcast } from '$lib/types';

// In Dev Mode read directly from content directory
const markdownFiles: {
	course: Course[];
	framework: Content[];
	language: Content[];
	page: Content[];
	podcast: Podcast[];
	post: Content[];
	tutorial: Content[];
} = {
	course: [],
	framework: [],
	language: [],
	page: [],
	podcast: [],
	post: [],
	tutorial: []
};

const LIMIT = 20;
const EXCLUDED = new Set(['.DS_Store', '.gitkeep', '.svelte-kit', 'package-lock.json']);
// TODO: Might not need this
const TEXTFILES = new Set([
	'.svelte',
	'.txt',
	'.json',
	'.js',
	'.ts',
	'.css',
	'.svg',
	'.html',
	'.md',
	'.env'
]);

console.log('Building top metadata level');
const modules = import.meta.glob(['/src/content/course/*/*.md', '/src/content/*/*.md']);
for (const path in modules) {
	modules[path]().then((mod) => {
		const splitPath = path.replace('/src/content/', '').split('/');
		const type = splitPath.at(0);
		const slug = splitPath.at(1);

		console.log(splitPath);

		if (!type || !slug) {
			console.error('Missing name or type');
			return;
		}

		const mdsvx = mod as {
			default: {
				render: () => { html: string };
			};
			metadata: Content;
		};
		const { html } = mdsvx.default.render();
		/**
		 * This needs to match the function that adds the
		 * same data to Firestore
		 */
		const content = {
			...mdsvx?.metadata,
			cover: mdsvx?.metadata?.cover ? decodeURI(mdsvx?.metadata?.cover) : '',
			type: type as ContentType,
			html,
			weight: mdsvx?.metadata?.weight ? mdsvx?.metadata?.weight : 0,
			published: mdsvx?.metadata?.published ? mdsvx?.metadata?.published : 'draft',
			start: mdsvx?.metadata?.start ? new Date(mdsvx?.metadata?.start) : new Date('Jan 01, 1900')
		};
		markdownFiles[type as keyof typeof markdownFiles].push(content);
	});
}

console.log('Add Lessons to courses');
const lessonModules = import.meta.glob('/src/content/course/*/lesson/*/*.md');
for (const path in lessonModules) {
	lessonModules[path]().then((mod) => {
		const splitPath = path.replace('/src/content/', '').split('/');
		const type = splitPath.at(0);
		const slug = splitPath.at(1);
		const lessonSlug = splitPath?.at(3)?.replace(/\.[^/.]+$/, '');

		console.log(splitPath);

		if (!type || !slug || !lessonSlug) {
			console.error('Lesson Param missing');
			return;
		}

		const mdsvx = mod as {
			default: {
				render: () => { html: string };
			};
			metadata: Content;
		};
		const { html } = mdsvx.default.render();
		/**
		 * This needs to match the function that adds the
		 * same data to Firestore
		 */
		const content = {
			...mdsvx?.metadata,
			cover: mdsvx?.metadata?.cover ? decodeURI(mdsvx?.metadata?.cover) : '',
			type: ContentType.lesson,
			slug: lessonSlug,
			courseSlug: slug,
			html,
			weight: mdsvx?.metadata?.weight ? mdsvx?.metadata?.weight : 0,
			published: mdsvx?.metadata?.published ? mdsvx?.metadata?.published : 'draft',
			start: mdsvx?.metadata?.start ? new Date(mdsvx?.metadata?.start) : new Date('Jan 01, 1900')
		};

		markdownFiles.course
			.filter((c) => c.slug === slug)
			.map((c) => {
				c?.lesson ? c.lesson.push(content) : (c['lesson'] = [content]);
			});
	});
}

// TODO: Maybe this can be cleaner?
console.log('Add Exercise A');
const excerciseAModules = import.meta.glob('/src/content/course/*/lesson/*/app-a/**/*.*');
for (const path in excerciseAModules) {
	excerciseAModules[path]().then((mod) => {
		const splitPath = path.replace('/src/content/', '').split('/');
		const course = splitPath.at(0);
		const courseSlug = splitPath.at(1);
		const lesson = splitPath.at(2);
		const lessonSlug = splitPath.at(3);

		const dir = `${process.cwd()}/src/content/${course}/${courseSlug}/${lesson}/${lessonSlug}/app-a`;

		markdownFiles.course
			.filter((c) => c.slug === courseSlug)
			.map((c) =>
				c?.lesson
					?.filter((l) => l.slug === lessonSlug)
					.map((l) => {
						l.a = walk(dir);
					})
			);
	});
}

// TODO: Maybe this can be cleaner?
console.log('Add Exercise A');
const excerciseBModules = import.meta.glob('/src/content/course/*/lesson/*/app-b/**/*.*');
for (const path in excerciseBModules) {
	excerciseBModules[path]().then((mod) => {
		const splitPath = path.replace('/src/content/', '').split('/');
		const course = splitPath.at(0);
		const courseSlug = splitPath.at(1);
		const lesson = splitPath.at(2);
		const lessonSlug = splitPath.at(3);

		const dir = `${process.cwd()}/src/content/${course}/${courseSlug}/${lesson}/${lessonSlug}/app-b`;

		markdownFiles.course
			.filter((c) => c.slug === courseSlug)
			.map((c) =>
				c?.lesson
					?.filter((l) => l.slug === lessonSlug)
					.map((l) => {
						l.b = walk(dir);
					})
			);
	});
}

/**
 * List all content from specified content type
 * allows for optionally sending after object
 * */
export const listContent = async ({
	contentType,
	after,
	limit,
	contentFilter = (c) => c.published === ContentPublished.published
}: {
	contentType: ContentType;
	after?: number;
	limit?: number;
	contentFilter?: (c: Content) => boolean;
}) => {
	const theLimit = limit || LIMIT;
	const theAfter = after || 0;

	console.log(`List for type: ${contentType}, limit of ${theLimit}`);

	const fullContent = markdownFiles[contentType as keyof typeof markdownFiles]
		.filter(contentFilter)
		.sort((a, b) => new Date(b.start).valueOf() - new Date(a.start).valueOf());

	const content = fullContent.slice(0 + theAfter, theLimit + theAfter);
	const total = fullContent.length;
	return {
		total,
		next: theAfter + theLimit <= total ? theAfter + theLimit : null,
		content
	};
};

export const getContentBySlug = async (contentType: ContentType, slug: string) => {
	console.debug(`Searching for content type: ${contentType} slug: ${slug}`);

	const doc = markdownFiles[contentType as keyof typeof markdownFiles]
		.filter(
			(c) =>
				c.slug == slug &&
				new Date(c.start) <= new Date() &&
				c.published === ContentPublished.published
		)
		.sort((a, b) => new Date(b.start).valueOf() - new Date(a.start).valueOf())
		.slice(0, 1)
		.map((c: Course) => {
			return {
				...c,
				lesson: c?.lesson
					?.filter(
						(l) => new Date(l.start) <= new Date() && l.published === ContentPublished.published
					)
					.sort((a, b) => b.weight || 99 - (a.weight || 1))
			};
		})
		.at(0);
	if (!doc) {
		return null;
	}
	return {
		...doc
	};
};

/**
 * Get lesson by course and slug
 * */
export const getLessonFromCourseSlug = async (courseSlug: string, slug: string) => {
	console.debug(`Searching for course: ${courseSlug}`);

	const course = markdownFiles.course
		.filter(
			(c) =>
				c.slug == courseSlug &&
				new Date(c.start) <= new Date() &&
				c.published === ContentPublished.published
		)
		.sort((a, b) => new Date(b.start).valueOf() - new Date(a.start).valueOf())
		.slice(0, 1)
		.map((c: Course) => {
			return {
				...c,
				lesson: c?.lesson
					?.filter(
						(l) => new Date(l.start) <= new Date() && l.published === ContentPublished.published
					)
					.sort((a, b) => b.weight || 99 - (a.weight || 1))
			};
		})
		.at(0);
	if (!course) {
		console.debug(`course not found`);
		return null;
	}
	console.debug(`Searching within ${course.slug} for lesson slug: ${slug}`);

	const doc = markdownFiles.course
		.filter((c) => c.slug === course.slug)
		?.at(0)
		?.lesson?.filter(
			(l) =>
				l.slug == slug &&
				new Date(l.start) <= new Date() &&
				l.published === ContentPublished.published
		)
		.sort((a, b) => new Date(b.start).valueOf() - new Date(a.start).valueOf())
		.slice(0, 1)
		.at(0);
	if (!doc) {
		console.debug(`lesson not found`);
		return null;
	}

	return {
		...doc,
		// Reduce html shipped for links
		lesson: course?.lesson?.map((l) => {
			// delete l.html;
			return l;
		}),
		courseSlug: course.slug
	};
};

export function walk(cwd: string, options: { exclude?: string[] } = {}) {
	const result: Record<string, FileStub | DirectoryStub> = {};

	if (!fs.existsSync(cwd)) return result;

	function walk_dir(dir: string, depth: number) {
		const files = fs.readdirSync(path.join(cwd, dir));
		for (const basename of files) {
			if (EXCLUDED.has(basename)) continue;

			const name = dir + basename;

			if (options.exclude?.some((exclude) => name.replace(/\\/g, '/').endsWith(exclude))) continue;

			const resolved = path.join(cwd, name);
			const stats = fs.statSync(resolved);

			if (stats.isDirectory()) {
				result[name] = {
					type: 'directory',
					name,
					basename
				};

				walk_dir(name + '/', depth + 1);
			} else {
				const text = TEXTFILES.has(path.extname(name) || path.basename(name));
				const contents = fs.readFileSync(resolved, text ? 'utf-8' : 'base64');

				result[name] = {
					type: 'file',
					name,
					basename,
					text,
					contents
				};
			}
		}
	}

	return walk_dir('/', 1), result;
}
