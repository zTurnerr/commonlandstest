/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { useNavigation } from '@react-navigation/core';
import { Box, Image, ScrollView, Text, useDisclose } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../components/Button';
import Header from '../../components/Header';
import ProfileForm from '../../components/ProfileForm';
import Tabs from '../../components/Tabs';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { userSliceActions } from '../../redux/reducer/user';
import {
    updateAvatar,
    updatePhoneNumber,
    updateProfile,
    uploadDocument,
} from '../../rest_client/apiClient';
import {
    isArrayNotEmpty,
    openCamera,
    openPicker,
    showMessage,
    validateImages,
} from '../../util/Constants';
import { getCurrentAccountIndex, updateAccountToStorage } from '../../util/script';
import PersonalInformation from './PersonalInformation';
import SelectAvatar from './SelectAvatar';
// import { Pen } from '../../components/Icons';

const styles = StyleSheet.create({
    scroll: {
        alignItems: 'center',
        // minHeight: '100%',
        paddingBottom: 140,
    },
});

export default function Index() {
    const t = useTranslate();

    const user = useShallowEqualSelector((state) => state.user.userInfo);
    const [error, setError] = useState('');
    const [requesting, setRequesting] = useState(false);
    const [activeTab, onTabChange] = useState(0);
    const [data, setData] = useState({
        ...user,
    });
    const { isOpen, onClose } = useDisclose();
    const navigation = useNavigation();
    const [files, setFiles] = useState({
        nationalID: [],
        driverLicense: [],
        passport: [],
    });
    const [deleteFiles, setDeleteFiles] = useState({
        nationalID: [],
        driverLicense: [],
        passport: [],
    });
    const initData = () => {
        if (!user?.documentation) {
            return;
        }
        let f = {};
        for (let key in files) {
            if (user?.documentation[key]) {
                f[key] = user?.documentation[key].map((i) => {
                    return {
                        ...i,
                    };
                });
            }
        }
        setFiles(f);
    };
    useEffect(() => {
        initData();
    }, [user.documentation]);
    const dispatch = useDispatch();
    const isDisabled = () => {
        return requesting || !data.fullName;
    };
    const submitEvidence = async () => {
        setRequesting(true);
        try {
            let documentation;
            let keys = [];
            for (let key in files) {
                let form = new FormData();
                files[key]?.forEach((f, index) => {
                    if (!f.key) {
                        let photo = {
                            uri: f.uri,
                            type: f.type,
                            name: `${f.fileName}`,
                        };
                        form.append('image' + index, photo);
                    }
                });
                if (deleteFiles[key].length) {
                    form.append('deletedImageKeys', JSON.stringify(deleteFiles[key]));
                }
                if (!isArrayNotEmpty(form._parts)) {
                    continue;
                }
                form.append('docType', key);
                keys.push(key);
                let res = await uploadDocument(form, navigation, dispatch);
                documentation = res.data.documentation;
            }
            setDeleteFiles({
                nationalID: [],
                driverLicense: [],
                passport: [],
            });

            if (documentation) {
                dispatch(
                    userSliceActions.updateDocumentation({
                        documentation,
                    }),
                );
            }
            showMessage({ text: t('button.saved') });
        } catch (err) {
            setError(JSON.stringify(err));
        } finally {
            setRequesting(false);
        }
    };
    const submitProfile = async () => {
        try {
            Keyboard.dismiss();
            setRequesting(true);
            let res = await updateProfile(
                {
                    fullName: data.fullName,
                    gender: data.gender,
                    phoneNumber: data.phoneNumber,
                },
                navigation,
                dispatch,
            );
            dispatch(userSliceActions.setData({ userInfo: res.data.user }));
            showMessage({ text: t('button.saved') });
            let index = await getCurrentAccountIndex();
            updateAccountToStorage(res.data.user, index);
        } catch (err) {
            setError(JSON.stringify(err));
        } finally {
            setRequesting(false);
        }
    };
    const submit = () => {
        setError('');
        if (activeTab === 1) {
            return submitEvidence();
        }
        return submitProfile();
    };
    const uploadAvatar = async (uri) => {
        let form = new FormData();
        let photo = {
            uri: uri,
            type: 'image/jpeg',
            name: `avatar`,
        };
        form.append('image', photo);
        let res = await updateAvatar(form, navigation, dispatch);
        return res.data.avatarURL;
    };
    const selectImage = async () => {
        try {
            setRequesting(true);
            onClose();
            let images = await openPicker({});
            if (!images || !images.length) {
                setRequesting(false);
                return;
            }
            validateImages(images);
            if (images[0]) {
                let uri = await uploadAvatar(images[0].uri);
                setData({ ...data, avatar: uri });
                dispatch(userSliceActions.setData({ userInfo: { avatar: uri } }));
            }
        } catch (err) {
            console.log(err);
            setError(err.message ? err.message : err);
        } finally {
            setRequesting(false);
        }
    };
    const startCamera = async () => {
        try {
            onClose();
            setRequesting(true);

            let images = await openCamera();
            if (!images || images.length) {
                return;
            }
            if (!images) {
                setRequesting(false);
                return;
            }
            if (images[0]) {
                let uri = await uploadAvatar(images[0].uri);
                setData({ ...data, avatar: uri });
                dispatch(userSliceActions.setData({ userInfo: { avatar: uri } }));
            }
        } catch (err) {
            setError(err);
        } finally {
            setRequesting(false);
        }
    };
    const onCancel = () => {
        try {
            initData();
            navigation.goBack();
        } catch (err) {}
    };
    const onSubmitPhoneNumber = async (form) => {
        try {
            let res = await updatePhoneNumber(form, navigation, dispatch);

            dispatch(userSliceActions.setData({ userInfo: res.data.user }));
            setData({ ...data, phoneNumber: res.data.user.phoneNumber });
            // showMessage({ text: t('button.saved') });
            let index = await getCurrentAccountIndex();
            updateAccountToStorage(res.data.user, index);
            return res;
        } catch (err) {
            console.log(err, 'heloooooo');
            throw err;
        }
    };
    return (
        <>
            <Header title={t('profile.editProfile')} border />
            <ScrollView
                // h="full"
                bg="white"
                px="20px"
                contentContainerStyle={styles.scroll}
            >
                <Box>
                    <Box
                        mt="41px"
                        w="134px"
                        h="134px"
                        overflow="hidden"
                        borderRadius="67px"
                        bg="muted.400"
                    >
                        <Image source={{ uri: data.avatar }} alt="profile" w="full" h="full" />
                    </Box>
                    {/* <Button
                        _container={{
                            w: '56px',
                            h: '56px',
                            borderRadius: '28px',
                            position: 'absolute',
                            bottom: -8,
                            right: '0',
                        }}
                        onPress={onOpen}
                        leftIcon={<Pen color="white" />}
                        isDisabled={requesting}
                        isLoading={requesting}
                    ></Button> */}
                </Box>
                <Tabs
                    items={[
                        { label: t('profile.personalInformation'), value: 1 },
                        { label: t('profile.evidencePhotos'), value: 2 },
                    ]}
                    activeIndex={activeTab}
                    onTabChange={onTabChange}
                    mt="12px"
                />
                {activeTab === 0 ? (
                    <ProfileForm
                        onChangeData={setData}
                        data={data}
                        isEdit
                        onSubmitPhoneNumber={onSubmitPhoneNumber}
                    />
                ) : (
                    <PersonalInformation
                        setError={setError}
                        files={files}
                        setFiles={setFiles}
                        setDeleteFiles={setDeleteFiles}
                        deleteFiles={deleteFiles}
                    />
                )}
            </ScrollView>
            <Box
                w="full"
                px="20px"
                position="absolute"
                bottom={0}
                bgColor="white"
                py="12px"
                borderWidth="1px"
                borderColor="gray.100"
                shadow={9}
            >
                <Text textAlign="center" color="error.400" mb="12px">
                    {error}
                </Text>
                <Box flexDir="row" justifyContent="space-between">
                    <Button
                        isDisabled={requesting}
                        onPress={onCancel}
                        variant="outline"
                        _container={{ w: '48%' }}
                    >
                        {t('button.cancel')}
                    </Button>
                    <Button
                        isLoading={requesting}
                        isDisabled={isDisabled()}
                        onPress={submit}
                        _container={{ w: '48%' }}
                    >
                        {t('button.save')}
                    </Button>
                </Box>
            </Box>
            <SelectAvatar
                selectImage={selectImage}
                startCamera={startCamera}
                isOpen={isOpen}
                onClose={onClose}
            />
        </>
    );
}
