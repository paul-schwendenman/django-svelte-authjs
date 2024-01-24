<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { page } from '$app/stores';

	$: session = $page.data.session;

	let response = '{}';

	const getUserDetails = async (useToken: boolean) => {
		try {
			const headers = new Headers(
				useToken && session?.access_token
					? { Authorization: `Bearer ${session?.access_token}` }
					: {}
			);

			const resp = await fetch(env.PUBLIC_AUTHJS_BACKEND_URL + 'auth/user/', {
				method: 'GET',
				headers
			});
			response = JSON.stringify(await resp.json());
		} catch (error) {
			response = error.message;
		}
	};
</script>

<div>
	<div>
		<p>PK: {session?.user?.pk}</p>
		<p>Username: {session?.user?.username}</p>
		<p>Email: {session?.user?.email || 'Not provided'}</p>
		<pre>
        {response}
      </pre>
	</div>
	<div>
		<button on:click={() => getUserDetails(true)}> User details (with token) </button>
		<button on:click={() => getUserDetails(false)}> User details (without token) </button>
	</div>
</div>
