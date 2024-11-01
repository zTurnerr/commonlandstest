import {
    ArrowBackIcon,
    ArrowForwardIcon,
    Box,
    Button,
    Center,
    CheckCircleIcon,
    HStack,
    Image,
    Text,
    VStack,
} from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import HeaderPage from '../../components/HeaderPage';
import CancelRight from '../../components/Icons/CancelRight';
import CheckCircle from '../../components/Icons/CheckCircle';
import DoubleCheckCircle from '../../components/Icons/DoubleCheckCircle';
import Trash from '../../components/Icons/Trash';
import { EVENT_NAME } from '../../constants/eventName';
import useTranslate from '../../i18n/useTranslate';

const ContractUploadPhoto = ({ navigation, route }) => {
    const { imgList, setImgList } = route.params;
    const [currentIndex, setCurrentIndex] = useState(0);
    const isSelect = imgList[currentIndex]?.isSelect;

    const onSelectAll = () => {
        const newImgList = [...imgList];
        newImgList.forEach((item) => {
            item.isSelect = true;
        });
        setImgList(newImgList);
        navigation.setParams({
            imgList: newImgList,
        });
    };

    const onSelect = () => {
        if (isSelect) {
            const newImgList = [...imgList];
            newImgList[currentIndex].isSelect = false;
            setImgList(newImgList);
            navigation.setParams({
                imgList: newImgList,
            });
            return;
        }
        const newImgList = [...imgList];
        newImgList[currentIndex].isSelect = true;
        setImgList(newImgList);
        navigation.setParams({
            imgList: newImgList,
        });
    };

    const onDelete = () => {
        let newImgList = [...imgList];
        newImgList.splice(currentIndex, 1);
        setImgList(newImgList);
        navigation.setParams({
            imgList: newImgList,
        });
        if (currentIndex === newImgList.length) {
            setCurrentIndex(currentIndex - 1);
        }
        if (newImgList.length === 0) {
            navigation.goBack();
        }
    };
    const t = useTranslate();
    return (
        <VStack h="full">
            <HeaderPage
                onPress={() => {
                    navigation.goBack();
                }}
                title={t('plot.uploadPhoto')}
                isRight={true}
            ></HeaderPage>
            <VStack py="40px" flex={1} bg="gray.300" px="27px" justifyContent={'center'}>
                <Box
                    bg="white"
                    flex={1}
                    borderColor="primary.600"
                    borderWidth={isSelect ? '1px' : '0px'}
                >
                    <Image
                        source={{ uri: imgList[currentIndex]?.uri }}
                        alt="image base"
                        resizeMode="cover"
                        h="full"
                        w="full"
                    />
                    {isSelect && (
                        <Box
                            position={'absolute'}
                            top="-15px"
                            right="-15px"
                            bg={'white'}
                            borderRadius={'100px'}
                        >
                            <CheckCircleIcon color="#5EC4AC" size="xl" />
                        </Box>
                    )}
                </Box>
                <HStack mt="24px" alignItems={'center'} justifyContent={'space-between'}>
                    <TouchableOpacity
                        disabled={currentIndex === 0}
                        onPress={() => {
                            if (currentIndex === 0) return;
                            setCurrentIndex(currentIndex - 1);
                        }}
                    >
                        <Center
                            opacity={currentIndex === 0 ? 0.5 : 1}
                            w="30px"
                            h="30px"
                            borderRadius={'1000px'}
                            bg="black"
                        >
                            <ArrowBackIcon />
                        </Center>
                    </TouchableOpacity>
                    <Center bg="black" px="15px" h="35px" borderRadius={'32px'}>
                        <Text color="white">
                            {`${t('contract.page')}`} {currentIndex + 1} {`${t('components.of')}`}{' '}
                            {imgList.length}
                        </Text>
                    </Center>
                    <TouchableOpacity
                        disabled={currentIndex === imgList.length - 1}
                        onPress={() => {
                            if (currentIndex === imgList.length - 1) return;
                            setCurrentIndex(currentIndex + 1);
                        }}
                    >
                        <Center
                            opacity={currentIndex === imgList.length - 1 ? 0.5 : 1}
                            w="30px"
                            h="30px"
                            borderRadius={'1000px'}
                            bg="black"
                        >
                            <ArrowForwardIcon />
                        </Center>
                    </TouchableOpacity>
                </HStack>
            </VStack>
            <HStack py="15px" bg="black" justifyContent={'center'} space={5}>
                <TouchableOpacity
                    onPress={() => {
                        onSelectAll();
                    }}
                >
                    <Center>
                        <DoubleCheckCircle />
                        <Text color="white">{t('contract.selectAll')}</Text>
                    </Center>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        onSelect();
                    }}
                    style={styles.button}
                >
                    <Center>
                        {isSelect ? <CancelRight /> : <CheckCircle />}
                        <Text color="white">
                            {isSelect ? `${t('contract.unselect')}` : t('contract.select')}
                        </Text>
                    </Center>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        onDelete();
                    }}
                >
                    <Center>
                        <Trash color="white" />
                        <Text color="white">{t('button.delete')}</Text>
                    </Center>
                </TouchableOpacity>
            </HStack>
            <HStack bg="white" py="25px" space={5} px="20px">
                <Button
                    onPress={() => {
                        navigation.goBack();
                    }}
                    flex={1}
                    variant={'outline'}
                >
                    {t('contract.keepTaking')}
                </Button>
                <Button
                    flex={1}
                    onPress={() => {
                        EventRegister.emit(
                            EVENT_NAME.contractUploadPhoto1,
                            imgList.filter((item) => item.isSelect),
                        );
                        navigation.navigate('CreateContract');
                    }}
                >
                    {`${t('button.upload')} (${imgList.filter((item) => item.isSelect).length})`}
                </Button>
            </HStack>
        </VStack>
    );
};

export default ContractUploadPhoto;

const styles = StyleSheet.create({
    button: {
        minWidth: 50,
    },
});
