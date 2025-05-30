import { refreshToken } from '../services/authServices'

export default async function authFetch (url, options, auth) {
    const token = auth.token
    const config = {
        ...options,
        headers: {
            ...options.headers,
            Authorization: token ? `Bearer ${token}` : ''
        },
        credentials: 'include'
    }
    const isFormData = options.body instanceof FormData
    if(!isFormData){
        config.headers['Content-Type'] = 'application/json'
    }

    let res = await fetch(url, config)
    // const data = await res.json()
    // console.log('auth fetched: ', data)
    if (res.status === 401) {
        try {
            const data = await refreshToken()
            if (data.accessToken) {
                auth.login(data.accessToken)
                config.headers.Authorization = `Bearer ${data.accessToken}`
                res = await fetch(url, config)
            }
        } catch (err) {
            console.error('Token refresh failed:', err);
            auth.logout();
        }
    }
    return res
}
