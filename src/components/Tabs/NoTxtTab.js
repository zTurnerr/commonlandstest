import { Box, HStack, useTheme } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export const useNoTxtTab = () => {
    const [index, setIndex] = useState(0);
    const onChangeIndex = (index) => {
        setIndex(index);
    };

    const Component = () => {
        return <NoTxtTab index={index} onChangeIndex={onChangeIndex} />;
    };

    return { Component, index, onChangeIndex };
};

const NoTxtTab = ({ onChangeIndex = () => {}, index = 0 }) => {
    const theme = useTheme();

    return (
        <HStack justifyContent={'space-between'} bg="white" space={1}>
            <TouchableOpacity
                activeOpacity={1}
                style={styles.headerItem}
                onPress={() => onChangeIndex(0)}
            >
                <Box
                    w={'100%'}
                    h={'2px'}
                    backgroundColor={index >= 0 ? theme.colors.appColors.primary : 'transparent'}
                />
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={1}
                style={styles.headerItem}
                onPress={() => onChangeIndex(1)}
            >
                <Box
                    w={'100%'}
                    h={'2px'}
                    backgroundColor={index >= 1 ? theme.colors.appColors.primary : 'gray.400'}
                />
            </TouchableOpacity>
        </HStack>
    );
};

const styles = StyleSheet.create({
    headerItem: {
        justifyContent: 'center',
        width: '50%',
        alignItems: 'center',
    },
});

export default NoTxtTab;
