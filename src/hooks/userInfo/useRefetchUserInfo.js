import Constants, { getStorage, setStorage } from '../../util/Constants';
import { verifyAccessToken } from '../../rest_client/authClient';
import { userSliceActions } from '../../redux/reducer/user';
import store from '../../redux/store';

const refetchUserInfo = async () => {
    let access_token = await getStorage(Constants.STORAGE.access_token);
    let res = await verifyAccessToken({
        accessToken: access_token,
    });
    await setStorage(Constants.STORAGE.lastLoggedAccount, JSON.stringify(res.data.user));
    store.dispatch(
        userSliceActions.updateUserInfo({
            userInfo: res.data.user,
        }),
    );
};

export default refetchUserInfo;
