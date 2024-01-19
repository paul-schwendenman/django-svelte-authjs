<script lang="ts">
	import { page } from '$app/stores';


</script>

<div>
    {#if $page.data.session}
        <p>Session:</p>
        <pre>
{JSON.stringify($page.data.session, null, 4)}
        </pre>
        <p>Session expiry: {$page.data.session?.expires}</p>
    {:else}
      <h1>Access Denied</h1>
      <p>
        <a href="/auth/signin"> You must be signed in to view this page </a>
      </p>
    {/if}
</div>
