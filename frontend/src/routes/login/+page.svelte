<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';

	// import { getCsrfToken } from '@auth/sveltekit';
	export let data;

	const { csrfToken, providers } = data;

	console.log({ csrfToken });
</script>

<svelte:head>
	<title>Django Auth.js - Login</title>
</svelte:head>

{#each Object.values(providers) as provider (provider.id)}
	{#if provider.type == 'oauth'}
		<div>
			<button on:click={() => signIn(provider.id)}>
				Sign in with {provider.name}
			</button>
		</div>
	{:else if provider.type == 'credentials'}
		<form method="post" action={provider.callbackUrl}>
			<input name="csrfToken" type="hidden" value={csrfToken} />
			<label>
				Username
				<input name="username" type="text" />
			</label>
			<label>
				Password
				<input name="password" type="password" />
			</label>
			<button type="submit">Sign in</button>
		</form>
	{:else}
		<pre>
    {JSON.stringify(provider, null, 4)}
  </pre>
	{/if}
{/each}
