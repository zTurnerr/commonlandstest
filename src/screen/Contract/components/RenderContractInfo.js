import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Box, HStack, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import ContractInfo from '../../../components/ContractInfo';
import UpDownCircle from '../../../components/Icons/UpDownCircle';
import UserItem1 from '../../../components/UserItem/UserItem1';
import useTranslate from '../../../i18n/useTranslate';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import { extractContractStatus, showStatusTag } from '../../../util/contract/showContractStatusTag';

const RenderContractInfo = ({ item }) => {
    const t = useTranslate();
    const navigate = useNavigation();
    useShallowEqualSelector((state) => ({
        user: state.user.userInfo,
    }));
    return (
        <Box mt={'5px'} bg="white" p="15px">
            <HStack w="100%" justifyContent={'space-between'} alignItems={'center'}>
                {showStatusTag(extractContractStatus(item))}
                <TouchableOpacity
                    onPress={() => {
                        navigate.navigate('ContractHistory', {
                            contract: item,
                        });
                    }}
                >
                    <HStack space={1} alignItems={'center'}>
                        <Text fontWeight={500} fontSize={'11px'} color="gray.700">
                            {`${t('button.create')}d at ${
                                moment(item?.createdAt).format('MMM DD, YYYY') || 'N/A'
                            }`}
                        </Text>
                        <UpDownCircle />
                    </HStack>
                </TouchableOpacity>
            </HStack>
            <Text mt="17px" color="gray.800">
                {t('contract.contractCreator')}
            </Text>
            <Box flexDir={'row'} alignItems={'flex-start'} mt={'20px'}>
                <UserItem1 user={item?.creator} />
            </Box>
            <ContractInfo
                showDivider={true}
                showImgSection={true}
                showCreatedAt={false}
                item={item}
            />
        </Box>
    );
};

export default RenderContractInfo;
