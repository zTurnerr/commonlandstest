import { Badge, Box, Text, useTheme } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import useTranslate from '../../i18n/useTranslate';

export const useContractListTab = () => {
    const [index, setIndex] = useState(0);
    const onChangeIndex = (index) => {
        setIndex(index);
    };

    const Component = ({ pendingCount = 0 }) => {
        return (
            <ContractListTab
                index={index}
                onChangeIndex={onChangeIndex}
                pendingCount={pendingCount}
            />
        );
    };

    return { Component, index };
};

const ContractListTab = ({ onChangeIndex = () => {}, index = 0, pendingCount = 0 }) => {
    const t = useTranslate();
    const theme = useTheme();

    return (
        <Box flexDir={'row'} alignItems={'center'} justifyContent={'space-between'} bg="white">
            <TouchableOpacity
                activeOpacity={1}
                style={styles.headerItem}
                onPress={() => onChangeIndex(0)}
            >
                <Box
                    bg={index === 0 ? theme.colors.appColors.bgPrimary : 'transparent'}
                    w="full"
                    py="10px"
                >
                    <Text
                        fontSize={'12px'}
                        fontWeight={'600'}
                        color={index === 0 ? 'primary.600' : 'black'}
                        textAlign={'center'}
                    >{`${t('invite.created')}`}</Text>
                </Box>
                <Box
                    mt="auto"
                    w={'100%'}
                    h={'2px'}
                    backgroundColor={index === 0 ? theme.colors.appColors.primary : 'transparent'}
                />
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={1}
                style={styles.headerItem}
                onPress={() => onChangeIndex(1)}
            >
                <Box
                    bg={index === 1 ? theme.colors.appColors.bgPrimary : 'transparent'}
                    w="full"
                    py="10px"
                    flexDir={'row'}
                    display={'flex'}
                >
                    <Box flex={1}></Box>
                    <Box>
                        <Text
                            fontSize={'12px'}
                            fontWeight={'600'}
                            color={index === 1 ? 'primary.600' : 'black'}
                            textAlign={'center'}
                        >
                            {`${t('contract.signatory')}`}
                        </Text>
                    </Box>
                    <Badge
                        alignSelf="center"
                        borderRadius={'8px'}
                        ml="4px"
                        bg="primary.500"
                        size="xs"
                    >
                        <Text color="white" fontSize={'10px'}>
                            {pendingCount}
                        </Text>
                    </Badge>
                    <Box flex={1}></Box>
                </Box>
                <Box
                    mt="auto"
                    w={'100%'}
                    h={'2px'}
                    backgroundColor={index === 1 ? theme.colors.appColors.primary : 'transparent'}
                />
            </TouchableOpacity>
        </Box>
    );
};

const styles = StyleSheet.create({
    headerItem: {
        justifyContent: 'center',
        width: '50%',
        alignItems: 'center',
    },
});

export default ContractListTab;
