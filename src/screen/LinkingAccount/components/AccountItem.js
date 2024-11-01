import { Box, Center, HStack, Radio, Spinner, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useErrorAlert } from '../../../components/ErrorAlert';
import BorderTrash from '../../../components/Icons/BorderTrash';
import MomoLogo2 from '../../../components/Icons/MomoLogo2';
import { userSliceActions } from '../../../redux/reducer/user';
import { deleteMomoAccount } from '../../../rest_client/apiClient';

const AccountItem = ({
    canDel = true,
    canSelect = false,
    setMsisdnSelected,
    msisdnSelected = '',
    item,
}) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const alertHook = useErrorAlert();

    const onDelete = async () => {
        setLoading(true);
        try {
            let { data } = await deleteMomoAccount(item?._id, null, null);
            if (data?.error_code) {
                throw data?.error_message;
            }

            dispatch(userSliceActions.updateUserInfo({ userInfo: { msisdn: data?.data?.msisdn } }));
        } catch (error) {
            alertHook.showErrorAlert(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        return () => {
            setLoading(false);
        };
    }, []);

    const renderDelete = () => {
        if (!canDel) {
            return null;
        }
        return !loading ? (
            <TouchableOpacity
                onPress={() => {
                    onDelete();
                }}
            >
                <Center borderRadius={1000} bg="muted.400" p="5px">
                    <BorderTrash />
                </Center>
            </TouchableOpacity>
        ) : (
            <Spinner />
        );
    };

    const selectStyle = () => {
        if (!canSelect) {
            return {};
        }
        if (msisdnSelected === item?._id) {
            return {
                borderColor: 'primary.600',
                borderWidth: '1px',
                bg: 'appColors.bgPrimary',
            };
        }
        return {};
    };

    return (
        <>
            {alertHook.Component()}
            <TouchableOpacity
                onPress={() => {
                    if (canSelect) {
                        setMsisdnSelected(item?._id);
                    }
                }}
            >
                <HStack
                    alignItems={'center'}
                    space={4}
                    p="13px"
                    mt="8px"
                    bg="white"
                    borderRadius={'8px'}
                    justifyContent={'space-between'}
                    {...selectStyle()}
                >
                    <Box width={'44px'} height={'44px'} borderRadius={1000} overflow={'hidden'}>
                        <MomoLogo2 />
                    </Box>
                    <Box flex={1}>
                        <Text>MoMo</Text>
                        <Text fontSize={'12px'} fontWeight={700}>
                            {item?.msisdn || ''}
                        </Text>
                    </Box>
                    {renderDelete()}
                    {canSelect && (
                        <Radio.Group
                            name="myRadioGroup"
                            defaultValue="0"
                            value={msisdnSelected}
                            aria-label="Select account"
                            accessibilityLabel="Select account"
                            onChange={(nextValue) => {
                                setMsisdnSelected(nextValue);
                            }}
                        >
                            <Radio
                                size="24px"
                                value={item?._id}
                                my="0px"
                                aria-label="Select this account"
                                accessibilityLabel="Select this account"
                            />
                        </Radio.Group>
                    )}
                </HStack>
            </TouchableOpacity>
        </>
    );
};

export default AccountItem;
