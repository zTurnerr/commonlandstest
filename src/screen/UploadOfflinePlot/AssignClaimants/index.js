/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import { Box, HStack, Icon, Image, ScrollView, Spinner, Text, useTheme } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../../components/Button';
import DeleteIconButton from '../../../components/Button/DeleteIconButton';
import Header from '../../../components/Header';
import PhoneInput from '../../../components/PhoneInput';
import useTranslate from '../../../i18n/useTranslate';
import { searchByPhone } from '../../../rest_client/apiClient';
import { SCREEN_WIDTH } from '../../../util/Constants';
import RowClaimantsSelected from './RowClaimantsSelected';

const ExistUser = ({ user, onClickUser, error }) => {
    const t = useTranslate();
    const onPressAdd = async () => {
        onClickUser(user);
    };

    return (
        <>
            <Text fontWeight={600} fontSize={12} mb={'10px'}>
                {t('components.userFounded')}
            </Text>
            <TouchableOpacity onPress={() => onPressAdd()}>
                <HStack alignItems={'center'}>
                    {user.avatar ? (
                        <Image
                            source={{ uri: user.avatar }}
                            alt="avatar"
                            w="42px"
                            h="42px"
                            borderRadius="21px"
                        />
                    ) : (
                        <Icon size={10} as={<MaterialCommunityIcons name="account-circle" />} />
                    )}
                    <Box ml={'10px'} flex={1}>
                        <Box alignItems="flex-start">
                            <Text fontSize="14px" fontWeight="bold">
                                {user.fullName}
                            </Text>
                            <Text fontSize="11px" color={'gray.700'} fontWeight="400">
                                {user.phoneNumber}
                            </Text>
                        </Box>
                    </Box>
                </HStack>
            </TouchableOpacity>
            {error?.length > 0 && <Text color={'red.500'}>{error}</Text>}
        </>
    );
};

const NotFoundedUserAndCreateAccount = () => {
    const t = useTranslate();
    const navigation = useNavigation();
    return (
        <Box pt={'5px'}>
            <Text fontWeight={600}>{t('subplot.userNotFound')}</Text>
            <Text mb={'10px'}>{t('offlineMaps.createAccountAndAssign')}</Text>

            <Button
                variant={'outline'}
                onPress={() =>
                    navigation.navigate('SignUp', {
                        assignToOffline: true,
                    })
                }
                my={'5px'}
                w={'140px'}
            >
                {t('profile.createAccount')}
            </Button>
        </Box>
    );
};

