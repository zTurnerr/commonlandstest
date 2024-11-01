import { Box, ScrollView, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import RowTransfer from './components/RowTransfer';

const InternalTransfer = ({ claimants, onClickTransfer }) => {
    const t = useTranslate();

    useShallowEqualSelector((state) => ({
        user: state.user.userInfo,
    }));

    return (
        <Box flexGrow={2}>
            <Text pl={5} fontWeight={600} fontSize={12} my={2}>
                {t('transferOwnership.allClaimants')}
            </Text>
            <ScrollView h={'60%'}>
                {claimants.map((item, index) => (
                    <RowTransfer
                        info={{
                            fullName: item.fullName,
                            phoneNumber: item.phoneNumber,
                            avatar: item.avatar,
                            _id: item._id,
                        }}
                        key={index}
                        onClickTransfer={onClickTransfer}
                        type={item?.role}
                    />
                ))}
            </ScrollView>
        </Box>
    );
};

export default InternalTransfer;
