import React from 'react';
import UserRow from '../../CreatePlot/InvitePeople/UserRow';
import Button from '../../../components/Button';
import { HStack, Text, useTheme } from 'native-base';
import useTranslate from '../../../i18n/useTranslate';
import { TransferOwnershipIcon } from '../../../components/Icons';

const RowTransfer = ({ onClickTransfer, info, button, type }) => {
    const t = useTranslate();
    const theme = useTheme();
    const onClick = () => {
        onClickTransfer(info);
    };

    const checkCanTransfer = () => {
        if (type === 'owner' || type === 'co-owner') return false;
        return true;
    };

    return (
        <UserRow
            bg="white"
            info={info}
            type={type}
            mb="6px"
            px="12px"
            py="15px"
            alignItems="flex-start"
            button={button}
        >
            {checkCanTransfer() && (
                <Button width="100px" height="35px" variant="outline" mt="10px" onPress={onClick}>
                    <HStack alignItems={'center'}>
                        <TransferOwnershipIcon
                            color={theme.colors.primary[600]}
                            height={30}
                            width={30}
                        />
                        <Text fontSize={12} fontWeight={700} color={'primary.600'}>
                            {t('transferOwnership.transfer')}
                        </Text>
                    </HStack>
                </Button>
            )}
        </UserRow>
    );
};

export default RowTransfer;
