export async function load({ fetch }) {
    const csrfToken = await fetch('auth/csrf').then(r => r.json()).then(data => data.csrfToken);

    return { csrfToken }
}
