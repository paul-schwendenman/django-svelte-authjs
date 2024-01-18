<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';
	import axios from 'axios';
	import { env } from '$env/dynamic/public';
	import { page } from '$app/stores';

	$: session = $page.data.session;

	let response = '{}';

	const getUserDetails = async (useToken: boolean) => {
		try {
			const resp = await axios({
				method: 'get',
				url: env.PUBLIC_AUTHJS_BACKEND_URL + 'auth/user/',
				headers: useToken ? { Authorization: 'Bearer ' + session?.access_token } : {}
			});
			response = JSON.stringify(resp.data);
		} catch (error) {
			response = error.message;
		}
	};
</script>

<div>
	<div>
		<p>PK: {session.user.pk}</p>
		<p>Username: {session.user.username}</p>
		<p>Email: {session.user.email || 'Not provided'}</p>
		<pre>
        {response}
      </pre>
	</div>
	<div>
		<button on:click={() => getUserDetails(true)}> User details (with token) </button>
		<button on:click={() => getUserDetails(false)}> User details (without token) </button>
		<button on:click={() => signOut({ callbackUrl: '/' })}> Sign out </button>
	</div>
</div>
