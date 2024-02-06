<script lang="ts">
	import { page } from '$app/stores';

	const decodeJWT = (token: string) => {
		const parts = token.split('.');

		if (parts.length !== 3) {
			throw new Error('Invalid JWT format');
		}

		const decodedHeader = atob(parts[0]);
		const decodedPayload = atob(parts[1]);

		const header = JSON.parse(decodedHeader);
		const payload = JSON.parse(decodedPayload);

		return {
			header,
			payload
		};
	};
</script>

<svelte:head>
	<title>Django Auth.js - Session</title>
</svelte:head>

<div>
	{#if $page.data.session}
		<p>Session:</p>
		<p>Session expiry: {new Date($page.data.session?.exp * 1000).toLocaleString()}</p>
		<p>Session issued: {new Date($page.data.session?.iat * 1000).toLocaleString()}</p>
		<p>Session reference: {new Date($page.data.session?.ref * 1000).toLocaleString()}</p>
		<pre style="overflow-y: auto;">
{JSON.stringify($page.data.session, null, 4)}
		</pre>
		Access token:
		<p>
			Access token expiry: {new Date(
				decodeJWT($page.data.session.access_token)?.payload?.exp * 1000
			).toLocaleString()}
		</p>
		<pre style="overflow-y: auto;">
{JSON.stringify(decodeJWT($page.data.session.access_token), null, 4)}
		</pre>
		Refresh token:
		<p>
			Refresh token expiry: {new Date(
				decodeJWT($page.data.session.refresh_token)?.payload?.exp * 1000
			).toLocaleString()}
		</p>
		<pre style="overflow-y: auto;">
{JSON.stringify(decodeJWT($page.data.session.refresh_token), null, 4)}
		</pre>
	{:else}
		<h1>Access Denied</h1>
		<p>
			<a href="/auth/signin"> You must be signed in to view this page </a>
		</p>
	{/if}
</div>
