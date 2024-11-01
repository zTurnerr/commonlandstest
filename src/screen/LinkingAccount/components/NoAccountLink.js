import { AddIcon, Center, Text } from 'native-base';
import React from 'react';
import Link from '../../../components/Icons/Link';
import { TouchableOpacity } from 'react-native';

const NoAccountLink = ({ navigation }) => {
    return (
        <Center flex={1}>
            <Center bg="primary.200" p="12px" borderRadius={'xl'}>
                <Link />
            </Center>
            <Text mt="10px" fontSize={'14px'} fontWeight={700}>
                No account linked yet
            </Text>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('AddAccountLink');
                }}
            >
                <Center
                    flexDirection={'row'}
                    bg="primary.600"
                    px="15px"
                    py="10px"
                    borderRadius={'24px'}
                    mt="24px"
                >
                    <AddIcon color="white" size="3.5" />
                    <Text ml="6px" color="white" fontSize={'12px'} fontWeight={700}>
                        Add account link
                    </Text>
                </Center>
            </TouchableOpacity>
        </Center>
    );
};

export default NoAccountLink;
