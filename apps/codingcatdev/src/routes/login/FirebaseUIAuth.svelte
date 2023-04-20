<script lang="ts">
	export let action: string;

	import { setCcdIdTokenCookie, storeFirebaseApp } from '$lib/client/firebase';
	import firebase from 'firebase/compat/app';
	import * as firebaseui from 'firebaseui';
	import 'firebaseui/dist/firebaseui.css';
	import { onMount } from 'svelte';

	onMount(async () => {
		storeFirebaseApp.subscribe((app) => {
			if (!app || !app.options) return;

			firebase.initializeApp(app.options);

			// FirebaseUI config.
			var uiConfig = {
				callbacks: {
					signInSuccessWithAuthResult: () => {
						return false;
					}
				},
				signInOptions: [
					// Leave the lines as is for the providers you want to offer your users.
					firebase.auth.GoogleAuthProvider.PROVIDER_ID,
					firebase.auth.TwitterAuthProvider.PROVIDER_ID,
					firebase.auth.GithubAuthProvider.PROVIDER_ID,
					firebase.auth.EmailAuthProvider.PROVIDER_ID
				],
				tosUrl: `${window.location.origin}/terms-of-use`,
				privacyPolicyUrl: `${window.location.origin}/privacy-policy`
			};

			// Initialize the FirebaseUI Widget using Firebase.
			firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
			let ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
			ui.start('#firebaseui-auth-container', uiConfig);

			firebase.auth().onAuthStateChanged(async (user) => {
				if (!user) return;
				setCcdIdTokenCookie(await user.getIdToken());
				window.location.href = window.location.href.replace('login', 'login-validate');
			});
		});
	});
</script>

<div class="flex w-full h-full justify-center align-middle">
	<div class="flex align-middle" id="firebaseui-auth-container" />
</div>
