<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';

    // import { getCsrfToken } from '@auth/sveltekit';
  export let data;

  const { csrfToken, providers } = data;

  console.log({csrfToken})
</script>

<form method="post" action="/auth/callback/credentials">
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

{#each Object.values(providers) as provider (provider.id)}
<div>
  <button on:click={() => signIn(provider.id)}>
    Sign in with {provider.name}
  </button>
</div>
{/each}
