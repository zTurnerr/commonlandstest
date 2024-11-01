import { Box, Center, HStack, Text } from 'native-base';
import Modal from 'react-native-modal';
import React, { useState } from 'react';
import { Linking, TouchableOpacity } from 'react-native';
import Warning2 from '../../../components/Icons/Warning2';
import Button from '../../../components/Button';
import MomoLogo from '../../../components/Icons/MomoLogo';

const LinkAccountDetail = () => {
    const [openModal, setOpenModal] = useState(false);

    const handleClick = () => {
        try {
            Linking.openURL('https://momo.mtn.com/home-page');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box>
            <TouchableOpacity
                onPress={() => {
                    setOpenModal(true);
                }}
            >
                <Warning2 />
            </TouchableOpacity>

            <Modal isVisible={openModal} safeAreaTop={true}>
                <Box p="20px" borderRadius="8px" bgColor="white">
                    <Text mb="8px" color="black" fontWeight="700" fontSize="16px">
                        Linking Account Detail
                    </Text>
                    <Center py="32px">
                        <MomoLogo width="84" height="84" />
                    </Center>
                    <HStack space={2}>
                        <Box bg="black" borderRadius={1000} w="4px" h="4px" mt="10px"></Box>
                        <Text lineHeight={'22px'} flex={1}>
                            Linked account: is your MoMo account (from MTN){' '}
                            <Text
                                fontSize={'14px'}
                                fontWeight={600}
                                textDecorationLine={'underline'}
                                color={'primary.600'}
                                onPress={handleClick}
                            >
                                See more
                            </Text>
                        </Text>
                    </HStack>
                    <HStack space={2}>
                        <Box bg="black" borderRadius={1000} w="4px" h="4px" mt="10px"></Box>
                        <Text lineHeight={'22px'} flex={1}>
                            Commonlands only links to your account to support collecting contract
                            activation fees (for Contract Creator) and creating invoices for payment
                            requests related to Contract features.
                        </Text>
                    </HStack>
                    <HStack space={2}>
                        <Box bg="black" borderRadius={1000} w="4px" h="4px" mt="10px"></Box>
                        <Text lineHeight={'22px'} flex={1}>
                            Commonlands will not ask you to deposit money and will not use your
                            account for trading.
                        </Text>
                    </HStack>
                    <Button
                        onPress={() => {
                            setOpenModal(false);
                        }}
                        variant="outline"
                        mt="23px"
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default LinkAccountDetail;
