import { useNavigation } from '@react-navigation/native';
import { Image } from 'native-base';
import React from 'react';
import { Alert } from 'react-native';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import { getContractByDID } from '../../../rest_client/apiClient';
import { Images } from '../../../themes';
import IconWrapper from './IconWrapper';
import Info from './Info';
import Wrapper from './Wrapper';

export default function Index({
    data,
    // showBtnGroup = false,
    // getData = () => { },
    setLoading = () => {},
}) {
    const navigation = useNavigation();
    useShallowEqualSelector((state) => ({
        user: state.user.userInfo,
    }));
    let contract = JSON.parse(data?.data || {});
    const onFetchContract = async () => {
        try {
            const { data } = await getContractByDID(
                contract?.did || contract?.contractDid || contract?.contract?.did,
            );
            return data?.contract || {};
        } catch (error) {
            Alert.alert('Error', error);
            return false;
        }
    };

    const onPress = async () => {
        setLoading(true);
        let newContract = await onFetchContract();
        if (!newContract) {
            setLoading(false);
            return;
        }
        setLoading(false);
        navigation.navigate('CreatorContractDetail', {
            contract: newContract,
            item: newContract,
            reload: false,
            requestToUnlock: true,
        });
    };

    // const onDecline = async () => {
    //     try {
    //         await cosignerDeclineContract(contract?.did, null, null);
    //         await choseActionNotification({
    //             notificationID: data?._id,
    //             action: 'decline',
    //         });
    //         getData?.();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    return (
        <>
            <Wrapper onPress={onPress} data={data}>
                <IconWrapper>
                    <Image alt="iconNotify" source={Images.icReceiptEdit} />
                </IconWrapper>
                <Info
                    data={data}
                    expireTime={contract?.requestInfo?.expiresAt}
                    // btnGroup={
                    //     showBtnGroup ? (
                    //         <GroupButtonNotify onAccept={onPress} onDecline={onDecline} />
                    //     ) : null
                    // }
                />
            </Wrapper>
        </>
    );
}
