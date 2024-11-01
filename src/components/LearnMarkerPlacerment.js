import useTranslate from '../i18n/useTranslate';
import { Actionsheet, Box, Flex, Icon, Text, useTheme } from 'native-base';

import Button from './Button';
import { CreatePlot } from './Icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useDisclose } from 'native-base';

export default function Index() {
    const { isOpen: isLearnOpen, onOpen: onOpenLearn, onClose: onCloseLearn } = useDisclose();
    const { colors } = useTheme();
    const t = useTranslate();
    return (
        <>
            <TouchableOpacity onPress={onOpenLearn}>
                <Box {...styles.containerButton}>
                    <Icon
                        as={<MaterialCommunityIcons name="information-outline" />}
                        {...styles.iconInfo}
                    />
                    <Text {...styles.textLearn}>{t('plot.learnAboutMarker')}</Text>
                </Box>
            </TouchableOpacity>
            <Actionsheet isOpen={isLearnOpen} onClose={onCloseLearn}>
                <Actionsheet.Content>
                    <Flex {...styles.containerSheet}>
                        <Box {...styles.containerIconCreate}>
                            <CreatePlot color={colors.primary[600]} />
                        </Box>
                        <Text {...styles.textLearn2}>{t('plot.learnAboutMarker')}</Text>
                        <Text mb="24px">{t('plot.contentLearnAboutMarker')}</Text>
                        <Button onPress={onCloseLearn}>{t('plot.gotIt')}</Button>
                    </Flex>
                </Actionsheet.Content>
            </Actionsheet>
        </>
    );
}

const styles = {
    containerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '12px',
    },
    iconInfo: {
        size: 6,
        color: 'link',
        mr: '4px',
    },
    textLearn: {
        fontSize: '12px',
        fontWeight: '500',
        color: 'link',
    },
    containerSheet: {
        w: 'full',
        p: '12px',
    },
    containerIconCreate: {
        w: '40px',
        h: '40px',
        borderRadius: '12px',
        bg: 'primary.100',
        alignItems: 'center',
        justifyContent: 'center',
        mb: '18px',
    },
    textLearn2: {
        fontSize: '16px',
        fontWeight: 'bold',
        mb: '10px',
    },
};
