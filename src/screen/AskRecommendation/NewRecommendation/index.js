import React, { useCallback, useMemo, useRef, useState } from 'react';
import Header from '../../../components/Header';
import useTranslate from '../../../i18n/useTranslate';
import { Box, CloseIcon, HStack, ScrollView, Text, useDisclose } from 'native-base';
import BottomPrimaryButton from '../BottomPrimaryButton';
import { Keyboard, TouchableOpacity } from 'react-native';
import { debounce } from '../../../util/debounce';
import { createRecommendation, searchPeople } from '../../../rest_client/apiClient';
import CustomDebouncePhoneInput from '../../../components/Input/CustomDebouncePhoneInput';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import RecommendItem, { ButtonPay } from '../RecommendItem';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

const Index = ({ route }) => {
    const t = useTranslate();
    const { listRecommend } = route?.params || {};
    const [error, setError] = useState('');
    const [isShowResult, setIsShowResult] = useState(false);
    const user = useShallowEqualSelector((state) => state.user.userInfo);
    const [dataSearch, setDataSearch] = useState(null);
    const [listClaimant, setListClaimant] = useState([]);
    const length = dataSearch ? 1 : 0;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const refPhoneInput = useRef();

    const debouncedOnChangeText = useCallback(
        debounce(async (phoneNumber) => {
            setError('');
            let data = {
                phoneNumber,
            };
            try {
                if (!error) {
                    if (!phoneNumber) return;
                    if (phoneNumber == user.phoneNumber) {
                        setError(t('error.cannotRecommendYourSelf'));
                        return;
                    }
                    const response = await searchPeople(data);
                    if (response.data?.user) {
                        setIsShowResult(true);
                    } else {
                        setError(t('error.phoneInvalid'));
                        setIsShowResult(false);
                    }
                    setDataSearch(response?.data?.user);
                }
            } catch (_error) {
                setError(_error?.message || '');
            }
        }, 500),
        [],
    );

    const onChangeText = (phoneNumber) => {
        debouncedOnChangeText(phoneNumber);
    };

    const onSelectUser = (user) => {
        setError('');
        const userInListRecommend = listRecommend?.find((e) => e?.voter?._id === user?._id);
        if (userInListRecommend) {
            setError(t('error.claimantAlreadyRecommend'));
            return;
        }
        const userInList = listClaimant?.find((e) => e?._id === user?._id);
        if (userInList) {
            setError(t('error.claimantAlreadySelected'));
            return;
        }
        if (listRecommend?.length + listClaimant?.length >= 10) {
            setError(t('error.exceedNumberOfRecommend', { number: 10 }));
            return;
        }
        setListClaimant([...listClaimant, user]);
        setIsShowResult(false);
        setDataSearch(null);
        refPhoneInput?.current?.onClearInput();
        Keyboard.dismiss();
    };

    const isDisabled = useMemo(() => {
        if (listClaimant.length === 0) return true;
        let _after = listClaimant?.filter((e) => e?.type !== 0 && e?.type !== 1);
        if (_after.length > 0) return true;
        return false;
    }, [listClaimant]);

    const onRemove = (item) => {
        const newData = listClaimant?.filter((e) => e?._id !== item?._id);
        setListClaimant(newData);
    };

    const onClearAll = () => {
        setListClaimant([]);
    };

    const onPressRecommend = (user, type) => {
        const _list = listClaimant?.map((e) => {
            if (e?._id === user?._id) {
                return {
                    ...e,
                    type: type,
                };
            }
            return e;
        });
        setListClaimant(_list);
    };

    const { isOpen: isLoading, onOpen: onStartLoading, onClose: onStopLoading } = useDisclose();
    const [errorConfirm, setErrorConfirm] = useState('');
    const onPressConfirm = async () => {
        try {
            setErrorConfirm('');
            onStartLoading();
            let voters = [],
                scores = [];
            listClaimant.forEach((item) => {
                voters.push(item?._id);
                scores.push(item?.type);
            });
            await createRecommendation(
                {
                    voters,
                    scores,
                },
                navigation,
                dispatch,
            );
            navigation.navigate('AskRecommendation', {
                onRefresh: true,
            });
        } catch (err) {
            setErrorConfirm(err);
        }
        onStopLoading();
    };

    return (
        <>
            <Header title={t('askRecommendation.newRecommendation')} shadow={'none'} border />
            <Box flex={1}>
                <Box bgColor={'white'} px={'20px'} py={'20px'}>
                    <Text mb={'6px'}>{t('components.enterPhoneNumberClaimant')}</Text>
                    <CustomDebouncePhoneInput
                        onChangeText={onChangeText}
                        refControl={refPhoneInput}
                    />
                    {error && <Text color={'red.500'}>{error}</Text>}
                    {isShowResult && !error && (
                        <Box
                            backgroundColor={'white'}
                            shadow={1}
                            borderRadius={8}
                            px={'12px'}
                            py={'12px'}
                        >
                            <Text
                                fontWeight={'700'}
                                fontSize={'12px'}
                                mb={length > 0 ? '15px' : '0px'}
                            >{`${length} ${t('contract.claimantFounded')}`}</Text>

                            <TouchableOpacity onPress={() => onSelectUser(dataSearch)}>
                                <Box
                                    backgroundColor={'primary.200'}
                                    mb={'10px'}
                                    borderRadius={'8px'}
                                    py="10px"
                                    pl={'10px'}
                                >
                                    <Text fontSize={'12px'} fontWeight={'600'}>
                                        {dataSearch?.fullName}
                                    </Text>
                                    <Text
                                        color={'appColors.textGrey'}
                                        fontSize={'10px'}
                                        fontWeight={'400'}
                                    >
                                        {dataSearch?.phoneNumber || ''}
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    )}
                </Box>
                <HStack alignItems={'center'} p={'20px'}>
                    <Text flex={1} fontWeight={600} fontSize={12}>
                        {t('components.claimantsSelected')}
                    </Text>
                    <TouchableOpacity onPress={onClearAll}>
                        <Text fontWeight={600} fontSize={12} color={'primary.600'}>
                            {t('button.clearAll')}
                        </Text>
                    </TouchableOpacity>
                </HStack>
                <ScrollView flex={1} w={'full'}>
                    {listClaimant?.length === 0 && (
                        <Box alignItems={'center'} justifyContent={'center'} mt={'40px'}>
                            <Text color={'appColors.textGrey'}>
                                {t('error.noSelectedClaimants')}
                            </Text>
                        </Box>
                    )}
                    {listClaimant?.map((item, index) => (
                        <RecommendItem
                            key={index}
                            item={item}
                            RightButtonComponent={<CloseButton onPress={() => onRemove(item)} />}
                        >
                            <Text
                                color={'gray.700'}
                                fontWeight={500}
                                fontSize={12}
                                mt={'10px'}
                                pr={'20px'}
                            >
                                {t('askRecommendation.determineClaimant')}
                            </Text>
                            <HStack mt={'10px'} pr={'20px'}>
                                <ButtonPay
                                    active={item?.type === 0}
                                    _container={{ w: '50%', borderLeftRadius: '8px' }}
                                    onPress={() => onPressRecommend(item, 0)}
                                />
                                <ButtonPay
                                    active={item?.type === 1}
                                    _container={{ w: '50%', borderRightRadius: '8px', ml: '-1px' }}
                                    type={1}
                                    onPress={() => onPressRecommend(item, 1)}
                                />
                            </HStack>
                        </RecommendItem>
                    ))}
                </ScrollView>
            </Box>
            <BottomPrimaryButton
                title={t('button.confirm')}
                isDisabled={isDisabled || isLoading}
                _container={{ bgColor: 'primary.600' }}
                error={errorConfirm}
                onPress={onPressConfirm}
                isLoading={isLoading}
            />
        </>
    );
};

const CloseButton = ({ onPress }) => {
    return (
        <Box>
            <TouchableOpacity onPress={onPress}>
                <Box borderRadius={'full'} p={'6px'} bgColor={'gray.2320:alpha.20'}>
                    <CloseIcon />
                </Box>
            </TouchableOpacity>
        </Box>
    );
};

export default Index;
