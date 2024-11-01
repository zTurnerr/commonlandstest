import moment from 'moment';
import { Box, Icon, Image, Text } from 'native-base';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useTranslate from '../../../i18n/useTranslate';

const RowAgent = ({ data }) => {
    const { trainer, createdAt } = data;
    const t = useTranslate();
    return (
        <Box bgColor={'white'} px={'15px'} mt={'6px'}>
            <Text textAlign={'right'} color={'appColors.textGrey'} mt={'5px'}>
                {t('agentAssist.linkedAtDate', {
                    date: moment(createdAt).format('MMM DD, YYYY'),
                })}
            </Text>

            <Box flexDirection="row" alignItems="center" mb="18px">
                <Box>
                    {trainer.avatar ? (
                        <Image
                            source={{ uri: trainer.avatar }}
                            alt="avatar"
                            w="42px"
                            h="42px"
                            borderRadius="21px"
                        />
                    ) : (
                        <Icon size={10} as={<MaterialCommunityIcons name="account-circle" />} />
                    )}
                    <Box bgColor={'primary.1700'} mx={'5px'} borderRadius={'5px'} mt={'-7px'}>
                        <Text
                            color={'primary.1600'}
                            px={'6px'}
                            py={'4px'}
                            fontWeight={500}
                            fontSize={'8px'}
                        >
                            {t('agentAssist.agent')}
                        </Text>
                    </Box>
                </Box>
                <Box ml="10px" flex={1}>
                    <Box alignItems="flex-start">
                        <Text fontSize="14px" fontWeight="bold">
                            {trainer.fullName}
                        </Text>
                        <Text fontSize="11px" color={'appColors.textGrey'} fontWeight="400">
                            {trainer.phoneNumber}
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default RowAgent;
