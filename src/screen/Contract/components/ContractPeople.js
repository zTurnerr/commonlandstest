import { Box, Image, Text, useTheme } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Images } from '../../../themes';

const ContractPeople = ({ item, onPress, onRemove }) => {
    const { fullName, phoneNumber } = item?.user || {};
    let hasLandCertificate = item?.signedAt;
    const theme = useTheme();

    const styles = StyleSheet.create({
        icRemove: {
            marginRight: 5,
        },
        image: {
            width: 12,
            height: 12,
            tintColor: theme.colors.appColors.primary,
            marginLeft: 6,
            marginBottom: 2,
        },
        wrapper: {
            width: '100%',
        },
    });

    return (
        <TouchableOpacity style={styles.wrapper} disabled={false} onPress={() => onPress?.(item)}>
            {fullName && (
                <Box
                    backgroundColor={'gray.100'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    alignSelf={'center'}
                    borderRadius={'32px'}
                    w={'100%'}
                    mb={'10px'}
                    px={'4px'}
                    py={'3px'}
                >
                    <Box w="30px" h="30px" borderRadius={'100px'}>
                        <Image
                            source={{ uri: item?.user?.avatar }}
                            w="full"
                            h="full"
                            resizeMode="cover"
                            alt="image base"
                            zIndex={1}
                            borderRadius={'100px'}
                        />
                    </Box>
                    <Box ml={'8px'} flex={1}>
                        <Box flexDir={'row'} alignItems={'flex-end'}>
                            <Text
                                maxWidth={'100%'}
                                numberOfLines={10}
                                fontSize={'12px'}
                                fontWeight={'600'}
                            >
                                {fullName + ' '}
                                {hasLandCertificate && (
                                    <Image style={styles.image} source={Images.icSuccess} />
                                )}
                            </Text>
                        </Box>
                        <Text
                            color={theme.colors.appColors.textGrey}
                            fontSize={'10px'}
                            fontWeight={'400'}
                        >
                            {phoneNumber}
                        </Text>
                    </Box>

                    {onRemove && !item?.signedAt && (
                        <TouchableOpacity style={styles.icRemove} onPress={() => onRemove(item)}>
                            <Image alt="android" source={Images.icDeletePeople} />
                        </TouchableOpacity>
                    )}
                </Box>
            )}
        </TouchableOpacity>
    );
};

export default ContractPeople;
