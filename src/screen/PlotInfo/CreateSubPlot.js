import { Box, Spinner, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import useTranslate from '../../i18n/useTranslate';
import { CLAIMANTS, CLAIMANTS_OPTIONS, INVITE_STATUS } from '../../util/Constants';

import { useRoute } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AvatarAndInfo from '../../components/AvatarAndInfo';
import { TickCircle } from '../../components/Icons';
import PhoneInput from '../../components/PhoneInput';
import { searchByPhone } from '../../rest_client/apiClient';

export default function Index({
    createSubPlotStep,
    height,
    selectedClaimant,
    setSelectedClaimant,
    claimants,
    setCreateSubPlotError,
    plotsInvites,
}) {
    const [formattedValue, setFormattedValue] = useState('');
    const [phoneInvalid, setPhoneInvalid] = useState(false);
    const [phone, setPhone] = useState('');
    const [data, setData] = useState({});
    const [requesting, setRequesting] = useState(false);
    const selected = selectedClaimant;
    const setSelected = setSelectedClaimant;
    const [clicked, setClicked] = useState(false);
    const route = useRoute();
    const { claimantReq } = route.params || {};
    const getInfo = async () => {
        setData({});
        setRequesting(true);
        setClicked(false);
        try {
            let res = await searchByPhone({ phoneNumber: formattedValue });
            if (res.data) {
                setData({ ...res.data.user });
            }
        } catch (err) {
            console.log(err);
        }
        setRequesting(false);
    };
    const canFetch = !phoneInvalid && formattedValue && phone;
    useEffect(() => {
        if (canFetch) {
            getInfo();
        } else {
            setData({});
        }
    }, [formattedValue, phoneInvalid]);

    const isExistedReq = (claimant) => {
        let isError = false;
        claimantReq?.forEach((i) => {
            if (i?.phoneNumber === claimant.phoneNumber) {
                isError = true;
                return;
            }
        });
        return isError;
    };

    //check claimant is existed
    const isExisted = (claimant) => {
        let isError = false;
        plotsInvites?.created?.forEach((i) => {
            if (
                i.inviteePhoneNumber === claimant.phoneNumber &&
                CLAIMANTS.includes(i.relationship) &&
                i.status === INVITE_STATUS.sent
            ) {
                isError = true;
                return;
            }
        });
        if (claimants.some((i) => i._id === claimant._id)) {
            isError = true;
        }
        return isError;
    };

    const t = useTranslate();
    return (
        createSubPlotStep === 1 && (
            <>
                <Box {...styles.container} minHeight={height}>
                    <Text fontSize="14px" fontWeight="600" mb="22px">
                        {t('subplot.enterPhonePeople')}
                    </Text>
                    <Box>
                        <PhoneInput
                            value={phone}
                            onChangeText={setPhone}
                            onChangeFormattedText={(text) => {
                                setFormattedValue(text);
                                setCreateSubPlotError('');
                            }}
                            onInvalid={setPhoneInvalid}
                            containerStyle={styles.phoneInput}
                        />
                        {data?.phoneNumber && !clicked ? (
                            <Box {...styles.showInfo}>
                                <TouchableOpacity
                                    onPress={() => {
                                        let newData = {
                                            ...data,
                                            relationship: 'renter',
                                        };
                                        if (isExistedReq(newData)) {
                                            return setCreateSubPlotError(
                                                t('subplot.cannotAddUser'),
                                            );
                                        }
                                        if (isExisted(newData)) {
                                            return setCreateSubPlotError(
                                                t('error.phoneAlreadyClaimant'),
                                            );
                                        }
                                        setCreateSubPlotError('');
                                        setSelected(newData);
                                        setClicked(true);
                                    }}
                                >
                                    <AvatarAndInfo
                                        avatar={data.avatar}
                                        primary={data.fullName}
                                        secondary={data.phoneNumber}
                                    />
                                </TouchableOpacity>
                            </Box>
                        ) : requesting ? (
                            <Box {...styles.showInfo}>
                                <Box {...styles.spinner}>
                                    <Spinner />
                                </Box>
                            </Box>
                        ) : (
                            canFetch &&
                            !data.phoneNumber && (
                                <Box {...styles.showInfo}>
                                    <Box {...styles.spinner}>
                                        <Text textAlign="center">{t('subplot.userNotFound')} </Text>
                                    </Box>
                                </Box>
                            )
                        )}
                    </Box>
                    {selected && (
                        <Box>
                            <Text {...styles.title}>{t('subplot.userSelected')}:</Text>
                            <AvatarAndInfo
                                avatar={selected?.avatar}
                                primary={selected?.fullName}
                                secondary={selected?.phoneNumber}
                                {...styles.userSelected}
                                actions={[
                                    <TouchableOpacity
                                        key={0}
                                        onPress={() => {
                                            setSelected(null);
                                            setClicked(false);
                                        }}
                                    >
                                        <Box {...styles.buttonUnselected}>
                                            <MaterialCommunityIcons
                                                name="close"
                                                size={24}
                                                color="black"
                                            />
                                        </Box>
                                    </TouchableOpacity>,
                                ]}
                            />
                            <Text {...styles.title}>{t('components.relationship')}</Text>
                            <Box {...styles.containerRole}>
                                {CLAIMANTS_OPTIONS.filter((i) =>
                                    ['renter', 'rightOfUse'].includes(i.value),
                                ).map((item) => {
                                    const active = selected?.relationship === item.value;
                                    return (
                                        <TouchableOpacity
                                            style={styles.statusItem}
                                            onPress={() => {
                                                setSelected({
                                                    ...selected,
                                                    relationship: item.value,
                                                });
                                            }}
                                            key={item.value}
                                        >
                                            <Box
                                                {...styles.chip}
                                                bgColor={active ? 'primary.500' : 'white'}
                                            >
                                                {active && (
                                                    <Box position={'absolute'} left={'4px'}>
                                                        <TickCircle color={'white'} />
                                                    </Box>
                                                )}
                                                <Text
                                                    fontWeight="500"
                                                    color={active ? 'white' : 'black'}
                                                >
                                                    {item.label}
                                                </Text>
                                            </Box>
                                        </TouchableOpacity>
                                    );
                                })}
                            </Box>
                        </Box>
                    )}
                </Box>
            </>
        )
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bgColor: 'white',
        w: 'full',
        p: '12px',
        zIndex: 10,
    },
    showInfo: {
        position: 'absolute',
        bgColor: 'white',
        w: 'full',
        top: '50px',
        shadow: 6,
        borderRadius: '6px',
        px: '12px',
        zIndex: 1,
    },
    spinner: {
        p: '32px',
    },
    containerRole: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chip: {
        flexDirection: 'row',
        borderRadius: '30px',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: '1px',
        borderColor: 'rgba(0, 0, 0, 0.15)',
        px: '12px',
        py: '8px',
        w: 'full',
    },
    title: {
        fontSize: '12px',
        fontWeight: '600',
        mb: '12px',
    },
    userSelected: {
        bgColor: '#F5F5F5',
        px: '12px',
        borderRadius: '12px',
        mb: '12px',
    },
    buttonUnselected: {
        bgColor: 'rgba(185, 185, 185, 0.20)',
        borderRadius: '30px',
        px: '4px',
        py: '4px',
    },
    phoneInput: {
        marginBottom: 0,
    },
    statusItem: {
        width: '48%',
    },
});
