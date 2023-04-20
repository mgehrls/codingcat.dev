<script lang="ts">
	import { storeFirebaseAuth } from '$lib/client/firebase';

	let form: HTMLFormElement;

	const logout = () => {
		storeFirebaseAuth.subscribe(async (auth) => {
			if (!auth) return;
			await auth.signOut();
			form.submit();
		});
	};
</script>

<button class="bcu-button variant-filled-primary" on:click={logout}>Logout</button>
<form method="POST" action="/login?/logout" bind:this={form} />
