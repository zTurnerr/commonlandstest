import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import useTranslate from '../../i18n/useTranslate';

const styles = StyleSheet.create({
    camera: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        //   borderRadius: 12,
    },
});

export const useCamera = () => {
    const camera = useRef();
    const [img, setImg] = useState('');
    const [ready] = useState(false);
    const [takingPic, setTakingPic] = useState(false);

    const takePicture = async () => {
        if (camera.current && !takingPic) {
            let options = {
                quality: 0.85,
                fixOrientation: true,
                forceUpOrientation: true,
            };

            setTakingPic(true);

            try {
                const data = await camera.current.takePictureAsync(options);
                setImg(data);
            } catch (err) {
                return;
            } finally {
                setTakingPic(false);
            }
        }
    };

    const Component = ({ type = RNCamera.Constants.Type.front }) => {
        return <Index camera={camera} type={type} />;
    };

    return {
        Component,
        takePicture,
        img,
        ready,
        setImg,
    };
};

export default function Index({ camera = {}, type = RNCamera.Constants.Type.front, ...other }) {
    const t = useTranslate();
    return (
        <RNCamera
            ref={(ref) => {
                camera.current = ref;
            }}
            // faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
            captureAudio={false}
            style={styles.camera}
            type={type}
            androidCameraPermissionOptions={{
                title: t('components.cameraPermissionTitle'),
                message: t('components.cameraPermissionMessage'),
                buttonPositive: t('button.ok'),
                buttonNegative: t('button.cancel'),
            }}
            {...other}
        />
    );
}
