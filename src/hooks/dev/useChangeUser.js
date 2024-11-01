import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/user';
import { useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';
import { signInWithPassword } from '../../rest_client/authClient';
import Constants, { setStorage } from '../../util/Constants';
import { handleUserData } from '../../util/script';
import { fetchRequiredData } from '../../redux/actions';

const password = '123456';
const phoneArr = [];
// let CUR_INDEX = 0;
// let CUR_INDEX = 1;
// let CUR_INDEX = 2;
let CUR_INDEX = 3;

const useChangeUser = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const signin = async () => {
        const deviceId = await DeviceInfo.getUniqueId();
        const deviceName = await DeviceInfo.getDeviceName();
        let res = await signInWithPassword({
            phoneNumber: phoneArr[CUR_INDEX],
            password,
            deviceId,
            deviceName,
        });
        await setStorage(Constants.STORAGE.access_token, res.data.accessToken);
        await handleUserData({ ...res.data.user, accessToken: res.data.accessToken });
        dispatch(
            fetchRequiredData(res.data.user, navigation, () => {
                navigation.navigate('Main');
            }),
        );
    };

    useEffect(() => {
        if (CUR_INDEX >= phoneArr.length) {
            return;
        }
        dispatch(logout(navigation));
        setTimeout(() => {
            signin();
        }, 2000);
    }, []);
};

export default useChangeUser;
