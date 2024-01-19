<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	let username = '';
	let password = '';
</script>

<h1>SvelteKit Auth Example</h1>
<p>
	{#if $page.data.session}
		{#if $page.data.session.user?.image}
			<span style="background-image: url('{$page.data.session.user.image}')" class="avatar" />
		{/if}
		<span class="signedInText">
			<small>Signed in as</small><br />
			<strong>{$page.data.session.user?.name ?? 'User'}</strong>
			<p>Signed in as {$page?.data?.session?.user?.username}</p>
		</span>
		<button on:click={() => signOut()} class="button">Sign out</button>
	{:else}
		<span class="notSignedInText">You are not signed in</span>
		<button on:click={() => signIn('github')}>Sign In with GitHub</button>
		<hr />
		<form>
			<label>
				Username
				<input name="username" type="text" bind:value={username} />
			</label>
			<label>
				Password
				<input name="password" type="password" bind:value={password} />
			</label>
			<button on:click={() => signIn('credentials', { username, password })}>Log in</button>
		</form>
		<hr />
		<button on:click={() => signIn(undefined, { callbackUrl: '/profile' })}
			>Sign In and go to profile</button
		>
	{/if}
</p>
