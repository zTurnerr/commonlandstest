/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useEffect, useState } from 'react';
import { Box, Text } from 'native-base';
import { WebView } from 'react-native-webview';
import Constants, { getStorage } from '../../util/Constants';
import useUserInfo from '../../hooks/useUserInfo';
import { StyleSheet } from 'react-native';
import TakePhotoStep from '../Contract/SignByPass/TakePhotoStep';
import { useCamera } from '../Camera';
import GetPinForm from '../../screen/Welcome/GetPinForm';
import useTranslate from '../../i18n/useTranslate';
import FaceDetectFail from './ModalFaceDetectFail';
import { getBackendServer } from '../../rest_client/index';
export const useFaceDetect = () => {
    const [faceToken, setFaceToken] = useState('');
    const [otpToken, setOtpToken] = useState('');
    const [step, setStep] = useState(0);

    const reset = () => {
        setFaceToken('');
        setOtpToken('');
        setStep(0);
    };

    const Component = ({
        onVerified,
        phoneNumber,
        onError,
        needTakePhoto = true,
        mainBtnText,
        isModalFail,
        GetPinFormContainerProps = {},
        showSubmitPinButton = true,
        LoadingOtpComponent,
        SubmitPinButton,
        OtpCodeContainer,
        showSentCodeMessage = true,
    }) => {
        return (
            <Index
                setFaceToken={setFaceToken}
                setOtpToken={setOtpToken}
                onVerified={onVerified}
                phoneNumber={phoneNumber}
                onError={onError}
                step={step}
                setStep={setStep}
                needTakePhoto={needTakePhoto}
                mainBtnText={mainBtnText}
                isModalFail={isModalFail}
                GetPinFormContainerProps={GetPinFormContainerProps}
                showSubmitPinButton={showSubmitPinButton}
                LoadingOtpComponent={LoadingOtpComponent}
                SubmitPinButton={SubmitPinButton}
                OtpCodeContainer={OtpCodeContainer}
                showSentCodeMessage={showSentCodeMessage}
            />
        );
    };

    return {
        Component,
        faceToken,
        otpToken,
        reset,
        step,
        setStep,
    };
};

export default function Index({
    onVerified,
    phoneNumber,
    onError,
    setFaceToken,
    setOtpToken,
    step,
    setStep,
    needTakePhoto = true,
    mainBtnText,
    isModalFail,
    GetPinFormContainerProps,
    showSubmitPinButton = true,
    LoadingOtpComponent,
    SubmitPinButton,
    OtpCodeContainer,
    showSentCodeMessage = true,
}) {
    const mapRef = useRef();
    const user = useUserInfo();
    const [accessToken, setAccessToken] = useState();
    const cameraHook = useCamera();
    const [errTime, setErrTime] = useState(0);
    const t = useTranslate();
    const initData = async () => {
        let access_token = await getStorage(Constants.STORAGE.access_token);
        setAccessToken(access_token);
    };
    const getBEUrl = () => {
        const url = getBackendServer();
        return url;
    };
    useEffect(() => {
        initData();
    }, []);

    useEffect(() => {
        if (!cameraHook.img) return;
        onVerified && onVerified({ referenceImage: cameraHook.img?.uri });
    }, [cameraHook.img]);

    function onMessage(event) {
        try {
            let data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'success') {
                // success
                onVerified && onVerified(data.data);
                let tmpEvent = { ...event, nativeEvent: JSON.parse(event.nativeEvent.data) };
                setFaceToken(tmpEvent?.nativeEvent?.data?.accessToken);
            }
            if (data.type === 'error') {
                // error
                if (errTime === 1) {
                    setStep(-1);
                    setErrTime(0);
                } else {
                    setErrTime(errTime + 1);
                }

                onError && onError(data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getTitle = () => {
        switch (step) {
            case 1:
                return null;
            case 2:
                return t('contract.takePhotoOfFace');

            case 0:
                return 'Detect your face';
            default:
                return '';
        }
    };

    return (
        <Box w="full" mt="12px" top="0px">
            <Text mb="30px" fontSize="14px" textAlign="center" fontWeight="500">
                {getTitle()}
            </Text>
            {step === -1 && (
                <FaceDetectFail
                    onYes={() => {
                        setStep(1);
                    }}
                    onNo={() => {
                        setStep(0);
                    }}
                    mainBtnText={mainBtnText}
                    isModal={isModalFail}
                />
            )}
            {step === 0 && (
                <Box h="450px" w="full" borderRadius="12px">
                    {phoneNumber || user.phoneNumber ? (
                        <WebView
                            ref={(_ref) => {
                                mapRef.current = _ref;
                            }}
                            autoManageStatusBarEnabled={false}
                            javaScriptEnabled
                            startInLoadingState
                            domStorageEnabled
                            overScrollMode={'never'}
                            originWhitelist={['*']}
                            allowsInlineMediaPlayback
                            source={{
                                uri: `${getBEUrl()}face-rekog/?access_token=${accessToken}&phone=${phoneNumber ? phoneNumber?.slice(1) : user?.phoneNumber?.slice(1)}`,
                            }}
                            style={styles.webview}
                            onMessage={onMessage}
                            onError={(e) => {
                                console.log(e);
                            }}
                            injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.8, maximum-scale=0.8, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
                            scalesPageToFit={true}
                        />
                    ) : (
                        ''
                    )}
                </Box>
            )}
            {step === 1 && (
                <GetPinForm
                    phoneNumberProp={phoneNumber || user.phoneNumber}
                    type="resetPassword"
                    containerProps={{
                        w: 'full',
                        h: '450px',
                        position: 'relative',
                        top: '-30px',
                        px: '0px',
                        scrollEnabled: false,
                        ...GetPinFormContainerProps,
                    }}
                    noPhoneInput={true}
                    onVerifiedOTP={(phone, idToken) => {
                        if (needTakePhoto) {
                            setStep(2);
                        }
                        setOtpToken(idToken);
                        if (!needTakePhoto) {
                            onVerified && onVerified();
                        }
                    }}
                    otpInputStyle={{ width: '100%' }}
                    showSubmitPinButton={showSubmitPinButton}
                    LoadingComponent={LoadingOtpComponent}
                    SubmitPinButton={SubmitPinButton}
                    OtpCodeContainer={OtpCodeContainer}
                    showSentCodeMessage={showSentCodeMessage}
                />
            )}
            {step === 2 && needTakePhoto && (
                <TakePhotoStep
                    _cameraContainer={{
                        left: '0px',
                        w: 'full',
                    }}
                    cameraHook={cameraHook}
                />
            )}
        </Box>
    );
}

const styles = StyleSheet.create({
    webview: {
        width: '100%',
        height: '100%',
        opacity: 0.99,
        backgroundColor: 'transparent',
    },
});
