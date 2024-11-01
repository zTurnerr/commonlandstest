import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import useTranslate from '../../i18n/useTranslate';
import { Box, ScrollView, Spinner, Text, useDisclose, useTheme } from 'native-base';
import Empty from '../../components/Icons/Empty';
import RecommendItem from './RecommendItem';
import BottomPrimaryButton from './BottomPrimaryButton';
import { InfoCircleOutlineIcon, NotificationSquareIcon } from '../../components/Icons';
import { TouchableOpacity } from 'react-native';
import ModalRecommendInfo from './ModalRecommendInfo';
import { useNavigation } from '@react-navigation/native';
import { getRecommendation } from '../../rest_client/apiClient';

const Index = ({ route }) => {
    const { onRefresh } = route?.params || {};
    const t = useTranslate();
    const [list, setList] = useState([]);
    const { isOpen: isLoading, onClose: onStopLoading, onOpen: onStartLoading } = useDisclose();
    const { colors } = useTheme();
    const {
        isOpen: isOpenRecommendInfo,
        onClose: onCloseRecommendInfo,
        onOpen: onOpenRecommendInfo,
    } = useDisclose();
    const [error, setError] = useState(null);

    const fetchRecommend = async () => {
        onStartLoading();
        try {
            const { data } = await getRecommendation();
            setList(data?.data);
        } catch (error) {
            setError(error);
        }
        onStopLoading();
    };

    const navigation = useNavigation();

    const onNavigateNewRecommend = () => {
        navigation.navigate('NewRecommendation', {
            listRecommend: list,
        });
    };

    useEffect(() => {
        fetchRecommend();
    }, []);

    const isDisabled = useMemo(() => list?.length >= 10, [list]);

    useEffect(() => {
        if (onRefresh) {
            fetchRecommend();
            navigation.setParams({ onRefresh: null });
        }
    }, [onRefresh]);

    return (
        <>
            <Header title={t('askRecommendation.creditRecommendations')} shadow={'none'} border>
                <Box pr={'10px'}>
                    <TouchableOpacity onPress={onOpenRecommendInfo}>
                        <InfoCircleOutlineIcon color={colors.primary[600]} />
                    </TouchableOpacity>
                </Box>
            </Header>
            <Box flex={1}>
                <ScrollView flex={1}>
                    {isLoading && (
                        <Box mt={'30px'} justifyContent={'center'} alignItems={'center'}>
                            <Spinner size={'lg'} />
                        </Box>
                    )}
                    {!isLoading && list?.length === 0 && (
                        <Box mt={'130px'} justifyContent={'center'} alignItems={'center'}>
                            <Empty />
                            <Text mt={'20px'} fontWeight={600} fontSize={14} textAlign={'center'}>
                                {t('error.noRecommendYet')}
                            </Text>
                        </Box>
                    )}

                    {!isLoading && (
                        <Box mt={'6px'}>
                            {list?.map((item, index) => (
                                <RecommendItem
                                    item={item?.voter}
                                    key={index}
                                    haveRecommend
                                    type={item.score}
                                ></RecommendItem>
                            ))}
                        </Box>
                    )}
                </ScrollView>
            </Box>
            <BottomPrimaryButton
                Icon={<NotificationSquareIcon color={'white'} />}
                title={t('askRecommendation.newRecommendation')}
                onPress={onNavigateNewRecommend}
                isDisabled={isDisabled || isLoading}
                error={error}
            />
            <ModalRecommendInfo isVisible={isOpenRecommendInfo} onClose={onCloseRecommendInfo} />
        </>
    );
};

export default Index;
