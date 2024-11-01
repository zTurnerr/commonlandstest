import axios from 'axios';
import { getAllNotification } from '../../rest_client/apiClient';
import { notificationsSliceActions } from '../reducer/notifications';
const CancelToken = axios.CancelToken;
let source;
export const getAllNo = (params = {}, callback = () => {}) => {
    return async (dispatch) => {
        try {
            if (source) {
                source.cancel('fetch notification cancel');
            }
            source = CancelToken.source();
            let res = await getAllNotification(params, {
                cancelToken: source.token,
            });
            source = null;

            dispatch(notificationsSliceActions.receiveNotification(res.data));

            callback();
        } catch (err) {
            console.log(err);
            callback(err);
        }
    };
};
