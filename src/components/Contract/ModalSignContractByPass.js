import { Box, Center, CloseIcon, HStack, Spinner, Text, VStack, Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import { useFaceDetect } from '../../components/FaceRecognition';
import { EVENT_NAME } from '../../constants/eventName';
import useUploadImg from '../../hooks/useUploadImg';
import useUserInfo from '../../hooks/useUserInfo';
import useTranslate from '../../i18n/useTranslate';
import { faceDetect, signContractV2 } from '../../rest_client/apiClient';
import { refetchContractToShowSigner } from '../../util/contractObject';
import { showErr } from '../../util/showErr';
import { useNoTxtTab } from '../Tabs/NoTxtTab';
import ReviewPhotoStep from './SignByPass/ReviewPhotoStep';
import SignNoPassStep from './SignByPass/SignNoPassStep';
import Signature from '../Icons/Signature';
// import SignByPassStep from './SignByPass/SignByPassStep';
// import FaceRecognition from '../../components/FaceRecognition';

export const useModalSignContractByPass = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSigner, setSelectedSigner] = useState({});

    const open = (signer) => {
        setIsOpen(true);
        setSelectedSigner(signer);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = ({ isCancel, signingContract, onSubmit, contractId, contract }) => {
        return (
            <ModalSignContractByPass
                isVisible={isOpen}
                onClose={close}
                onSubmit={onSubmit}
                isCancel={isCancel}
                signingContract={signingContract}
                contractId={contractId}
                signer={selectedSigner}
                contract={contract}
            />
        );
    };

    return {
        open,
        close,
        Component,
    };
};

const ModalSignContractByPass = ({ isVisible, onClose, contractId, signer }) => {
    const noTxtTabHook = useNoTxtTab();
    const dim = useWindowDimensions();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [signErr, setSignErr] = useState('');
    const [verifiedFace, setVerifiedFace] = React.useState(null);
    const user = useUserInfo();
    const uploadImgHook = useUploadImg();
    const faceDetectHook = useFaceDetect();
    const handelCloseModal = () => {
        setVerifiedFace(null);
        setPassword('');
        noTxtTabHook.onChangeIndex(0);
        EventRegister.emit(EVENT_NAME.refreshContract);
        onClose?.();
        setLoading(false);
        faceDetectHook.reset();
    };

    // const validate = () => {
    //     if (!password) {
    //         setSignErr('Password is required');
    //         return false;
    //     }
    //     if (moment().isAfter(moment(signer?.expiresAt))) {
    //         setSignErr('Invitation is expired');
    //         return false;
    //     }
    //     return true;
    // };

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

    const onSign = async () => {
        setLoading(true);
        try {
            let key = verifiedFace?.objectKey;
            if (!key) {
                key = await uploadImgHook.uploadImg(verifiedFace?.referenceImage);
            }
            await checkFace(key);
            let dataSubmit = {
                userId: signer?.receiver?._id || user?._id,
                pof: key,
                phoneNumber: faceDetectHook?.otpToken
                    ? signer?.receiver?.phoneNumber || user?.phoneNumber
                    : null,
                idToken: faceDetectHook?.otpToken,
                faceToken: faceDetectHook?.faceToken,
            };
            await signContractV2(contractId, dataSubmit, null, null);
            refetchContractToShowSigner(
                contractId,
                signer?.receiver?._id || user?._id,
                handelCloseModal,
            );
        } catch (error) {
            console.log(error);
            showErr(error);
            setSignErr(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (faceDetectHook.otpToken) {
        }
    }, [faceDetectHook.otpToken]);

    const renderStep = () => {
        if (!verifiedFace && [0, -1, 2].includes(faceDetectHook.step)) {
            return faceDetectHook.Component({
                onVerified: (data) => setVerifiedFace(data),
                phoneNumber: signer?.receiver?.phoneNumber || user?.phoneNumber,
                mainBtnText: 'faceDetect.signWithOTP',
                needTakePhoto: true,
            });
        }
        if (noTxtTabHook.index === 0 && verifiedFace?.referenceImage) {
            return (
                <ReviewPhotoStep
                    uri={verifiedFace.referenceImage}
                    onSubmit={onSign}
                    showRetake={faceDetectHook.step === 2}
                    onRetake={() => setVerifiedFace(null)}
                    loadingProp={loading}
                />
            );
        }

        return (
            // <SignByPassStep
            //     passwordObj={{
            //         password,
            //         setPassword,
            //     }}
            //     onSubmit={onSign}
            //     signer={signer}
            //     loading={loading}
            //     err={signErr}
            //     onBack={() => {
            //         noTxtTabHook.onChangeIndex(0);
            //     }}
            // />
            <SignNoPassStep
                passwordObj={{
                    password,
                    setPassword,
                }}
                onSubmit={() => {
                    setLoading(true);
                    EventRegister.emit(EVENT_NAME.submitOtp);
                }}
                signer={signer}
                loading={loading}
                btnText={faceDetectHook.step === 1 ? 'button.submitAndSign' : 'button.sign'}
                err={signErr}
                showSubmitButton={false}
                MiddleSectionProp={
                    <VStack alignItems={'center'}>
                        <Text fontWeight={500} mt="30px">
                            {t('auth.numberDigit')}{' '}
                        </Text>
                        <Text fontWeight={500}>
                            {signer?.receiver?.phoneNumber || user?.phoneNumber}
                        </Text>
                        {faceDetectHook.Component({
                            onVerified: (data) => setVerifiedFace(data),
                            phoneNumber: signer?.receiver?.phoneNumber || user?.phoneNumber,
                            mainBtnText: 'faceDetect.signWithOTP',
                            needTakePhoto: true,
                            GetPinFormContainerProps: {
                                h: '200px',
                                w: null,
                            },
                            LoadingOtpComponent: (
                                <Center pb="30px">
                                    <Spinner />
                                </Center>
                            ),
                            showSentCodeMessage: false,
                            OtpCodeContainer: Center,
                            SubmitPinButton: (props) => {
                                return (
                                    <Button
                                        textColor={'white'}
                                        isLoading={loading}
                                        alignItems={'center'}
                                        justifyContent={'center'}
                                        {...props}
                                        w="full"
                                    >
                                        <HStack
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                            space={2}
                                        >
                                            <Signature width="20" height="20" color="white" />
                                            <Text color="white" fontSize={'14px'} fontWeight={700}>
                                                {t('button.submitAndSign')}
                                            </Text>
                                        </HStack>
                                    </Button>
                                );
                            },
                        })}
                    </VStack>
                }
            />
        );
    };
    const t = useTranslate();

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
                    <TouchableOpacity
                        disabled={loading}
                        onPress={handelCloseModal}
                        style={styles.closeButton}
                    >
                        <CloseIcon />
                    </TouchableOpacity>
                </Box>
                <Text mb="15px" fontSize={'16px'} fontWeight={600}>
                    {t('contract.signContract')}
                </Text>
                {/* {noTxtTabHook.Component()} */}
                {renderStep()}
            </Box>
        </Modal>
    );
};

export default ModalSignContractByPass;

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
