import { Box, HStack, Radio, Text } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Role } from '../CreatePlot/InvitePeople/UserRow';

export default function CertOption({ index, onPress, data }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.wrapper}>
            <HStack
                alignItems={'center'}
                h="54px"
                space={2}
                px="20px"
                borderTopWidth={index === 0 ? 0 : '1px'}
                borderTopColor={'border.1'}
                py="15px"
            >
                <Box flex={1}>
                    <Radio aria-label="radio" value={index}>
                        <Text color={'primary.600'} fontSize={'14px'} fontWeight={600}>
                            {data.name}
                        </Text>
                    </Radio>
                </Box>
                <Role type={data.type} iconSize="4" />
            </HStack>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
});
