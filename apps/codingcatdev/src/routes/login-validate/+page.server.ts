import { ccdCreateSessionCookie } from '$lib/server/firebase';
import { redirect } from '@sveltejs/kit'

export const load = (async ({ url, cookies }) => {
    const ccdLoginIdToken = cookies.get('__ccdlogin');

    if (!ccdLoginIdToken) {
        throw redirect(303, '/login?error=missing-ccd-token');
    }

    const sessionCookie = await ccdCreateSessionCookie(ccdLoginIdToken);
    if (!sessionCookie) {
        throw redirect(303, '/login?error=missing-session-token');
    }
    cookies.set(sessionCookie.name, sessionCookie.sessionCookie, sessionCookie.options);
    cookies.set('__ccdlogin', '', { expires: new Date(Date.now() - 3600) });

    if (url.searchParams.has('redirectTo')) {
        throw redirect(303, url.searchParams.get('redirectTo') || '/dashboard');
    }
    throw redirect(303, '/dashboard');
});