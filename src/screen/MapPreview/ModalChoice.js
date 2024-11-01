import { Box, Input, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Button from '../../components/Button';
import useTranslate from '../../i18n/useTranslate';

const ModalChoice = ({ open, setOpen, rename = false, approve, displayName }) => {
    const [text, setText] = useState(displayName);
    const t = useTranslate();

    const handleChange = (value) => {
        setText(value);
    };

    const onPressAccept = () => {
        setOpen(false);
        approve(text);
    };

    const onPressCancel = () => {
        setText(displayName);
        setOpen(false);
    };

    useEffect(() => {
        setText(displayName);
    }, [displayName]);

    return (
        <Modal
            isVisible={open}
            onBackdropPress={onPressCancel}
            animationIn="zoomIn"
            animationOut="zoomOut"
            safeAreaTop={true}
        >
            <Box p="20px" borderRadius="16px" bgColor="white">
                {rename ? (
                    <>
                        <Text {...styles.title}>{t('offlineMaps.renameMap')}</Text>
                        <Input
                            mt={3}
                            w={'100%'}
                            onChangeText={handleChange}
                            value={text}
                            placeholder="Enter new name"
                        />
                    </>
                ) : (
                    <>
                        <Text {...styles.title}>{t('offlineMaps.deleteOfflineMap')}</Text>
                        <Text>{t('offlineMaps.deleteOfflineDesc')}</Text>
                    </>
                )}
                <Box justifyContent={'space-between'} flexDir={'row'} mt={5}>
                    <Button
                        onPress={onPressCancel}
                        variant="outline"
                        _container={{
                            w: '48%',
                        }}
                    >
                        {t('button.cancel')}
                    </Button>
                    <Button
                        onPress={onPressAccept}
                        bgColor="primary.600"
                        _container={{
                            w: '48%',
                        }}
                        _pressed={{ bgColor: 'primary.700' }}
                    >
                        {t('button.save')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

const styles = StyleSheet.create({
    title: {
        fontWeight: 600,
        fontSize: 16,
        color: 'black',
    },
    // button: {
    //     backgroundColor: 'transparent',
    //     width: 'auto',
    // },
    // buttonText: {
    //     fontWeight: 700,
    //     fontSize: 14,
    //     color: 'primary.300',
    // },
});

export default ModalChoice;
