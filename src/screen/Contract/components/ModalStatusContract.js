import { Box, Image, Text, useTheme } from 'native-base';
import React, { memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import useTranslate from '../../../i18n/useTranslate';
import Images from '../../../themes/Images';

const ModalStatusContract = ({ selectedItems, isVisible, onClose, onClear, onSelectItem }) => {
    const theme = useTheme();
    const t = useTranslate();

    const STATUS_CONTRACT = [
        {
            id: 1,
            label: t('contract.pendingContract'),
            bg: theme.colors.yellow[700],
            textColor: 'white',
            isSelected: false,
            dotColor: 'white',
        },
        {
            id: 2,
            label: t('contract.activeContract'),
            bg: theme?.colors?.appColors?.primaryBlue,
            textColor: 'white',
            isSelected: false,
            dotColor: 'white',
        },
        {
            id: 3,
            label: t('contract.unlockedContract'),
            bg: theme.colors.primary[600],
            textColor: 'white',
            isSelected: false,
            dotColor: 'white',
        },
    ];

    const onClearSelection = () => {
        onClear?.();
    };

    const ItemStatusContract = useCallback(
        ({ item, index }) => {
            const isActive = selectedItems.includes(item?.label);
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.btnStatusContract}
                    onPress={() => onSelectItem({ item, index })}
                >
                    {!isActive ? (
                        <Image alt="android" w={14} h={14} source={Images.icCheckbox} />
                    ) : (
                        <Box
                            w={14}
                            h={14}
                            borderRadius={2}
                            backgroundColor={theme.colors.appColors.primary}
                            justifyContent={'center'}
                            alignItems={'center'}
                        >
                            <Image alt="android" w={18} h={18} source={Images.icChecked} />
                        </Box>
                    )}
                    <Box
                        borderRadius={17}
                        backgroundColor={item?.bg}
                        flexDirection={'row'}
                        alignItems={'center'}
                        px={'5px'}
                        py={'5px'}
                        ml={'10px'}
                    >
                        <Box
                            mx={'5px'}
                            w={'10px'}
                            h={'10px'}
                            borderRadius={'6px'}
                            backgroundColor={item?.dotColor}
                        />
                        <Text
                            mr={'10px'}
                            color={item?.textColor}
                            fontWeight={'500'}
                            fontSize={'14px'}
                        >
                            {item?.label}
                        </Text>
                    </Box>
                </TouchableOpacity>
            );
        },
        [selectedItems, onSelectItem, theme.colors.appColors.primary],
    );

    return (
        <Modal style={styles.modal} isVisible={isVisible} onBackdropPress={onClose}>
            <Box
                pt={'10px'}
                backgroundColor={theme.colors.appColors.white}
                borderRadius={16}
                shadow={1}
            >
                <Box
                    pl={'16px'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <Text fontWeight={'600'} fontSize={'16px'}>
                        {t('contract.contractStatus')}
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Image alt="android" marginRight={'10px'} source={Images.icClose} />
                    </TouchableOpacity>
                </Box>
                <Box pl={'16px'} my={'10px'}>
                    {STATUS_CONTRACT?.map((item, index) => (
                        <ItemStatusContract key={index} item={item} index={index} />
                    ))}
                </Box>
                <Box w={'full'} h={'1px'} backgroundColor={theme.colors.appColors.divider} />
                <TouchableOpacity onPress={onClearSelection}>
                    <Text
                        fontSize={'14px'}
                        fontWeight={'500'}
                        color={theme.colors.appColors.primary}
                        py={'16px'}
                        pl={'16px'}
                    >
                        {t('contract.clearSelection')}
                    </Text>
                </TouchableOpacity>
            </Box>
        </Modal>
    );
};

export default memo(ModalStatusContract);

const styles = StyleSheet.create({
    // btnTypeContract: {
    //     height: 40,
    //     borderRadius: 32,
    //     width: '96%',
    //     justifyContent: 'center',
    //     paddingLeft: 16,
    // },
    modal: {
        justifyContent: 'flex-end',
        margin: 16,
    },
    btnStatusContract: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
});
