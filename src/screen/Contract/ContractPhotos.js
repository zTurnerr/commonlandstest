import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { ArrowBackIcon, ArrowForwardIcon, Box, Center, HStack, Text } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import HeaderPage from '../../components/HeaderPage';
import ImageWithLoading from '../../components/ImageWithLoading/ImageWithLoading';
import useTranslate from '../../i18n/useTranslate';

const ContractPhotos = ({ route, navigation }) => {
    const { contract, index } = route.params;
    const t = useTranslate();
    return (
        <Box h="full">
            <HeaderPage title={t('contract.photoOfTheContracts')} />
            <Center flex={1} bg="gray.1900" px="25px" justifyContent={'center'}>
                <Box w="full" h="full">
                    <ReactNativeZoomableView
                        style={styles.zoomableView}
                        maxZoom={4}
                        minZoom={1}
                        zoomStep={0.5}
                        initialZoom={1}
                    >
                        <Box w="full" h="full">
                            <ImageWithLoading
                                h="full"
                                uri={contract?.images[index]}
                                resizeMode="contain"
                            />
                        </Box>
                    </ReactNativeZoomableView>
                </Box>
            </Center>
            <HStack
                bg="white"
                py="40px"
                px="32px"
                alignItems={'center'}
                justifyContent={'space-between'}
            >
                <TouchableOpacity
                    disabled={index === 0}
                    onPress={() => {
                        if (index === 0) return;
                        navigation.setParams({
                            index: index - 1,
                        });
                    }}
                >
                    <Center
                        opacity={index === 0 ? 0.5 : 1}
                        w="30px"
                        h="30px"
                        borderRadius={'1000px'}
                        bg="black"
                    >
                        <ArrowBackIcon color="white" />
                    </Center>
                </TouchableOpacity>
                <Center bg="black" px="15px" h="35px" borderRadius={'32px'}>
                    <Text color="white">
                        {`${t('contract.page')} `}
                        {index + 1} {`${t('components.of')}`} {contract?.images?.length}
                    </Text>
                </Center>
                <TouchableOpacity
                    disabled={index === contract?.images.length - 1}
                    onPress={() => {
                        if (index === contract?.images.length - 1) return;
                        navigation.setParams({
                            index: index + 1,
                        });
                    }}
                >
                    <Center
                        opacity={index === contract?.images.length - 1 ? 0.5 : 1}
                        w="30px"
                        h="30px"
                        borderRadius={'1000px'}
                        bg="black"
                    >
                        <ArrowForwardIcon color="white" />
                    </Center>
                </TouchableOpacity>
            </HStack>
        </Box>
    );
};

export default ContractPhotos;

const styles = StyleSheet.create({
    zoomableView: {
        width: '100%',
        backgroundColor: 'black',
    },
});
