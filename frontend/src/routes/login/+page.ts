export async function load({ fetch }) {
    const csrfToken = await fetch('auth/csrf').then(r => r.json()).then(data => data.csrfToken);
    const providers = await fetch('auth/providers').then(r => r.json());

    return { csrfToken, providers }
}
