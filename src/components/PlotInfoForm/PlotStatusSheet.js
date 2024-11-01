import { useNavigation } from '@react-navigation/core';
import { Actionsheet, Box, Icon, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useTranslate from '../../i18n/useTranslate';
import Button from '../Button';
import PlotStatus from '../PlotStatus';

export default function Index({ isOpen, onClose, onInvitePress, status, worthwhileNumber }) {
    const t = useTranslate();
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
            status: 6,
            description: ``,
        },
        {
            status: 7,
            description: `${t('plotStatusDetail.description7')}`,
        },
    ];
    const navigation = useNavigation();
    if (!DATA[status]) {
        return null;
    }

    return (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content alignItems="flex-start" px="12px">
                <PlotStatus status={status} />
                <Text mt="12px">{DATA[status].description}</Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('PlotStatusDetails');
                    }}
                >
                    <Box flexDirection="row" mt="12px" mb="22px">
                        <Icon
                            as={<MaterialCommunityIcons name="information-outline" />}
                            size={6}
                            color="link"
                            mr="4px"
                        />
                        <Text fontSize="12px" fontWeight="500" color="link">
                            {t('components.learnAboutPlotStatus')}
                        </Text>
                    </Box>
                </TouchableOpacity>
                {onInvitePress && status !== 7 ? (
                    <Button onPress={onInvitePress} _container={{ mb: '12px' }}>
                        {t('components.invitePeople')}
                    </Button>
                ) : null}
            </Actionsheet.Content>
        </Actionsheet>
    );
}
