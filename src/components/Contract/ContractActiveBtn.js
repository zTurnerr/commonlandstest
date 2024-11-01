import { Center } from 'native-base';
import React from 'react';
import Button from '../Button';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';

const ContractActiveBtn = ({ contract = {}, loading, invites = [], onPress = () => {} }) => {
    const t = useTranslate();
    const user = useShallowEqualSelector((state) => state.user.userInfo);

    const showBtn = () => {
        if (contract?.status !== 'created') {
            return false;
        }
        if (user?._id != contract?.creator?.user?._id) {
            return false;
        }
        if (contract?.isActivating) {
            return false;
        }
        return true;
    };

    const canActive = () => {
        try {
            if (!invites?.length) {
                return false;
            }
            // loop invites
            let res = true;
            invites.forEach((item) => {
                if (item?.status === 'pending' || item?.status === 'rejected') {
                    res = false;
                }
            });
            return res;
        } catch (error) {
            return false;
        }
    };

    if (!showBtn()) {
        return null;
    }

    return (
        <Center w="100%" mb={'24px'} mt={'auto'} px="10px">
            <Button
                disabled={!canActive()}
                _container={{
                    opacity: canActive() ? 1 : 0.5,
                }}
                w="100%"
                isLoading={loading}
                onPress={onPress}
            >
                {t('button.activeContract')}
            </Button>
        </Center>
    );
};

export default ContractActiveBtn;
