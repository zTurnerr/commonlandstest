/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-unused-styles */
import { Box, CloseIcon, Text } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import { useFaceDetect } from '../../components/FaceRecognition';
import { EVENT_NAME } from '../../constants/eventName';
import useUploadImg from '../../hooks/useUploadImg';
import useUserInfo from '../../hooks/useUserInfo';
import useTranslate from '../../i18n/useTranslate';
import { acceptTransferReq, faceDetect } from '../../rest_client/apiClient';
import ReviewPhotoStep from './SignByPass/ReviewPhotoStep';
import { showErr } from '../../util/showErr';

export const useModalActiveTransfer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSigner, setSelectedSigner] = useState({});
    const open = (signer) => {
        setIsOpen(true);
        setSelectedSigner(signer);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = ({ isCancel, signingContract, onSubmit, contractId, onApproveSuccess }) => {
        return (
            <ModalActiveTransfer
                isVisible={isOpen}
                onClose={close}
                onSubmit={onSubmit}
                isCancel={isCancel}
                signingContract={signingContract}
                contractId={contractId}
                onApproveSuccess={onApproveSuccess}
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

const ModalActiveTransfer = ({
    isVisible,
    onClose,
    contractId,
    // signer,
    onApproveSuccess = () => {},
}) => {
    const t = useTranslate();
    const dim = useWindowDimensions();
    const [verifiedFace, setVerifiedFace] = React.useState(null);
    const uploadImgHook = useUploadImg();
    const faceDetectHook = useFaceDetect();
    const user = useUserInfo();
    const handelCloseModal = () => {
        onClose?.();
        setVerifiedFace(null);
        faceDetectHook.reset();
    };

    const checkFace = async (key) => {
        try {
            const formSubmit = {
                objectKey: key,
            };
            let { data } = await faceDetect(formSubmit);
            if (data?.error_code) {
                throw new Error(data?.error_detail || data?.error_message);
            }
            return data?.objectKey;
        } catch (error) {
            if (JSON.stringify(error?.message || error).includes('Something went wrong')) {
                throw new Error('Face check failed.');
            }
            throw error;
        }
    };

    const onApprove = async () => {
        // setLoading(true);
        let imageAWSKey = verifiedFace.objectKey;
        if (!imageAWSKey) {
            imageAWSKey = await uploadImgHook.uploadImg(verifiedFace.referenceImage);
        }

        try {
            await checkFace(imageAWSKey);
            await acceptTransferReq(contractId, {
                accept: true,
                pof: imageAWSKey,
                idToken: faceDetectHook?.otpToken,
                faceToken: faceDetectHook?.faceToken,
                phoneNumber: faceDetectHook?.otpToken ? user?.phoneNumber : null,
            });
            EventRegister.emit(EVENT_NAME.refreshContract);
            onApproveSuccess();
            setVerifiedFace(null);
            handelCloseModal();
        } catch (error) {
            showErr(error);
        }
    };

    const renderStep = () => {
        if (!verifiedFace) {
            return faceDetectHook.Component({
                onVerified: (data) => {
                    setVerifiedFace(data);
                },
            });
        }

        return (
            <ReviewPhotoStep
                showTxt={false}
                uri={verifiedFace.referenceImage}
                onSubmit={onApprove}
                onRetake={() => {
                    setVerifiedFace(null);
                }}
                showRetake={faceDetectHook.step === 2}
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
                    <TouchableOpacity onPress={handelCloseModal} style={{ padding: 5 }}>
                        <CloseIcon />
                    </TouchableOpacity>
                </Box>
                <Text mb="15px" fontSize={'16px'} fontWeight={600}>
                    {t('contract.activeContract')}
                </Text>
                <Text color="gray.700">{t('contract.takePhotoTransfer')}</Text>
                {renderStep()}
            </Box>
        </Modal>
    );
};

export default ModalActiveTransfer;

const styles = StyleSheet.create({
    btnTypeContract: {
        height: 40,
        borderRadius: 32,
        width: '96%',
        justifyContent: 'center',
        paddingLeft: 16,
    },
    btnStatusContract: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    icCloseModal: {
        position: 'absolute',
        right: 0,
        top: -20,
    },
});
