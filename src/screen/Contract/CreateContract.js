import { useNavigation } from '@react-navigation/native';
import { Box, Button, Flex, Input, ScrollView, Text, useTheme } from 'native-base';
import React, { useEffect, useState } from 'react';
import HeaderPage from '../../components/HeaderPage';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import RenderUnderWriter from './components/RenderUnderWriter';
import { SCREEN_HEIGHT } from '../../util/Constants';
import { createContract, getContractById } from '../../rest_client/apiClient';
import { checkValidUrl } from '../../util/Tools';
import useTranslate from '../../i18n/useTranslate';
import { BackHandler, Keyboard } from 'react-native';
import CreateContractUploadImgSection from '../../components/Contract/CreateContractUploadImgSection';
import { useModalQuitCreateContract } from '../../components/Contract/ModalQuitCreateContract';
import { useLoadingContractModal } from '../../components/Loading/LoadingContractModel';
import useContractImg from '../../hooks/Contract/useContractImg';

const MAX_AMOUNT = 100000000000;

const CreateContract = ({ route }) => {
    const t = useTranslate();
    let { user } = useShallowEqualSelector((state) => ({
        user: state.user.userInfo,
    }));
    const theme = useTheme();
    const imgHook = useContractImg();
    const { onCallback } = route?.params || {};
    const navigate = useNavigation();
    const [linkContract] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const scrollRef = React.useRef(null);
    // submit data
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState(false);
    const [unlockAmount, setUnlockAmount] = useState('');
    const [unlockAmountError, setUnlockAmountError] = useState(false);
    const modalQuitCreateContractHook = useModalQuitCreateContract();
    const loadingModalHook = useLoadingContractModal();
    //

    const goBack = () => {
        modalQuitCreateContractHook.open();
        // navigate.goBack();
    };

    const validate = () => {
        let isValid = true;
        //validate is number
        if (!amount) {
            setAmountError(t('error.amountRequired'));
            isValid = false;
        }
        if (!unlockAmount) {
            setUnlockAmountError(t('error.unlockAmountRequired'));
            isValid = false;
        }
        if (amount.includes('-')) {
            setAmountError(t('error.amountMustBeEqualOrGreater'));
            isValid = false;
        }
        if (unlockAmount.includes('-')) {
            setUnlockAmountError(t('error.unlockAmountMustBeEqualOrGreater'));
            isValid = false;
        }
        if (imgHook.imgList.length === 0) {
            setError(t('error.uploadAtLeast1Image'));
            isValid = false;
        }
        if (isNaN(amount)) {
            setAmountError(t('error.amountMustBeNumber'));
            isValid = false;
        }
        if (isNaN(unlockAmount)) {
            setUnlockAmountError(t('error.unlockAmountMustBeNumber'));
            isValid = false;
        }
        if (Number(amount) > MAX_AMOUNT) {
            setAmountError(
                t('contract.amountMustBeLess', {
                    number: '100,000,000,000',
                }),
            );
            isValid = false;
        }
        if (Number(unlockAmount) > MAX_AMOUNT) {
            setUnlockAmountError(
                t('contract.unlockAmountMustBeLess', { number: '100,000,000,000' }),
            );
            isValid = false;
        }
        return isValid;
    };

    const fetchNewContract = async (contractId) => {
        try {
            let { data } = await getContractById(contractId);
            if (data?.contract?.status !== 'pending') {
                setLoading(false);
                loadingModalHook.stopLoading();
                navigate.replace('CreatorContractDetail', {
                    contract: data.contract,
                });
            } else {
                setTimeout(() => {
                    fetchNewContract(contractId);
                }, 2000);
            }
        } catch (error) {}
    };

    const submitContract = async () => {
        Keyboard.dismiss();
        if (!validate()) {
            return;
        }
        setLoading(true);
        loadingModalHook.startLoading();
        try {
            //check url
            if (linkContract && !checkValidUrl(linkContract)) {
                setLoading(false);
                setError(t('error.invalidUrl'));
                return;
            }
            const formData = new FormData();
            formData.append('amount', Number(amount));
            formData.append('unlockAmount', Number(unlockAmount));
            formData.append('currency', 'Shillings');
            imgHook.imgList.forEach((item, index) => {
                formData.append(`files`, {
                    uri: item.uri,
                    type: 'image/jpeg',
                    name: `contract_image${index}.jpg`,
                });
            });
            let { data } = await createContract(formData, null, null);
            let contractId = data?.contract?._id;
            fetchNewContract(contractId);
            // navigate.goBack();
            onCallback?.();
        } catch (error) {
            console.log(error, 'error');
            setError(error);
        }
    };

    useEffect(() => {
        setError('');
        BackHandler.addEventListener('hardwareBackPress', goBack);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', goBack);
        };
    }, [linkContract]);

    useEffect(() => {
        setError('');
        setAmountError(false);
        setUnlockAmountError(false);
    }, [amount, unlockAmount, imgHook.imgList]);

    return (
        <ScrollView>
            <Flex
                minH={SCREEN_HEIGHT}
                loading={loading}
                backgroundColor={theme.colors.appColors.white}
                flex={1}
            >
                <HeaderPage onPress={goBack} title={t('contract.createContract0')} />

                <ScrollView ref={(ref) => (scrollRef.current = ref)}>
                    <Box flex={1} px="20px">
                        <RenderUnderWriter user={user} />
                        <Text mt="27px" mb="10px" fontSize={'12px'} fontWeight={600}>
                            {t('contract.loanAmount')}
                            <Text>{' *'}</Text>
                        </Text>
                        <Input
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={(text) => {
                                setAmount(text);
                                setAmountError(false);
                            }}
                            placeholder={t('contract.enterLoanAmount')}
                            _focus={{
                                borderColor: 'primary.600',
                            }}
                            InputRightElement={
                                <Text
                                    color={theme.colors.appColors.textGrey}
                                    fontSize={'12px'}
                                    fontWeight={'500'}
                                    px="20px"
                                >
                                    {'Shillings'}
                                </Text>
                            }
                        />
                        {amountError && (
                            <Text mt="5px" color="error.400">
                                {amountError}
                            </Text>
                        )}
                        <Text mt="27px" mb="10px" fontSize={'12px'} fontWeight={600}>
                            {t('contract.totalAmountTitle')}
                            <Text>{' *'}</Text>
                        </Text>
                        <Input
                            keyboardType="numeric"
                            placeholder={t('contract.enterTotalAmount')}
                            value={unlockAmount}
                            onChangeText={(text) => {
                                setUnlockAmount(text);
                                setUnlockAmountError(false);
                            }}
                            _focus={{
                                borderColor: 'primary.600',
                            }}
                            InputRightElement={
                                <Text
                                    color={theme.colors.appColors.textGrey}
                                    fontSize={'12px'}
                                    fontWeight={'500'}
                                    px="20px"
                                >
                                    {'Shillings'}
                                </Text>
                            }
                        />
                        {unlockAmountError && (
                            <Text mt="5px" color="error.400">
                                {unlockAmountError}
                            </Text>
                        )}

                        <Box mt="27px">
                            <CreateContractUploadImgSection
                                imgList={imgHook.imgList}
                                setImgList={imgHook.setImgList}
                                setErr={setError}
                            />
                        </Box>
                        {error && (
                            <Text my="10px" color="error.400">
                                {error}
                            </Text>
                        )}
                        <Button mb={'10px'} mt="15px" onPress={submitContract}>
                            {t('button.create')}
                        </Button>
                    </Box>
                </ScrollView>
                {modalQuitCreateContractHook.Component()}
                {loadingModalHook.Component()}
            </Flex>
        </ScrollView>
    );
};

export default CreateContract;
