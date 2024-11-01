import { Box, CloseIcon, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import { EVENT_NAME } from '../../constants/eventName';

import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { acceptOrRejectInvite } from '../../rest_client/apiClient';
import { useNoTxtTab } from '../Tabs/NoTxtTab';
import ReviewPhotoStep from './SignByPass/ReviewPhotoStep';
import SignNoPassStep from './SignByPass/SignNoPassStep';
import FaceRecognition from '../../components/FaceRecognition';
import { refetchContractToShowSigner } from '../../util/contractObject';
import useUserInfo from '../../hooks/useUserInfo';

export const useModalSignNoPass = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSigner, setSelectedSigner] = useState({});
    const open = (signer) => {
        setIsOpen(true);
        setSelectedSigner(signer);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = ({ isCancel, signingContract, onSubmit, contractId }) => {
        return (
            <ModalSignNoPass
                isVisible={isOpen}
                onClose={close}
                onSubmit={onSubmit}
                isCancel={isCancel}
                signingContract={signingContract}
                contractId={contractId}
                signer={selectedSigner}
            />
        );
    };

    return {
        open,
        close,
        Component,
    };
};

const ModalSignNoPass = ({ isVisible, onClose, contractId, signer }) => {
    const t = useTranslate();
    const noTxtTabHook = useNoTxtTab();
    const dim = useWindowDimensions();
    useShallowEqualSelector((state) => state.user.userInfo);
    const [password, setPassword] = useState('');
    const [imageAWSKey, setImageAWSKey] = useState('');
    const user = useUserInfo();

    const [loading, setLoading] = useState(false);
    const [signErr, setSignErr] = useState('');
    const [verifiedFace, setVerifiedFace] = React.useState(null);

    const handelCloseModal = () => {
        onClose?.();
        setVerifiedFace(null);
    };

    const onSubmitImage = async () => {
        let key = verifiedFace.objectKey;
        setImageAWSKey(key);
        noTxtTabHook.onChangeIndex(1);
    };

    const onSign = async () => {
        setLoading(true);
        try {
            let dataSubmit = {
                accept: true,
                pof: imageAWSKey,
            };
            await acceptOrRejectInvite(contractId, dataSubmit, null, null);
            refetchContractToShowSigner(contractId, user?._id, () => {
                EventRegister.emit(EVENT_NAME.refreshContract);
                setVerifiedFace(null);
                onClose?.();
                setLoading(false);
            });
        } catch (error) {
            Alert.alert(t('error.title'), error);
            setSignErr(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        setSignErr('');
    }, [password]);

    const renderStep = () => {
        if (!verifiedFace) {
            return <FaceRecognition onVerified={(data) => setVerifiedFace(data)} />;
        }
        if (noTxtTabHook.index === 0) {
            return <ReviewPhotoStep uri={verifiedFace.referenceImage} onSubmit={onSubmitImage} />;
        }

        return (
            <SignNoPassStep
                passwordObj={{
                    password,
                    setPassword,
                }}
                onSubmit={onSign}
                signer={signer}
                loading={loading}
                err={signErr}
            />
        );
    };

    return (
        <Modal style={styles.modal} isVisible={isVisible} onBackdropPress={handelCloseModal}>
            <Box
                px="20px"
                py="15px"
                mt="auto"
                pt={'10px'}
                backgroundColor={'white'}
                borderRadius={16}
                shadow={1}
                w={dim.width - 40}
            >
                <Box position={'absolute'} top="15px" right={'15px'}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <CloseIcon />
                    </TouchableOpacity>
                </Box>
                <Text mb="15px" fontSize={'16px'} fontWeight={600}>
                    {t('contract.signContract')}
                </Text>
                {noTxtTabHook.Component()}
                {renderStep()}
            </Box>
        </Modal>
    );
};

export default ModalSignNoPass;

const styles = StyleSheet.create({
    // btnTypeContract: {
    //     height: 40,
    //     borderRadius: 32,
    //     width: '96%',
    //     justifyContent: 'center',
    //     paddingLeft: 16,
    // },
    // btnStatusContract: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: 15,
    // },
    // icCloseModal: {
    //     position: 'absolute',
    //     right: 0,
    //     top: -20,
    // },
    closeButton: {
        padding: 5,
    },
});
