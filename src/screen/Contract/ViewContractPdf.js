import { useNavigation } from '@react-navigation/native';
import { Box, Flex, Text } from 'native-base';
import React, { useRef } from 'react';
import { Image, StyleSheet } from 'react-native';
import HeaderPage from '../../components/HeaderPage';
import PdfComponent from '../../components/Pdf';
import useTranslate from '../../i18n/useTranslate';
import { Images } from '../../themes';
import { getContractNameByDid } from '../../util/Tools';

const ViewContractPdf = ({ route }) => {
    const t = useTranslate();
    const navigate = useNavigation();
    const webviewRef = useRef();
    const { item } = route?.params || {};

    const goBack = () => {
        navigate.goBack();
    };

    const renderVerified = () => {
        return (
            <Box
                px={'6px'}
                py={'4px'}
                borderRadius={'20px'}
                backgroundColor={'#F2FAF6'}
                flexDir={'row'}
                alignItems={'center'}
            >
                <Image style={styles.image} source={Images.icSuccess} />
                <Text fontWeight={'500'} fontSize={'10px'} ml={'4px'} mr={'6px'}>
                    {t('components.verified')}
                </Text>
            </Box>
        );
    };

    return (
        <Flex backgroundColor={'#cbcbcb'} flex={1}>
            <HeaderPage
                onPress={goBack}
                title={`${t('components.contract')} ${getContractNameByDid(item?.did)}`}
                isRight={true}
            >
                {renderVerified()}
            </HeaderPage>
            <Box w={'full'} h={'8px'} backgroundColor={'#cbcbcb'} />
            <PdfComponent pdfRef={webviewRef} url={item.link} height="100%" />
        </Flex>
    );
};

export default ViewContractPdf;

const styles = StyleSheet.create({
    image: {
        width: 16,
        height: 16,
        tintColor: 'rgba(71, 184, 129, 1)',
        marginLeft: 6,
    },
});
