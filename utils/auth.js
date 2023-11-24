import axios from 'axios';

const API_KEY = 'AIzaSyCgEsO3yY_iigpHpPzGctnG_1WfX_lh4G8'

export const authenticate = async (mode, email, password) => {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`
    const response = await axios.post(url, {
        email,
        password,
        returnSecureToken: true
    })

    const token = response.data.idToken;

    return token;
} 

export const createUser =  (email, password) => {
    return authenticate('signUp', email, password)
}

export const loginUser =  (email, password) => {
    return authenticate('signInWithPassword', email, password)
}