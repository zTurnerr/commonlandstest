import { useRoute } from '@react-navigation/native';
import { Box, Icon, ScrollView, Select, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { CLAIMANTS_OPTIONS } from '../../util/Constants';
import Button from '../Button';
import PhoneInput from '../PhoneInput';
import UserRow from './UserRelationshipRow';

export default function Index({
    onPress,
    buttonLabel,
    buttonProps = {},
    list,
    setList,
    validateData,
}) {
    const t = useTranslate();
    const route = useRoute();

    const [data, setData] = useState({
        phoneNumber: '',
        relationship: '',
    });
    const user = useShallowEqualSelector((state) => state.user.userInfo);
    const [error, setError] = useState('');
    const [formattedValue, setFormattedValue] = useState('');
    const [phoneInvalid, setPhoneInvalid] = useState(false);
    const [requesting, setRequesting] = useState(false);

    const existReqClaimant = (phoneNumber) => {
        let res = false;
        route.params?.claimantReq?.forEach((item) => {
            if (item?.status !== 'pending') return;
            if (new Date(item.expiredAt).getTime() < Date.now()) {
                return;
            }
            if (item.phoneNumber === phoneNumber) {
                res = true;
            }
        });
        return res;
    };

    const onAddInvite = () => {
        if (existReqClaimant(formattedValue)) {
            setError(t('plot.phoneAlreadySent'));
            return;
        }

        let isExisted = list.find((i) => i.phoneNumber === formattedValue);
        let isOwner = user.phoneNumber === formattedValue,
            checkData = '';
        if (validateData) {
            checkData = validateData({
                phoneNumber: formattedValue,
                relationship: data.relationship,
            });
        }
        setError('');
        if (isExisted || isOwner || checkData) {
            setError(checkData ? checkData : t('error.phoneAlreadyClaimant'));
            return;
        }
        let _list = JSON.parse(JSON.stringify(list));
        _list.push({
            phoneNumber: formattedValue,
            relationship: data.relationship,
        });
        setList(_list);
        setData({ phoneNumber: '', relationship: '' });
        setFormattedValue('');
    };

    const onUserRowPress = (info) => {
        let _list = JSON.parse(JSON.stringify(list));
        _list = _list.filter((i) => i.phoneNumber !== info.phoneNumber);
        setList(_list);
    };
    const onInvites = async () => {
        try {
            setRequesting(true);
            await onPress();
        } catch (err) {
            console.log('err', err);
            setError(err?.message || err);
        } finally {
            setRequesting(false);
        }
    };
    useEffect(() => {
        setData({ phoneNumber: '', relationship: '' });
        return () => {
            setData({ phoneNumber: '', relationship: '' });
        };
    }, []);
    return (
        <>
            <ScrollView w="full" h="full" contentContainerStyle={styles.scrollView}>
                <Box w="full" h="full" px="18px">
                    <Text fontSize="16px" fontWeight="700">
                        {t('components.invitePeople')}
                    </Text>
                    <Text
                        mt="30px"
                        w="100%"
                        textAlign="left"
                        fontWeight="500"
                        fontSize="12px"
                        mb="12px"
                    >
                        {t('components.phoneNumber')}
                    </Text>
                    <PhoneInput
                        value={data.phoneNumber}
                        onChangeText={(text) => {
                            setData({ ...data, phoneNumber: text });
                        }}
                        onChangeFormattedText={(text) => {
                            setFormattedValue(text);
                        }}
                        onInvalid={setPhoneInvalid}
                        containerStyle={styles.phoneInput}
                        autoFocus
                    />
                    <Text w="100%" textAlign="left" fontWeight="500" fontSize="12px" mb="12px">
                        {t('components.relationship')}
                    </Text>
                    <Select
                        selectedValue={data.relationship}
                        w="full"
                        accessibilityLabel={t('components.chooseRelationship')}
                        placeholder={t('components.chooseRelationship')}
                        mt={1}
                        onValueChange={(relationship) => setData({ ...data, relationship })}
                    >
                        {[...CLAIMANTS_OPTIONS].map((item, index) => {
                            return (
                                <Select.Item key={index} label={item.label} value={item.value} />
                            );
                        })}
                    </Select>

                    <Button
                        isDisabled={phoneInvalid || !data.phoneNumber || !data.relationship}
                        mt="22px"
                        variant="outline"
                        leftIcon={
                            <Icon
                                as={<MaterialCommunityIcons name="account-plus-outline" />}
                                size={5}
                            ></Icon>
                        }
                        onPress={onAddInvite}
                    >
                        {t('components.addInvite')}
                    </Button>

                    {Boolean(list.length) && (
                        <Box mt="18px" bgColor="primary.100" p="8px" borderRadius="8px">
                            <Text pl="12px" fontSize="16px" fontWeight="700">
                                {t('components.listInvites')}
                            </Text>
                            {list.map((item, index) => {
                                return <UserRow key={index} info={item} onPress={onUserRowPress} />;
                            })}
                        </Box>
                    )}
                </Box>
            </ScrollView>
            <Box w="full" position="absolute" bottom="0px" px="18px" pb="12px">
                <Text mb="12px" textAlign="center" color="error.400">
                    {error}
                </Text>
                <Button
                    isDisabled={!Boolean(list.length) || requesting}
                    onPress={() => onInvites()}
                    isLoading={requesting}
                    {...buttonProps}
                >
                    {buttonLabel}
                </Button>
            </Box>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        paddingBottom: 100,
    },
    phoneInput: {
        marginBottom: 0,
    },
});
