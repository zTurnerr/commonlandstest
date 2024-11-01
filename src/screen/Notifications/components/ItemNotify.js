import { Box, Flex, Image, Text, useTheme } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Images } from '../../../themes';
import { TYPE_NOTIFY } from '../../../util/Constants';
import GroupButtonNotify from './ GroupButtonNotify';

const ItemNotify = ({ item, onPress, onDecline, onAccept }) => {
    const { colors } = useTheme();

    const renderIconNotify = () => {
        const type = item?.type || '';
        switch (type) {
            case TYPE_NOTIFY.NEIGHBOR:
                return Images.icUserAdd;
            case TYPE_NOTIFY.CO_SIGNER:
                return Images.icReceiptEdit;
            case TYPE_NOTIFY.DECLINE:
                return Images.icReceiptEdit;
            default:
                return Images.icReceiptEdit;
        }
    };

    return (
        <TouchableOpacity activeOpacity={1} onPress={onPress}>
            <Flex px={'18px'} flex={1} flexDir={'row'} alignItems={'flex-start'}>
                <Box
                    w={'44px'}
                    h={'44px'}
                    borderRadius={'22px'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    backgroundColor={colors.primary[200]}
                >
                    <Image alt="iconNotify" source={renderIconNotify} />
                </Box>
                <Box ml={'16px'}>
                    <Text numberOfLines={2} maxW={'95%'} fontWeight={'500'} fontSize={'12px'}>
                        {item?.content}
                    </Text>
                    <Text mt={'4px'} fontWeight={'400'} fontSize={'12px'} color={'#6D7F88'}>
                        {item?.createdAt}
                    </Text>
                    {item?.type === TYPE_NOTIFY.CO_SIGNER && (
                        <GroupButtonNotify onDecline={() => onDecline(item)} onAccept={onAccept} />
                    )}
                </Box>
            </Flex>
        </TouchableOpacity>
    );
};

export default ItemNotify;
