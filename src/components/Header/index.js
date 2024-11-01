import { useNavigation } from '@react-navigation/core';
import { Box, Text } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import AccountButton from '../AccountButton';
import { BackArrow } from '../Icons';
import AgentHeader from './AgentHeader';

export default function Index({
    onBack,
    title,
    children,
    icon: Icon,
    style = {},
    border = false,
    borderColor = 'gray.300',
    showAccountBtn = false,
    hideAgent = false,
    shadow = 1,
}) {
    const navigation = useNavigation();
    let borderStyle = {};
    if (border) {
        borderStyle = {
            borderBottomColor: borderColor,
            borderBottomWidth: '1px',
        };
    }

    return (
        <>
            {!hideAgent && <AgentHeader />}
            <Box
                flexDirection="row"
                py="12px"
                px="4px"
                alignItems="center"
                bg="white"
                shadow={shadow}
                zIndex={10}
                {...borderStyle}
                {...styles.container}
                {...style}
            >
                {showAccountBtn && (
                    <AccountButton mx="10px" position="static" top="0px" left="0px" />
                )}
                {!showAccountBtn && (
                    <TouchableOpacity
                        onPress={() => {
                            try {
                                if (onBack) {
                                    onBack();
                                    return;
                                }
                                if (navigation.canGoBack()) {
                                    navigation.goBack();
                                }
                            } catch (err) {
                                console.log('log error');
                            }
                        }}
                        style={styles.accountButton}
                    >
                        {Icon ? Icon : <BackArrow />}
                    </TouchableOpacity>
                )}
                <Text {...styles.text} fontSize="16px" fontWeight="500" flex={1}>
                    {title}
                </Text>
                {children}
            </Box>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        py: '12px',
        px: '4px',
        bg: 'white',
    },
    text: {
        fontSize: '14px',
        fontWeight: '500',
        flex: 1,
    },
    accountButton: {
        marginRight: 12,
        paddingHorizontal: 12,
    },
});
