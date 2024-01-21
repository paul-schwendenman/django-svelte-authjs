<script lang="ts">
    // import { getCsrfToken } from '@auth/sveltekit';
  export let data;

  const { csrfToken } = data;

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
