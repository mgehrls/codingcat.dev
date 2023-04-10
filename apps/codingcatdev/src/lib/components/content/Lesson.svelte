<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import LessonList from '$lib/components/content/LessonList.svelte';
	import Video from '$lib/components/content/Video.svelte';
	import Editor from '$lib/components/content/Editor.svelte';
	import type { Lesson } from '$lib/types';
	export let data: {
		content: Lesson;
	};
</script>

{#if data?.content}
	<div
		class="grid md:grid-cols-[minmax(50%,_1fr)_1fr]  grid-cols-1 w-full h-full overflow-x-hidden"
	>
		<div class="p-1 md:p-4 md:max-h-screen md:overflow-y-auto ">
			{#if data?.content?.youtube}
				<Video
					sources={[
						{
							src: data.content.youtube,
							type: 'video/youtube'
						}
					]}
				/>
			{/if}
			<section class="flex-grow w-full prose lg:prose-xl">
				{@html data.content.html}
			</section>
			{#if data?.content?.courseSlug && data?.content?.lesson}
				<section>
					<LessonList courseSlug={data.content.courseSlug} lesson={data.content.lesson} />
				</section>
			{/if}
		</div>
		<section class="grid grid-rows-[1fr_1fr] w-full h-screen md:h-full order-first md:order-none">
			<div class="container ">
				<section class="editor-container h-full w-full">
					<Editor />
				</section>
			</div>
			<div>Other</div>
		</section>
	</div>
{:else}
	<p>No data found yet</p>
{/if}
