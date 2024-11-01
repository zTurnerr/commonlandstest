import React from 'react';
import { Text, HStack } from 'native-base';
import ClockCheck from '../Icons/ClockCheck';
import useTranslate from '../../i18n/useTranslate';
import { TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import useRemoveClaimantReq from '../../hooks/Plot/useRemoveClaimantReq';
import { useModalReplyRemove } from '../Plot/ModalReplyRemove';
import useUserInfo from '../../hooks/useUserInfo';

const PendingRemoveClaimantAlert = ({ onSeeMore = () => {} }) => {
    const t = useTranslate();
    const { params } = useRoute();
    useRemoveClaimantReq(params?.plotID);
    const user = useUserInfo();
    const rmReq = params?.removingClaimants?.[0];
    const modalReplyRemoveHook = useModalReplyRemove();
    if (!params?.removingClaimants?.length) {
        return null;
    }
    return (
        <HStack mt="5px" px="25px" w="full" py="10px" bg="yellow.1300" alignItems={'center'}>
            <ClockCheck height="25" width="25" color="#8A681E" />
            <Text flex={1} ml="10px" fontWeight={700} color="yellow.1400">
                {t('plot.removeClaimant5')}
            </Text>
            <TouchableOpacity
                onPress={() => {
                    if (rmReq?.claimant === user?._id && rmReq?.isAllOwnerApproved) {
                        modalReplyRemoveHook.open();
                        return;
                    }
                    onSeeMore();
                }}
            >
                <Text textDecorationLine="underline" color="yellow.1400" fontWeight={500}>
                    {t('button.view')}
                </Text>
            </TouchableOpacity>
            {rmReq.claimant === user?._id &&
                rmReq?.isAllOwnerApproved &&
                modalReplyRemoveHook.Component({})}
        </HStack>
    );
};

export default PendingRemoveClaimantAlert;
