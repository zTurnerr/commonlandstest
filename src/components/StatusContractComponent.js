import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Box, HStack, Text } from 'native-base';
import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import useTranslate from '../i18n/useTranslate';
import { extractContractStatus, showStatusTag } from '../util/contract/showContractStatusTag';
import UpDownCircle from './Icons/UpDownCircle';

const StatusContractComponent = ({ item }) => {
    const t = useTranslate();
    const navigate = useNavigation();

    return (
        <Box flex={1} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
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
        </Box>
    );
};

export default memo(StatusContractComponent);
