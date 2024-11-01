import { Box, Button, HStack, Text } from 'native-base';
import React from 'react';
import ContractEmptySigner from '../../../components/Contract/ContractEmptySigner';
import SignerItem from '../../../components/Contract/SignerItem';
import UserProfileAdd from '../../../components/Icons/UserProfileAdd';
import useTranslate from '../../../i18n/useTranslate';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';

const ContractSignerSection = ({
    title,
    contract,
    containerStyle = {},
    onInviteCosigner,
    onSign = () => {},
    onRemove = () => {},
    onSentInvite = () => {},
    invites = [],
    onOpenModalSigner = () => {},
}) => {
    const t = useTranslate();
    const user = useShallowEqualSelector((state) => state.user.userInfo);
    const canInvite = () => {
        if (contract?.status !== 'created') {
            return false;
        }
        if (contract?.creator?.user?._id !== user?._id) {
            return false;
        }
        return true;
    };

    return (
        <Box mt="5px" pt="15px" {...containerStyle}>
            <HStack mb="10px" px="15px" justifyContent={'space-between'} alignItems={'center'}>
                <Text mb={'12px'} fontSize={'12px'} fontWeight={'700'}>
                    {title}
                </Text>
                <Box flex={1}></Box>
                {canInvite() && (
                    <Box w="80px">
                        <Button
                            maxH="40px"
                            borderColor={'primary.600'}
                            onPress={onInviteCosigner}
                            variant={'outline'}
                            px="10px"
                        >
                            <HStack space={2}>
                                <UserProfileAdd color="#5EC4AC" />
                                <Text fontWeight={600} color="primary.600">
                                    {t('invite.title')}
                                </Text>
                            </HStack>
                        </Button>
                    </Box>
                )}
            </HStack>
            {invites
                ?.filter(
                    (item) => item?.receiver?.phoneNumber !== contract?.creator?.user?.phoneNumber,
                )
                ?.map?.((item, index) => {
                    return (
                        <SignerItem
                            key={item?._id || index}
                            info={item}
                            onSentInvite={onSentInvite}
                            onSign={onSign}
                            onRemove={onRemove}
                            onOpenModalSigner={onOpenModalSigner}
                            contract={contract}
                        />
                    );
                })}
            {invites?.length === 0 && contract?.status === 'created' && <ContractEmptySigner />}
        </Box>
    );
};

export default ContractSignerSection;
