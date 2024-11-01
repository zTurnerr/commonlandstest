import useTranslate from '../../../i18n/useTranslate';
import { Box, Text } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const GroupButtonNotify = ({ onDecline, onAccept }) => {
    const t = useTranslate();
    return (
        <Box mt={'12px'} flexDir={'row'} alignItems={'center'}>
            <TouchableOpacity style={styles.btnDecline} onPress={onDecline}>
                <Text fontWeight={'500'} fontSize={'14px'} color={'rgba(10, 9, 11, 1)'}>
                    {t('button.decline')}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnAccept} onPress={onAccept}>
                <Text fontWeight={'500'} fontSize={'14px'} color={'white'}>
                    {t('button.accept')}
                </Text>
            </TouchableOpacity>
        </Box>
    );
};

export default GroupButtonNotify;

const styles = StyleSheet.create({
    btnDecline: {
        width: 68,
        height: 32,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E6E6E6',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    btnAccept: {
        width: 68,
        height: 32,
        borderRadius: 6,
        backgroundColor: '#5EC4AC',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
});
