<script lang="ts">
	import Lesson from '$lib/components/content/Lesson.svelte';
	import type { PageData } from './$types';
	import { afterNavigate } from '$app/navigation';
	import { state } from '$lib/stores/content/lesson';

	export let data: PageData;

	// This is to add the content to the state for Editor
	afterNavigate(() => {
		state.switch_exercise(data.content);
	});
</script>

<Lesson {data} />
