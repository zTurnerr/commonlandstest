import Client from './baseClient';
const http = new Client();

const _register = (data) => {
    return fetch(http.url + 'api/user/signup', {
        body: data,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateBackendServer = (url) => {
    http.updateBackend(url);
};

export const retrieveBackendServer = () => {
    return http.url;
};

// /v2/user/sign-up-for-review
export const signupForReview = (data, navigation, dispatch) => {
    return http.post(
        'api/v2/user/sign-up-for-review',
        data,
        navigation,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
        dispatch,
    );
};

export const authRegister = async (data) =>
    new Promise((r, rj) => {
        _register(data)
            .then(async (res) => {
                let data = await res.json();
                if (data.error_code) {
                    if (data.error_detail) {
                        return rj(data.error_detail);
                    }
                    return rj(data.error_message);
                }
                r(data);
            })
            .catch((err) => {
                rj(err);
            });
    });
export const authLogin = (data) => {
    return http.post('api/v2/user/sign-in', data);
};

export const verifyAccessToken = (data, navigation) => {
    return http.post('api/user/verifyToken', data, navigation);
};

export const verifyPhone = (data) => {
    let phone = data.replace('+', '%2B');
    let url = `api/user/phoneRegistered?phoneNumber=${phone}`;
    return http.get(url);
};

export const setStatusFirstLogin = (navigation) => {
    return http.get('api/user/firstLogin', navigation);
};
export const getOtp = (data) => {
    return http.post('api/otp/get', data);
};
export const verifyOtp = (data) => {
    return http.post('api/otp/verify', data);
};

export const forgotPassword = (data) => {
    return http.post('api/user/forgot-password', data);
};
export const signInWithPassword = (data) => {
    return http.post('api/user/signin-with-password', data);
};

export const getNotificationPublic = (data) => {
    return http.post('api/notification/public', data);
};
export const changePassword = (data) => {
    return http.post('api/user/change-password', data);
};
