import React from 'react';
import { Box, Text, ScrollView, HStack, CloseIcon } from 'native-base';
import HeaderPage from '../../components/HeaderPage';
import useTranslate from '../../i18n/useTranslate';

const PX = '20px';

const ClaimrankSystem = () => {
    const t = useTranslate();
    const claimRanks = ['na', 'veryPoor', 'poor', 'okay', 'good', 'veryGood'];
    return (
        <Box h={'100%'} w={'100%'}>
            <HeaderPage title={t('rating.claimRankSystem')} backIcon={<CloseIcon />} />
            <ScrollView>
                <Box>
                    <HStack p={PX} bg="#334043">
                        <Text color="white" fontWeight={600} flex={4}>
                            {t('rating.claimRank')}
                        </Text>
                        <Text color="white" fontWeight={600} flex={6}>
                            {t('plot.description')}
                        </Text>
                    </HStack>
                    {claimRanks.map((rank) => {
                        return (
                            <Box flex={1} key={rank}>
                                <HStack bg={'white'} mb="1px" alignItems={'center'} p={PX}>
                                    <Text fontWeight={700} flex={4}>
                                        {t('trustscore.' + rank)}
                                    </Text>
                                    <Text flex={6}>{t('trustscore.desc.' + rank)}</Text>
                                </HStack>
                            </Box>
                        );
                    })}
                </Box>
            </ScrollView>
        </Box>
    );
};

export default ClaimrankSystem;
