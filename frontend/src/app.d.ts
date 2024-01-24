import '@auth/sveltekit';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// Declare your framework library
declare module '@auth/sveltekit' {
	/**
	 * The shape of the user object returned in the OAuth providers' `profile` callback,
	 * or the second parameter of the `session` callback, when using a database.
	 */
	interface User {
		pk: number;
		username: string;
		email: string;
		first_name: string;
		last_name: string;
	}
	/**
	 * The shape of the account object returned in the OAuth providers' `account` callback,
	 * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
	 */
	// interface Account {}

	/**
	 * Returned by `useSession`, `auth`, contains information about the active session.
	 */
	interface Session {
		access_token: string;
		refresh_token: string;
		ref: number;
		iat: number;
		exp: number;
		jti: string;
		error?: 'RefreshAccessTokenError';
	}
}

export {};
