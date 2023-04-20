<script lang="ts">
	import LayoutWrapper from '../(layout-partials)/LayoutWrapper.svelte';
	// TODO: More actions
	// export let form: ActionData;

	import type { PageData } from './$types';
	import FirebaseUiAuth from './FirebaseUIAuth.svelte';
	export let data: PageData;
	$: action = `?/login&redirectTo=${data.redirectTo ? data.redirectTo : '/dashboard'}`;
</script>

<LayoutWrapper>
	<section class="bcu-card flex flex-col gap-4 p-4">
		<FirebaseUiAuth {action} />
	</section>
</LayoutWrapper>
