<script lang="ts">
	import { page } from '$app/stores';
    import { env } from '$env/dynamic/public';

    import axios from 'axios';

    async function linkGithub() {
        const access_token = $page.data.session.access_token;

		try {
			const response = await axios({
				method: 'post',
				url: env.PUBLIC_AUTHJS_BACKEND_URL + 'auth/github/connect/',
				data: {
					access_token
				}
			});
		} catch (error) {
			console.error(error);
		}

    }
</script>

<div>
	{#if $page.data.session}
        <button on:click={linkGithub}>Link Github</button>
	{:else}
		<h1>Access Denied</h1>
		<p>
			<a href="/auth/signin"> You must be signed in to view this page </a>
		</p>
	{/if}
</div>
