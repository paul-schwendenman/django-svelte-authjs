<script lang="ts">
	import { page } from '$app/stores';
    import { env } from '$env/dynamic/public';

    async function linkGithub() {
        const access_token = $page.data.session.access_token;
        const url = env.PUBLIC_AUTHJS_BACKEND_URL + 'auth/github/connect/';
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        });

		try {
			const response = await fetch(url, {
				method: 'POST',
                headers
			});
            if (!response.ok) {
                throw response
            }
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
