import { SvelteKitAuth } from '@auth/sveltekit';
import type { SvelteKitAuthConfig } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import CredentialsProvider from '@auth/sveltekit/providers/credentials';
import {
	GITHUB_ID,
	GITHUB_SECRET,
	NEXTAUTH_SECRET,
	NEXTAUTH_BACKEND_URL
} from '$env/static/private';
import { dev } from '$app/environment';

// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days

const getCurrentEpochTime = () => {
	return Math.floor(new Date().getTime() / 1000);
};

const SIGN_IN_HANDLERS = {
	credentials: async (user, account, profile, email, credentials) => {
		// console.log({ user, account, profile, email, credentials });
		return true;
	},
	github: async (user, account, profile, email, credentials) => {
		try {
			const headers = new Headers({
				'Content-Type': 'application/json'
			});
			const response = await fetch(NEXTAUTH_BACKEND_URL + 'auth/github/', {
				method: 'POST',
				headers,
				body: JSON.stringify({
					access_token: account['access_token']
				})
			});

			account['meta'] = await response.json();
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
};

const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

const authOptions: SvelteKitAuthConfig = {
	secret: NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt',
		maxAge: BACKEND_REFRESH_TOKEN_LIFETIME
	},
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: { label: 'Username', type: 'text' },
				password: { label: 'Password', type: 'password' }
			},
			// The data returned from this function is passed forward as the
			// `user` variable to the signIn() and jwt() callback
			async authorize(credentials, req) {
				try {
					const headers = new Headers({
						'Content-Type': 'application/json'
					});
					const response = await fetch(NEXTAUTH_BACKEND_URL + 'auth/login/', {
						method: 'POST',
						body: JSON.stringify(credentials),
						headers
					});

					const data = await response.json();
					if (!response.ok) {
						console.warn({data});
						return null;
					} else {
						console.log({ data });
					}

					if (data) return data;
				} catch (error) {
					console.error(error);
				}
				return null;
			}
		}),
		GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })
	],
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			if (!SIGN_IN_PROVIDERS.includes(account?.provider)) {
				return false;
			}

			return SIGN_IN_HANDLERS[account.provider](user, account, profile, email, credentials);
		},
		async jwt({ user, token, account }) {
			if (user && account) {
				let backendResponse = account.provider === 'credentials' ? user : account.meta;

				token['user'] = backendResponse.user;
				token['access_token'] = backendResponse.access;
				token['refresh_token'] = backendResponse.refresh;
				token['ref'] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;

				return token;
			}

			try {
				// Refresh the backend token if necessary
				if (getCurrentEpochTime() > token['ref']) {
					console.log("Renewing");
					const headers = new Headers({
						'Content-Type': 'application/json'
					});
					const response = await fetch(NEXTAUTH_BACKEND_URL + 'auth/token/refresh/', {
						method: 'POST',
						body: JSON.stringify({ refresh: token['refresh_token'] }),
						headers
					});

					const data = await response.json();

					if (!response.ok) {
						throw data.detail
					}

					token['access_token'] = data.access;
					token['refresh_token'] = data.refresh;
					token['ref'] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
				}
				return token;
			} catch (error) {
				console.error("Failed to refresh token", error);

				return {...token, error: "RefreshTokenError" as const }
			}
		},
		async session({ token }) {
			// console.log({token});
			return token;
		}
	},
	logger: {
		error(error) {
			console.error(error);
		},
		warn(code) {
			console.warn(code);
		},
		debug(code, metadata) {
			console.debug(code, metadata);
		}
	},
	debug: dev,
	theme: {
		logo: '/favicon.png',
		brandColor: 'oklch(0.748 0.26 342.55)'
	}
};

export const handle = SvelteKitAuth(authOptions);
