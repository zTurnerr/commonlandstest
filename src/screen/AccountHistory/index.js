/* eslint-disable react-native/no-inline-styles */
import { Box, HStack, Image, ScrollView, Text, VStack, useTheme } from 'native-base';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { TickCircle } from '../../components/Icons';
import useTranslate from '../../i18n/useTranslate';
import { getCertHash, getUserProfileHistory } from '../../rest_client/apiClient';
import { useAccountHistoryTab } from '../../components/Tabs/AccountHistoryTab';
import RatingSection from './RatingSection';
import { showErr } from '../../util/showErr';
import LoadingPage from '../../components/LoadingPage';

function getHashFromQrString(qrString) {
    return qrString.split('/').pop();
}

const Index = ({
    route: {
        params: { qrString, claimantId },
    },
}) => {
    const theme = useTheme();
    const [data, setData] = useState(null);
    const [certData, setCertData] = useState(null);
    const tabHook = useAccountHistoryTab();

    const [loading, setLoading] = useState(false);
    const getCertData = async () => {
        setLoading(true);
        try {
            let { data } = await getCertHash(claimantId, null, null);
            setCertData(data);
        } catch (error) {
            showErr(error);
        }
        setLoading(false);
    };

    async function getData() {
        try {
            let { data } = await getUserProfileHistory({
                urlToken: getHashFromQrString(qrString),
            });

            setData(data);
        } catch (error) {}
    }

    useEffect(() => {
        getData();
        getCertData();
    }, []);

    const t = useTranslate();

    const HistorySection = (
        <Box mt="10px">
            {/* <Text my="20px" fontSize={'14px'} fontWeight={700}>
        {t('accountHistory.title')}
    </Text> */}
            <HStack p="8px" bg="white" borderRadius={'md'} mb="8px">
                <Box h="120px" w="120px" bg="backdrop.2" mr={'15px'} borderRadius={'md'}>
                    <Image
                        source={{
                            uri: data?.currentPof,
                        }}
                        alt="Alternate Text"
                        size="full"
                        borderRadius={'8px'}
                    />
                </Box>
                <VStack justifyContent={'center'}>
                    <Text fontSize={'12px'} fontWeight={400}>
                        {t('accountHistory.latestPhone')}
                    </Text>
                    <Text fontSize={'12px'} fontWeight={600}>
                        {data?.currentPhoneNo}
                    </Text>
                    <HStack
                        alignItems={'center'}
                        space={1}
                        bgColor={'primary.1100'}
                        p="5px"
                        borderRadius={'20px'}
                        mt="10px"
                        maxW={'70px'}
                    >
                        <TickCircle color={theme.colors.primary['1000']} />
                        <Text color={'primary.1000'} fontWeight={500} fontSize={'12px'}>
                            {t('components.active')}
                        </Text>
                    </HStack>
                </VStack>
            </HStack>
            {data?.oldPhoneNo && (
                <HStack p="8px" bg="white" borderRadius={'md'}>
                    <Box h="120px" w="120px" bg="backdrop.2" mr={'15px'} borderRadius={'md'}>
                        <Image
                            source={{
                                uri: data?.oldPof,
                            }}
                            alt="Alternate Text"
                            size="full"
                            borderRadius={'8px'}
                        />
                    </Box>
                    <VStack justifyContent={'center'}>
                        <Text fontSize={'12px'} fontWeight={400}>
                            {t('accountHistory.oldPhone')}
                        </Text>
                        <Text fontSize={'12px'} fontWeight={600}>
                            {data?.oldPhoneNo}
                        </Text>
                    </VStack>
                </HStack>
            )}
        </Box>
    );

    return (
        <Box h="full">
            {loading && <LoadingPage />}
            <Header
                style={{
                    zIndex: -1,
                }}
                title={t('accountHistory.title')}
                shadow={null}
            ></Header>
            <ScrollView pb="20px">
                {tabHook.Component({})}

                {tabHook.index === 0 && HistorySection}
                {tabHook.index === 1 && <RatingSection certData={certData} />}
            </ScrollView>
        </Box>
    );
};

export default Index;
