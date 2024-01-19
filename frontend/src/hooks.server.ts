import { SvelteKitAuth } from '@auth/sveltekit';
import type { SvelteKitAuthConfig } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import CredentialsProvider from '@auth/sveltekit/providers/credentials';
import axios from 'axios';
import {
	GITHUB_ID,
	GITHUB_SECRET,
	NEXTAUTH_SECRET,
	NEXTAUTH_BACKEND_URL
} from '$env/static/private';

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
		// console.log({user, account, profile, email, credentials})
		return true;
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
					const response = await axios({
						url: NEXTAUTH_BACKEND_URL + 'auth/login/',
						method: 'post',
						data: credentials
					});
					const data = response.data;
					console.log({ data });

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
			// console.log({user, token, account});
			if (user && account) {
				let backendResponse = account.provider === 'credentials' ? user : account.meta;

				token['user'] = backendResponse.user;
				token['access_token'] = backendResponse.access;
				token['refresh_token'] = backendResponse.refresh;
				token['ref'] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;

				return token;
			}

			// Refresh the backend token if necessary
			if (getCurrentEpochTime() > token['ref']) {
				const response = await axios({
					method: 'post',
					url: process.env.NEXTAUTH_BACKEND_URL + 'auth/token/refresh/',
					data: {
						refresh: token['refresh_token']
					}
				});
				token['access_token'] = response.data.access;
				token['refresh_token'] = response.data.refresh;
				token['ref'] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
			}
			return token;
		},
		async session({ token }) {
			// console.log({token});
			return token;
		}
	}
};

export const handle = SvelteKitAuth(authOptions);
