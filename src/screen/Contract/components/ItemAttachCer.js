import useTranslate from '../../../i18n/useTranslate';
import { Box, Text, useTheme } from 'native-base';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Images } from '../../../themes';
import { convertStringUpperCaseFirstLetter } from '../../../util/Tools';

const ItemAttachCer = ({ item, index, onSelect, plotSelected }) => {
    const theme = useTheme();
    const isActive = item?._id === plotSelected?._id;

    const t = useTranslate();
    return (
        <Box>
            {index > 0 && (
                <Box
                    alignSelf={'center'}
                    w={'92%'}
                    h={'1px'}
                    backgroundColor={theme.colors.appColors.divider}
                />
            )}
            <TouchableOpacity
                activeOpacity={1}
                style={styles.itemAttach}
                onPress={() => onSelect?.(item)}
            >
                <Image
                    style={styles.iconRadio}
                    source={isActive ? Images.icRadioSelected : Images.icRadio}
                />
                <Text
                    my="15px"
                    fontWeight={'600'}
                    fontSize={'16px'}
                    color={isActive ? 'primary.600' : 'black'}
                >
                    {`${t('bottomTab.plot')} ${item?.name}`}
                </Text>
                <Box
                    borderRadius={'20px'}
                    mr={'20px'}
                    ml={'auto'}
                    px={'6px'}
                    py={'4px'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    backgroundColor={theme.colors.appColors.primaryGreen}
                    flexDir={'row'}
                >
                    <Image
                        size={'16px'}
                        source={Images.icSecurityUser}
                        tintColor={theme.colors.white}
                        style={styles.iconUser}
                    />
                    <Text
                        mx={'3px'}
                        color={theme.colors.white}
                        fontWeight={'400'}
                        fontSize={'12px'}
                    >
                        {convertStringUpperCaseFirstLetter(item?.type)}
                    </Text>
                </Box>
            </TouchableOpacity>
        </Box>
    );
};

export default ItemAttachCer;

const styles = StyleSheet.create({
    itemAttach: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconUser: {
        width: 16,
        height: 16,
    },
    iconRadio: {
        width: 40,
        height: 40,
    },
});
