/* eslint-disable react-native/no-inline-styles */
import { Box, Text } from 'native-base';
import React, { useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import { useFaceDetect } from '../../components/FaceRecognition';
import { EVENT_NAME } from '../../constants/eventName';
import useUploadImg from '../../hooks/useUploadImg';
import useUserInfo from '../../hooks/useUserInfo';
import useTranslate from '../../i18n/useTranslate';
import { faceDetect, signContractByUnderwriter } from '../../rest_client/apiClient';
import { showErr } from '../../util/showErr';
import ModalCloseButton from '../Button/ModalCloseButton';
import ReviewPhotoStep from './SignByPass/ReviewPhotoStep';

export const useModalActiveContract = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSigner, setSelectedSigner] = useState({});

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const onRemoveSigner = () => {
        open();
    };

    const Component = ({ contractId, contractDid }) => {
        return (
            <ModalActiveContract
                isOpen={isOpen}
                onClose={close}
                contractId={contractId}
                contractDid={contractDid}
            />
        );
    };

    return {
        Component,
        open,
        close,
        selectedSigner,
        setSelectedSigner,
        onRemoveSigner,
    };
};

export default function ModalActiveContract({ isOpen, onClose, contractId = '' }) {
    const t = useTranslate();
    const [verifiedFace, setVerifiedFace] = React.useState(null);
    const uploadImgHook = useUploadImg();
    const faceDetectHook = useFaceDetect();
    const user = useUserInfo();
    // const checkActiveContract = async () => {
    //     try {
    //         let { data } = await getContractByDID(contractDid);
    //         if (data?.contract?.status !== 'created') {
    //             EventRegister.emit(EVENT_NAME.refreshContract);
    //             EventRegister.emit(EVENT_NAME.activeContractSuccess);
    //             setLoading(false);
    //             _onClose?.();
    //             return;
    //         }
    //         setTimeout(() => {
    //             checkActiveContract();
    //         }, 1000);
    //     } catch (error) {}
    // };
    const _onClose = () => {
        onClose?.();
        setVerifiedFace(null);
        faceDetectHook.reset();
    };

    const checkFace = async (key) => {
        try {
            const formSubmit = {
                phoneNumber: user?.phoneNumber,
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

    const onSignContract = async () => {
        try {
            let key = verifiedFace.objectKey;
            if (!key) {
                key = await uploadImgHook.uploadImg(verifiedFace.referenceImage);
            }
            await checkFace(key);

            await signContractByUnderwriter(contractId, {
                pof: key,
                idToken: faceDetectHook?.otpToken,
                faceToken: faceDetectHook?.faceToken,
                phoneNumber: faceDetectHook?.otpToken ? user?.phoneNumber : null,
            });
            EventRegister.emit(EVENT_NAME.refreshContract);
            EventRegister.emit(EVENT_NAME.activeContractSuccess);
            _onClose?.();
        } catch (error) {
            showErr(error);
        }
    };

    return (
        <Modal isVisible={isOpen} safeAreaTop={true} onBackdropPress={_onClose}>
            <Box
                justifyContent="center"
                alignItems="center"
                borderRadius="8px"
                bgColor="white"
                mt="auto"
                py="25px"
            >
                <ModalCloseButton onClose={_onClose} />
                <Text px="20px" fontSize={'16px'} fontWeight={600} textAlign={'left'} w="full">
                    {t('contract.activeContract')}
                </Text>
                {!verifiedFace && (
                    <Box px="20px" w="full" mt="30px">
                        {/* <FaceRecognition onVerified={(data) => setVerifiedFace(data)} /> */}
                        {faceDetectHook.Component({
                            onVerified: (data) => setVerifiedFace(data),
                        })}
                    </Box>
                )}
                {verifiedFace && (
                    <Box px="20px" w="full">
                        <ReviewPhotoStep
                            _containerStyle={{
                                w: 'full',
                            }}
                            uri={verifiedFace.referenceImage}
                            onSubmit={onSignContract}
                            onRetake={() => {
                                setVerifiedFace(null);
                            }}
                            showRetake={faceDetectHook.step === 2}
                        />
                    </Box>
                )}
            </Box>
        </Modal>
    );
}

// const styles = StyleSheet.create({
//     closeButton: {
//         padding: 5,
//     },
// });
