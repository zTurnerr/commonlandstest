import { useNavigation } from '@react-navigation/native';
import { Box, Center, HStack, Image, Text } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import useTranslate from '../../i18n/useTranslate';
import TwoImage from '../Icons/TwoImage';

const ContractImageSection = ({ contract }) => {
    const navigation = useNavigation();

    const gotoContractPhotos = (index) => {
        navigation.navigate('ContractPhotos', {
            contract,
            index,
        });
    };

    const t = useTranslate();
    return (
        <Box>
            <HStack mb="5px" space={3} alignItems={'center'}>
                <Text color="gray.800" fontWeight={500}>
                    {t('contract.photoOfTheContracts')}
                </Text>
                {/* <Center bg="gray.1700" px="8px" borderRadius={'5px'}>
                    <Text fontSize={'12px'} fontWeight={600}>
                        3
                    </Text>
                </Center> */}
            </HStack>
            <HStack space={3}>
                <Box borderRadius={'8px'} flex={1} h="82px" bg="gray.300">
                    <TouchableOpacity
                        onPress={() => {
                            gotoContractPhotos(0);
                        }}
                    >
                        <Image
                            source={{ uri: contract?.images?.[0] }}
                            w="full"
                            h="full"
                            resizeMode="cover"
                            borderRadius={'8px'}
                            alt="image base"
                        />
                    </TouchableOpacity>
                </Box>
                {contract?.images?.[1] ? (
                    <Box borderRadius={'8px'} flex={1} h="82px" bg="gray.300">
                        <TouchableOpacity
                            onPress={() => {
                                gotoContractPhotos(1);
                            }}
                        >
                            <Image
                                source={{ uri: contract?.images[1] }}
                                w="full"
                                h="full"
                                resizeMode="cover"
                                borderRadius={'8px'}
                                alt="image base"
                            />
                        </TouchableOpacity>
                    </Box>
                ) : (
                    <Box flex={1}></Box>
                )}
                {contract?.images?.[2] ? (
                    <TouchableOpacity
                        onPress={() => {
                            gotoContractPhotos(2);
                        }}
                        style={styles.imageWrapper}
                    >
                        <Center borderRadius={'8px'} flex={1} h="82px" bg="gray.300">
                            <Box
                                position={'absolute'}
                                top={0}
                                left={0}
                                w="full"
                                h="full"
                                bg="black"
                                borderRadius={'8px'}
                                zIndex={1}
                                opacity={0.5}
                            ></Box>
                            <Center zIndex={2} position={'absolute'} w="full" h="full">
                                <Center bg="white" borderRadius={'32px'} w="24px" h="24px">
                                    <TwoImage />
                                </Center>
                                <Text color="white">
                                    {`+${contract?.images?.length - 2}` +
                                        ' ' +
                                        `${t('components.photos')}`}
                                </Text>
                            </Center>
                            <Image
                                source={{ uri: contract?.images[2] }}
                                w="full"
                                h="full"
                                resizeMode="cover"
                                borderRadius={'8px'}
                                position={'absolute'}
                                top={0}
                                left={0}
                                alt="image base"
                            />
                        </Center>
                    </TouchableOpacity>
                ) : (
                    <Box flex={1}></Box>
                )}
            </HStack>
        </Box>
    );
};

export default ContractImageSection;

const styles = StyleSheet.create({
    imageWrapper: {
        flex: 1,
    },
});
