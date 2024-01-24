<script>
	import { page } from '$app/stores';
	import { signIn } from '@auth/sveltekit/client';
	import { onMount } from 'svelte';

	onMount(() => {
		if ($page.data.session?.error) {
			signIn(undefined, { callbackUrl: $page.url.pathname });
		}
	});
</script>

<b>Secrets</b>
