
let timer;

export default {
    async auth(context, payload) {
        const mode = payload.mode
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC2czfxakIVN0g-1MxWnTehE9FGfn1Cy1Q'
        if (mode === 'signin') {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC2czfxakIVN0g-1MxWnTehE9FGfn1Cy1Q'
        }

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                returnSecureToken: true
            }),

        })
        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.message) || 'authentication failed;'
            throw error;
        }

        const expiresIn = +responseData.expiresIn * 1000
        // const expiresIn = 5000
        const expirationDate = new Date().getTime + expiresIn

        localStorage.setItem('token', responseData.idToken);
        localStorage.setItem('userId', responseData.localId);
        localStorage.setItem('tokenExpiration', expirationDate)

        timer = setTimeout(function () {
            context.dispatch('autoLogout')
        }, expiresIn)

        context.commit('setUser', {
            token: responseData.idToken,
            userId: responseData.localId,
            // tokenExpiration: responseData.expiresln

        })


    },

    async login(context, payload) {
        context.dispatch('auth', {
            ...payload, mode: 'signin'
        })
    },
    async signup(context, payload) {
        context.dispatch('auth', {
            ...payload, mode: 'signup'
        })

    },
    logout(context) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenExpiration')

        clearTimeout(timer);

        context.commit('setUser', {
            token: null,
            userId: null,
            // tokenExpiratio: null
        })
    },
    tryLogin(context) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId')
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        const expiresIn = +tokenExpiration - new Date().getTime();

        if (expiresIn < 0) {
            return
        }

        timer = setTimeout(function () {
            context.dispatch('autoLogout')
        }, expiresIn)
            ;
        if (token && userId) {
            context.commit('setUser', {
                token,
                userId,
                // tokenExpiration: null
            })
        }

    },
    autoLogout(context) {
        context.dispatch('logout');
        context.commit('setAutoLogout');
    }
}