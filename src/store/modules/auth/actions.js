export default {
    login() { },
    async signup(context, payload) {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC2czfxakIVN0g-1MxWnTehE9FGfn1Cy1Q`, {
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                returnSecureToken: true
            }),

        })
        const responseData = response.json();

        if (!response.ok) {
            const error = new Error(responseData.message) || 'authentication failed;'
            throw error;
        }
        console.log(responseData)
        context.commit('setUser', {
            token: responseData.idToken,
            userId: responseData.localId,
            tokenExpiration: responseData.expiresln

        })


    },
}