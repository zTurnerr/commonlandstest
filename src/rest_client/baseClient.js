import Constants, { getStorage, setStorage } from '../util/Constants';

import axios from 'axios';
import { logout } from '../redux/actions/user';

const handleRequest = async ({ res, error }, navigation, dispatch) => {
    try {
        if (error) {
            if (error?.response?.status) {
                switch (error.response.status) {
                    case 502:
                        throw 'Server is busy. Please try again later.';
                }
            }
            switch (error.message) {
                case 'Network Error':
                    throw 'Network Error';
                default:
                    throw error.message;
            }
        }

        let authorization = res.headers.authorization;
        if (authorization) {
            let access_token = authorization.split(' ')[1];
            let oldAccessToken = await getStorage(Constants.STORAGE.access_token);
            if (access_token && access_token !== oldAccessToken) {
                await setStorage(Constants.STORAGE.access_token, access_token);
            }
        }

        // let trainerAuthorization = res.headers['trainer-authorization'];
        // if (trainerAuthorization) {
        //     let access_token_trainer = trainerAuthorization.split(' ')[1];
        //     let oldAccessToken = await getStorage(Constants.STORAGE.trainer_token);
        //     if (access_token_trainer && access_token_trainer !== oldAccessToken) {
        //         await setStorage(Constants.STORAGE.trainer_token, access_token_trainer);
        //     }
        // }

        if (res.data.error_code) {
            if ([20002, 2006].includes(Number(res.data.error_code)) && navigation) {
                if (dispatch) {
                    dispatch(logout(navigation));
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Welcome' }],
                    });
                }
            }
            if ([5100, 5101, 4010, 2006].includes(res.data.error_code)) {
                throw JSON.stringify(res.data);
            }
            if (res.data.error_detail) {
                throw res.data.error_detail;
            }
            throw res.data.error_message;
        }
    } catch (err) {
        console.log(res?.config?.url, 'handleRequest', err);
        if (typeof err === 'string') {
            throw err;
        }
        throw JSON.stringify(err?.message);
    }
};
export default class Client {
    constructor(server) {
        this.url = (server || Constants.backendServer) + '/';
        this.client = axios.create({
            baseURL: this.url,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.client.interceptors.request.use(async (config) => {
            let access_token = await getStorage(Constants.STORAGE.access_token);
            let trainer_token = await getStorage(Constants.STORAGE.trainer_token);
            if (trainer_token) {
                if (trainer_token !== access_token) {
                    config.headers['trainer-authorization'] = `Bearer ${trainer_token}`;
                }
            }
            config.headers.Authorization = `Bearer ${access_token}`;
            return config;
        });
    }

    async updateBackend(url) {
        this.url = (url || Constants.backendServer) + '/';
        this.client = axios.create({
            baseURL: this.url,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.client.interceptors.request.use(async (config) => {
            let access_token = await getStorage(Constants.STORAGE.access_token);
            let trainer_token = await getStorage(Constants.STORAGE.trainer_token);
            if (trainer_token) {
                if (trainer_token !== access_token) {
                    config.headers['trainer-authorization'] = `Bearer ${trainer_token}`;
                }
            }
            config.headers.Authorization = `Bearer ${access_token}`;
            return config;
        });
    }

    async get(url, payload, navigation, dispatch) {
        let res = {};
        try {
            res = await this.client.get(url, payload || {});
        } catch (error) {
            await handleRequest({ error }, navigation, dispatch);
        }
        await handleRequest({ res }, navigation, dispatch);
        return res;
    }

    async post(url, payload, navigation, config, dispatch) {
        let res = {};
        try {
            res = await this.client.post(url, payload || {}, config);
        } catch (error) {
            await handleRequest({ error }, navigation, dispatch);
            return;
        }
        await handleRequest({ res }, navigation, dispatch);
        return res;
    }
    async delete(url, payload, navigation, dispatch) {
        let res = {};
        try {
            res = await this.client.delete(url, payload || {});
        } catch (error) {
            await handleRequest({ error }, navigation, dispatch);
        }
        await handleRequest({ res }, navigation, dispatch);
        return res;
    }
    async put(url, payload, navigation, config, dispatch) {
        let res = {};
        try {
            res = await this.client.put(url, payload || {}, config);
        } catch (error) {
            await handleRequest({ error }, navigation, dispatch);
        }
        await handleRequest({ res }, navigation, dispatch);
        return res;
    }
    async patch(url, payload, navigation, config, dispatch) {
        let res = {};
        try {
            res = await this.client.patch(url, payload || {}, config);
        } catch (error) {
            await handleRequest({ error }, navigation, dispatch);
        }
        await handleRequest({ res }, navigation, dispatch);
        return res;
    }
}
