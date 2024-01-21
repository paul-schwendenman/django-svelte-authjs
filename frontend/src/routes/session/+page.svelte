<script lang="ts">
	import { page } from '$app/stores';
</script>

<div>
	{#if $page.data.session}
		<p>Session:</p>
		<p>Session expiry: {new Date($page.data.session?.exp * 1000).toLocaleString()}</p>
		<p>Session issued: {new Date($page.data.session?.iat * 1000).toLocaleString()}</p>
		<p>Session reference: {new Date($page.data.session?.ref * 1000).toLocaleString()}</p>
		<pre style="overflow-y: auto;">
{JSON.stringify($page.data.session, null, 4)}
        </pre>
	{:else}
		<h1>Access Denied</h1>
		<p>
			<a href="/auth/signin"> You must be signed in to view this page </a>
		</p>
	{/if}
</div>
