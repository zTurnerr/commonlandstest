import { Box, Button, FlatList, Flex, HStack, Text, useTheme } from 'native-base';
import React, { useCallback, useState } from 'react';
import { Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { inviteContractSigners, searchPeople } from '../../rest_client/apiClient';

import { useNavigation } from '@react-navigation/native';
import PhoneInput from 'react-native-phone-number-input';
import HeaderPage from '../../components/HeaderPage';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { debounce } from '../../util/debounce';
import { showErr } from '../../util/showErr';
import ContractPeople from './components/ContractPeople';

const InviteCosigner = ({ route }) => {
    const t = useTranslate();
    const theme = useTheme();
    const navigate = useNavigation();
    const { contract, invites } = route?.params || {};
    let { user } = useShallowEqualSelector((state) => ({
        user: state.user.userInfo,
    }));

    const [dataSearch, setDataSearch] = useState(null);
    const [error, setError] = useState('');
    const [isShowResult, setIsShowResult] = useState(false);
    const [selectedPeople, setSelectedPeople] = useState(invites || []);
    const [value, setValue] = useState('');
    const length = dataSearch ? 1 : 0;
    const isDisable = !selectedPeople.filter((e) => e?.user?.phoneNumber).length;
    const [updatingCosigner, setUpdatingCosigner] = useState(false);
    const { mapReducer } = useShallowEqualSelector((state) => ({
        mapReducer: state.map,
    }));

    const keyExtractor = useCallback((_item, index) => index.toString() + index, []);

    const goBack = () => {
        navigate.goBack();
    };

    const onConfirm = async () => {
        setUpdatingCosigner(true);
        try {
            let phoneNumberList = selectedPeople?.map((e) => e?.user?.phoneNumber);
            phoneNumberList = phoneNumberList.filter((e) => !!e);
            await inviteContractSigners(
                contract?._id,
                {
                    inviteePhoneNumbers: phoneNumberList,
                },
                null,
                null,
            );
            goBack();
        } catch (error) {
            showErr(error);
        }
        setUpdatingCosigner(false);
    };

    const onRemovePeople = (item) => {
        const newData = selectedPeople?.filter(
            (e) => e?.user?.phoneNumber !== item?.user?.phoneNumber,
        );
        setSelectedPeople(newData);
    };

    const debouncedOnChangeText = useCallback(
        debounce(async (phoneNumber) => {
            setError('');
            let data = {
                phoneNumber,
            };
            try {
                if (!error) {
                    if (!phoneNumber) return;
                    if (phoneNumber == contract.creator.user.phoneNumber) {
                        setError(t('error.cannotInviteUnderwriter'));
                        return;
                    }
                    const response = await searchPeople(data);
                    if (response.data?.user) {
                        setIsShowResult(true);
                    } else {
                        setError(t('error.phoneInvalid'));
                        setIsShowResult(false);
                    }
                    setDataSearch({
                        ...response?.data?.user,
                        hasLandCertificate: response?.data?.hasFnCPlots,
                        hasLockedPlots: response?.data?.hasLockedPlots,
                    });
                }
            } catch (_error) {
                setError(_error?.message || '');
            }
        }, 500),
        [],
    );

    const onChangeText = (phoneNumber) => {
        // setValue(phoneNumber);
        debouncedOnChangeText(phoneNumber);
    };

    const onCheckDuplicate = () => {
        if (selectedPeople?.length === 0) {
            return true;
        } else {
            const isExit = selectedPeople?.find(
                (e) =>
                    e?.user?.phoneNumber === dataSearch?.phoneNumber ||
                    e?.receiver?.phoneNumber === dataSearch?.phoneNumber,
            );
            if (isExit) {
                return false;
            }
            return true;
        }
    };

    const onSelectPeople = () => {
        // if dataCosigner lenght > 10 then return
        if (selectedPeople?.length >= 10) {
            setError(t('error.maxCoSignersReached'));
            return;
        }
        if (dataSearch?._id === user?._id) {
            setError(t('error.cannotInviteYourself'));
            return;
        }
        if (!dataSearch.hasLandCertificate) {
            setError(t('error.noEligibleCertificate'));
            return;
        }
        const response = onCheckDuplicate();
        if (response) {
            if (dataSearch?.hasLandCertificate) {
                setIsShowResult(false);
                const dataTemp = selectedPeople?.filter((e) => e?._id !== dataSearch?._id);
                const newData = [...dataTemp, { user: dataSearch }];
                setSelectedPeople(newData);
                setTimeout(() => {
                    setValue('');
                    setDataSearch(null);
                }, 100);
            } else {
                setError(t('error.noEligibleCertificate'));
            }
        } else {
            setError(t('error.alreadyAddedPerson'));
        }
    };

    const renderItem = ({ item, index }) => {
        return (
            <ContractPeople
                key={index}
                item={{ user: item?.user || item?.receiver || {} }}
                onRemove={item?.user ? () => onRemovePeople(item) : null}
                statusContract={contract?.status}
            />
        );
    };

    const RowInfo = () => {
        return (
            <TouchableOpacity onPress={onSelectPeople}>
                <Box
                    backgroundColor={theme.colors.primary[200]}
                    mb={'10px'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    borderRadius={'8px'}
                    py="10px"
                >
                    <Box ml={'8px'}>
                        <Text fontSize={'12px'} fontWeight={'600'}>
                            {dataSearch?.fullName}
                        </Text>
                        <Text
                            color={theme.colors.appColors.textGrey}
                            fontSize={'10px'}
                            fontWeight={'400'}
                        >
                            {dataSearch?.phoneNumber || ''}
                        </Text>
                    </Box>
                </Box>
            </TouchableOpacity>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Flex backgroundColor={theme.colors.appColors.white} flex={1}>
                <HeaderPage onPress={goBack} title={t('contract.inviteCosigner')} />
                <Box
                    w={'86%'}
                    alignSelf={'center'}
                    mt={'21px'}
                    backgroundColor={theme.colors.appColors.white}
                    flex={1}
                >
                    <Text fontWeight={'400'} fontSize={'12px'}>
                        {t('contract.enterThePhoneOfCosigner')}
                    </Text>
                    <Box style={styles.container}>
                        <PhoneInput
                            value={value}
                            onChangeText={(text) => {
                                setValue(text);
                            }}
                            onChangeFormattedText={onChangeText}
                            textInputStyle={styles.phoneInputStyle}
                            textContainerStyle={styles.textContainer}
                            countryPickerButtonStyle={styles.countryPickerButton}
                            containerStyle={styles.containerStyle}
                            hideError
                            placeholder="Ex: (225) 555-0118"
                            defaultCode={mapReducer.countryCode || 'UG'}
                            withDarkTheme={false}
                            textInputProps={{
                                placeholderTextColor: '#C5C6CC',
                            }}
                        />
                    </Box>
                    <Text my={error ? '12px' : '0px'} color="error.400">
                        {error}
                    </Text>
                    {isShowResult && !error && value && (
                        <Box
                            backgroundColor={theme.colors.appColors.white}
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
                            {dataSearch && <RowInfo />}
                        </Box>
                    )}
                    <HStack mb="10px" mt="20px" justifyContent={'space-between'}>
                        <Text fontSize={'12px'} fontWeight={600}>
                            {t('contract.cosignerSelected')}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedPeople(invites || []);
                                setDataSearch(null);
                            }}
                        >
                            <Text color="primary.600" fontSize={'12px'} fontWeight={600}>
                                {t('button.clearAll')}
                            </Text>
                        </TouchableOpacity>
                    </HStack>
                    {selectedPeople?.length > 0 && (
                        <Box
                            mb={'24px'}
                            flex={1}
                            overflow={'hidden'}
                            mt={isShowResult ? '10px' : '0px'}
                        >
                            <FlatList
                                keyExtractor={keyExtractor}
                                data={[...selectedPeople]}
                                numColumns={1}
                                renderItem={renderItem}
                            />
                        </Box>
                    )}
                </Box>
                <Box mt={'auto'}>
                    <Button
                        {...{
                            mt: '14px',
                            w: '92%',
                            alignSelf: 'center',
                            mb: '24px',
                            opacity: isDisable ? 0.5 : 1,
                            bg: 'primary.600',
                        }}
                        disabled={isDisable}
                        onPress={onConfirm}
                        isLoading={updatingCosigner}
                    >
                        {t('button.confirm')}
                    </Button>
                </Box>
            </Flex>
        </TouchableWithoutFeedback>
    );
};

export default InviteCosigner;

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
        borderColor: '#5EC4AC',
        marginTop: 12,
        justifyContent: 'center',
        height: 48,
        paddingRight: 20,
    },
    phoneInputStyle: {
        height: 48,
    },
    textContainer: {
        backgroundColor: 'white',
    },
    countryPickerButton: {
        width: 'auto',
    },
    containerStyle: {
        paddingLeft: 12,
    },
    // btnCheckbox: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     paddingLeft: 21,
    // },
});
