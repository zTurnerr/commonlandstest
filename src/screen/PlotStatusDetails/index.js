/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Box, Icon, ScrollView, Text } from 'native-base';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import PlotStatus from '../../components/PlotStatus';
import useWorthwhileNumber from '../../hooks/useWorthwhileNumber';
import useTranslate from '../../i18n/useTranslate';

export default function Index() {
    const t = useTranslate();
    const worthwhileNumber = useWorthwhileNumber();
    const DATA = [
        {
            status: 0,
            description: `${t('plotStatusDetail.description1')}`,
        },
        {
            status: 1,
            description: `${t('plotStatusDetail.description2', {
                numberClaimchain: worthwhileNumber,
            })}`,
        },
        {
            status: 2,
            description: `${t('plotStatusDetail.description3')}`,
        },
        {
            status: 3,
            description: `${t('plotStatusDetail.description4')}`,
        },
        {
            status: 4,
            description: `${t('plotStatusDetail.description5')}`,
        },
        {
            status: 5,
            description: `${t('plotStatusDetail.description6')}`,
        },

        {
            status: 7,
            description: `${t('plotStatusDetail.description7')}`,
        },
    ];
    return (
        <>
            <Header
                icon={<Icon as={<MaterialCommunityIcons name="close" />} size={6} color="black" />}
                title={t('plotStatusDetail.title')}
            />
            <ScrollView>
                {DATA.map((i) => {
                    return (
                        <Box
                            key={i.status}
                            flexDir="row"
                            borderBottomColor="divider"
                            borderBottomWidth="1px"
                        >
                            <Box
                                px="12px"
                                w="165px"
                                alignItems="flex-start"
                                justifyContent="center"
                            >
                                <PlotStatus status={i.status} />
                            </Box>
                            <Box p="12px" flex={1} borderLeftColor="divider" borderLeftWidth="1px">
                                <Text fontSize="12px" fontWeight="400">
                                    {i.description}
                                </Text>
                            </Box>
                        </Box>
                    );
                })}
            </ScrollView>
        </>
    );
}
