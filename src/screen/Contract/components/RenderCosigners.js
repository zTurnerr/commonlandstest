import { Box, Center, Image, Text } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import InfoCircle from '../../../components/Icons/InfoCircle';
import useTranslate from '../../../i18n/useTranslate';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import { Images } from '../../../themes';
import ContractPeople from './ContractPeople';

const RenderCosigners = ({
    onInviteCosigner,
    data,
    onRemove,
    onPress,
    contract,
    noRequireCosigner,
}) => {
    const t = useTranslate();
    // const keyExtractor = useCallback((item, index) => item?.user?.phoneNumber + '' + index, []);
    let { user } = useShallowEqualSelector((state) => ({
        user: state.user.userInfo,
    }));

    const canInvite = () => {
        if (contract.status == 'active' || contract.status == 'completed') {
            return false;
        }
        if (
            contract?.borrower?.signedAt &&
            user.phoneNumber == contract?.borrower?.user?.phoneNumber
        )
            return true;
        if (!contract?.borrower?.signedAt) return true;
        return false;
    };

    const renderItem = ({ item, index }) => {
        return (
            <Box alignSelf={'center'} key={item?.user?.phoneNumber + '' + index}>
                <ContractPeople
                    onPress={onPress}
                    key={item?.user?.phoneNumber + '' + index}
                    item={item}
                    onRemove={onRemove}
                    statusContract={contract?.status}
                />
            </Box>
        );
    };

    const renderEmptyData = () => {
        return (
            <Box alignItems={'center'} key={'empty'}>
                {noRequireCosigner ? (
                    <Center>
                        <InfoCircle />
                        <Text mt="5px" fontSize={'12px'} fontWeight={500}>
                            {t('contract.noRequireCosigner')}
                        </Text>
                    </Center>
                ) : (
                    <>
                        <Image
                            tintColor={'#8E8E8E'}
                            alt="icUserEditSmall"
                            source={Images.icUserEditSmall}
                        />
                        <Text mt={'5px'} color={'#8E8E8E'} fontSize={'12px'} fontWeight={'400'}>
                            {t('contract.noCosignerHere')}
                        </Text>
                    </>
                )}
            </Box>
        );
    };

    return (
        <Box flex={1} px="15px" bg="white" pb="30px">
            <Box mt={'30px'} flexDir={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Text fontSize={'12px'} fontWeight={'700'}>
                    {t('contract.requireCosigner')}
                </Text>
                {canInvite() && (
                    <TouchableOpacity style={styles.btnInvite} onPress={onInviteCosigner}>
                        <Image alt="icUserEditSmall" source={Images.icUserEditSmall} />
                        <Text ml={'7px'} color={'#267385'} fontSize={'12px'} fontWeight={'500'}>
                            {t('invite.title')}
                        </Text>
                    </TouchableOpacity>
                )}
            </Box>
            <Box mt={'20px'}>
                {!data?.length
                    ? renderEmptyData()
                    : data.map((item, index) => renderItem({ item, index }))}
            </Box>
        </Box>
    );
};

export default RenderCosigners;

const styles = StyleSheet.create({
    btnInvite: {
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(38, 115, 133, 1)',
        flexDirection: 'row',
        paddingHorizontal: 9,
        height: 24,
    },
});
