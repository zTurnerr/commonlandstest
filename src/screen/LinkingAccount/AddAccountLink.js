import { Box, HStack, Input, Text } from 'native-base';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '../../components/Button';
import { useErrorAlert } from '../../components/ErrorAlert';
import HeaderPage from '../../components/HeaderPage';
import AlertCircleFilled from '../../components/Icons/AlertCircleFilled';
import MomoLogo from '../../components/Icons/MomoLogo';
import { userSliceActions } from '../../redux/reducer/user';
import { addMomoAccount } from '../../rest_client/apiClient';
import LinkAccountDetail from './components/LinkAccountDetail';

let lock = false;

const AddAccountLink = ({ navigation }) => {
    const alertHook = useErrorAlert();
    const dispatch = useDispatch();
    const [momoAccount, setMomoAccount] = useState('');
    const [loading, setLoading] = useState(false);

    async function submit() {
        if (lock) {
            return;
        }
        lock = true;
        setLoading(true);
        try {
            let { data } = await addMomoAccount(
                {
                    msisdn: momoAccount,
                    provider: 'momo',
                },
                null,
                null,
            );

            if (data?.error_code) {
                throw data?.error_message;
            }

            dispatch(userSliceActions.updateUserInfo({ userInfo: { msisdn: data?.data?.msisdn } }));
            navigation.goBack();
        } catch (error) {
            console.log(error);
            alertHook.showErrorAlert(error);
        }
        setLoading(false);
        lock = false;
    }

    return (
        <Box h="full">
            {alertHook.Component()}
            <HeaderPage
                onPress={() => {
                    navigation.goBack();
                }}
                title={'Add account link'}
                isRight={true}
            >
                <LinkAccountDetail />
            </HeaderPage>
            <Box bg="white" flex={1} px="25px">
                <Box alignItems={'center'} mt="47px" mb="72px">
                    <MomoLogo />
                </Box>
                <Text mb="11px" fontSize={'14px'} fontWeight={600} color="black">
                    {' '}
                    Linked MoMo account
                </Text>
                <Input
                    value={momoAccount}
                    onChangeText={(text) => setMomoAccount(text)}
                    placeholder="Enter MoMo number account (MSISDN)"
                    _focus={{
                        borderColor: 'primary.600',
                    }}
                />
                <Button
                    isLoading={loading}
                    onPress={() => {
                        submit();
                    }}
                    _container={{
                        mt: '26px',
                        mb: '20px',
                    }}
                >
                    Continue
                </Button>
                <HStack space={1}>
                    <Box>
                        <AlertCircleFilled width="20" height="20" />
                    </Box>
                    <Text fontSize={'12px'} fontWeight={400} color="gray.600" flex={1}>
                        Commonlands only links to your account to support collecting contract
                        activation fees (for Contract Creator) and creating invoices for payment
                        requests related to Contract features.
                    </Text>
                </HStack>
            </Box>
        </Box>
    );
};

export default AddAccountLink;