const Index = ({ route }) => {
    const { assign, setAssign } = route?.params;
    const t = useTranslate();
    const navigation = useNavigation();
    const [userSelected, setUserSelected] = useState(assign?.users);
    const [error, setError] = useState('');
    const [users, setUsers] = useState(null);
    const [onFocus, setOnFocus] = useState(false);
    const [data, setData] = useState({
        phoneNumber: '',
    });
    const [resultState, setResultState] = useState({
        loading: false,
        showResult: false,
    });

    const addPhoneNumberFromParams = async (phoneNumber) => {
        let res = await searchByPhone({ phoneNumber: phoneNumber });
        let _user = res?.data?.user ? res?.data?.user : null;
        if (_user) {
            onAddUserToClaimants(_user);
        }
        debouncedOnChangeText('');
    };

    useEffect(() => {
        if (route?.params?.phoneToAdd) {
            addPhoneNumberFromParams(route?.params?.phoneToAdd);
            navigation.setParams({ phoneToAdd: null });
        }
    }, [route?.params]);

    const addPhoneNumber = async (phoneNumber) => {
        try {
            if (phoneNumber.length === 0) {
                return setResultState({ loading: false, showResult: false });
            } else {
                setResultState({ loading: true, showResult: true });
            }
            let res = await searchByPhone({ phoneNumber: phoneNumber });
            if (res.data.user) {
                const user = res.data.user;
                setUsers(user);
            } else {
                setUsers(null);
            }
        } catch (error) {}
        setResultState({ loading: false, showResult: true });
    };

    const onAddUserToClaimants = (user) => {
        setResultState({ loading: false, showResult: false });
        setData({ phoneNumber: '' });
        let users = [...userSelected];
        if (users?.length > 0 && users?.find((item) => item?.phoneNumber === user?.phoneNumber)) {
            return;
        }
        const newClaimants = [...users, { ...user, roleSelected: 'owner' }];
        setAssign((old) => ({
            ...old,
            users: newClaimants,
        }));
        setUserSelected(newClaimants);
    };

    const deleteFromClaimantsSelected = (phoneNumber) => {
        let users = [...userSelected];
        const newClaimants = users.filter((item) => item?.phoneNumber !== phoneNumber);
        setAssign((old) => ({
            ...old,
            users: newClaimants,
        }));
        setUserSelected(newClaimants);
    };

    const debounce = (func, wait) => {
        let timeout;
        return function (...args) {
            const context = this;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(context, args);
            }, wait);
        };
    };

    const debouncedOnChangeText = useCallback(
        debounce(async (phoneNumber) => {
            try {
                setError('');
                addPhoneNumber(phoneNumber);
            } catch (_error) {
                setError(_error?.message || '');
            }
        }, 500),
        [],
    );

    const setRoleSelected = (role, phoneNumber) => {
        let users = [...userSelected];
        const newClaimants = users.map((item) => {
            if (item?.phoneNumber === phoneNumber) {
                return { ...item, roleSelected: role };
            } else {
                return item;
            }
        });
        setAssign((old) => ({
            ...old,
            users: newClaimants,
        }));
        setUserSelected(newClaimants);
    };

    const clearAll = () => {
        setAssign((old) => ({
            ...old,
            users: [],
        }));
        setUserSelected([]);
    };

    const { colors } = useTheme();
    // borderColor: colors.gray[2300]
    return (
        <>
            <Header title={t('components.assignClaimants')} />
            <Box px={5} pt={5} pb={0} bg={'white'} mt={1} zIndex={100}>
                <Text mb={3} fontWeight={500}>
                    {t('offlineMaps.enterPhoneNumberAssign')}
                </Text>
                <PhoneInput
                    value={data.phoneNumber}
                    onChangeText={(text) => {
                        setData({ ...data, phoneNumber: text });
                    }}
                    onChangeFormattedText={(text) => {
                        debouncedOnChangeText(text);
                    }}
                    onFocusOutside={setOnFocus}
                    containerStyle={{
                        marginBottom: 14,
                        borderColor: onFocus ? colors.primary[600] : colors.gray[2300],
                    }}
                    textContainerStyle={{
                        borderColor: onFocus ? colors.primary[600] : colors.gray[2300],
                    }}
                    hideError
                />
                {resultState.showResult && (
                    <ScrollView
                        px={'16px'}
                        pt={'16px'}
                        pb={'6px'}
                        mt={'5px'}
                        shadow={1}
                        w={SCREEN_WIDTH - 40}
                        h={'auto'}
                        bgColor={'rgba(250, 250, 250, 1)'}
                        borderRadius={8}
                        minH={users ? '200px' : '300px'}
                        maxH={'50%'}
                        position={'absolute'}
                        zIndex={0}
                        top={'90px'}
                        left={'20px'}
                    >
                        {resultState.loading && <Spinner />}
                        {!resultState.loading && users && (
                            <ExistUser
                                user={users}
                                error={error}
                                setError={setError}
                                onClickUser={onAddUserToClaimants}
                            />
                        )}
                        {!resultState.loading && !users && <NotFoundedUserAndCreateAccount />}
                    </ScrollView>
                )}
            </Box>
            <Box flex={1} pt={'10px'}>
                <HStack alignItems={'center'} px={'20px'} pb={'20px'}>
                    <Text flex={1} fontWeight={600} fontSize={12}>
                        {t('components.claimantsSelected')}:
                    </Text>
                    <TouchableOpacity onPress={clearAll}>
                        <Text fontSize={12} fontWeight={600} color={'primary.600'}>
                            {t('button.clearAll')}
                        </Text>
                    </TouchableOpacity>
                </HStack>
                <ScrollView>
                    {userSelected?.length > 0 &&
                        userSelected.map((item, index) => (
                            <RowClaimantsSelected
                                info={item}
                                button={
                                    <DeleteIconButton
                                        onPress={() =>
                                            deleteFromClaimantsSelected(item?.phoneNumber)
                                        }
                                    />
                                }
                                type={null}
                                key={index}
                                roleSelected={item?.roleSelected}
                                setRoleSelected={setRoleSelected}
                            />
                        ))}
                    {userSelected.length === 0 && (
                        <Box mt={'50px'} justifyContent={'center'} alignItems={'center'}>
                            <Text fontWeight={600} fontSize={12}>
                                {t('error.noClaimants')}
                            </Text>
                        </Box>
                    )}
                </ScrollView>
            </Box>

            <Box pt={'15px'} px={'15px'} mb={'20px'}>
                <Button
                    bgColor={'primary.600'}
                    onPress={() => {
                        navigation.goBack();
                    }}
                    _pressed={{ bgColor: 'primary.700' }}
                >
                    {t('button.confirm')}
                </Button>
            </Box>
        </>
    );
};

export default Index;
