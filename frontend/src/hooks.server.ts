import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import { GITHUB_ID, GITHUB_SECRET, NEXTAUTH_SECRET } from '$env/static/private';

// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days

const SIGN_IN_HANDLERS = {
	credentials: async (user, account, profile, email, credentials) => {
		return true;
	},
	github: async (user, account, profile, email, credentials) => {
		console.log({ user, account, profile, email, credentials });
		return true;
	}
};

const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

export const handle = SvelteKitAuth({
	secret: NEXTAUTH_SECRET,
	providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			if (!SIGN_IN_PROVIDERS.includes(account?.provider)) {
				return false;
			}

			return SIGN_IN_HANDLERS[account.provider](user, account, profile, email, credentials);
		}
	}
});
