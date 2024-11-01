import useTranslate from '../../i18n/useTranslate';
import React from 'react';
import { Box, Text, HStack, CheckCircleIcon, Center } from 'native-base';
import Clock3 from '../Icons/Clock3';

const ReqClaimantAcceptedList = ({ req = {}, getClaimantById = () => {} }) => {
    const DividerRow = (
        <HStack>
            <Center w="16px" my="5px">
                <Box h="20px" w="1px" bg="black"></Box>
            </Center>
        </HStack>
    );
    const t = useTranslate();
    return (
        <Box pb="23px" mt="20px">
            {req.requests?.map((item, index) => {
                return (
                    <Box key={index}>
                        <HStack alignItems={'center'}>
                            {item?.isApproved ? (
                                <CheckCircleIcon color="#5EC4AC" width="16" height="16" />
                            ) : (
                                <Clock3 color={'#FABD3A'} width="16" height="16" />
                            )}
                            <Text ml="15px" fontWeight={600}>
                                <Text fontWeight={400}>
                                    {item?.isApproved
                                        ? t('plot.acceptedBy')
                                        : t('plot.pendingAcceptBy')}{' '}
                                    <Text fontWeight={600}>{item?.fullName}</Text>
                                </Text>
                            </Text>
                        </HStack>
                        {index < req?.requests?.length - 1 && DividerRow}
                    </Box>
                );
            })}
        </Box>
    );
};

export default ReqClaimantAcceptedList;
