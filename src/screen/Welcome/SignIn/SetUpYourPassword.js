import { Actionsheet, Checkbox, Flex, Image, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Button from '../../../components/Button';
import useTranslate from '../../../i18n/useTranslate';
import LogoColor from '../../../images/logoColor.png';
import Constants, { getStorage, setStorage } from '../../../util/Constants';

export default function Index() {
    const [isOpen, setIsOpen] = useState(false);
    const [doNotShow, setDoNotShow] = useState(false);
    const onClose = () => {
        setIsOpen(false);
        if (doNotShow) {
            setStorage(Constants.STORAGE.doNotShowSetUpPassword, 'true');
        }
    };
    const initState = async () => {
        try {
            let doNotShowSetUpPassword = await getStorage(Constants.STORAGE.doNotShowSetUpPassword);
            setIsOpen(!doNotShowSetUpPassword);
        } catch (err) {}
    };
    useEffect(() => {
        initState();
    }, []);
    const t = useTranslate();
    return (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content>
                <Flex {...styles.content}>
                    <Image source={LogoColor} alt="logo" mb="24px" />
                    <Text {...styles.title}>{t('auth.setUpPassword')}</Text>
                    <Text {...styles.description}>{t('auth.contentSetUpPassword')}</Text>
                    <Flex {...styles.checkbox}>
                        <Checkbox
                            aria-label="show"
                            defaultIsChecked={doNotShow}
                            isChecked={doNotShow}
                            onChange={(e) => {
                                setDoNotShow(e);
                            }}
                            borderColor="#606060"
                        />
                        <Text ml="12px">{t('auth.dontShowAgain')}</Text>
                    </Flex>

                    <Button
                        onPress={() => {
                            onClose();
                        }}
                        _container={{ mb: '20px' }}
                    >
                        {t('button.done')}
                    </Button>
                </Flex>
            </Actionsheet.Content>
        </Actionsheet>
    );
}

const styles = StyleSheet.create({
    content: {
        width: 'full',
        padding: '12px',
        alignItems: 'center',
    },
    title: {
        color: 'rgba(24, 24, 27, 1)',
        fontWeight: 'bold',
        fontSize: '16px',
        marginBottom: '10px',
    },
    description: {
        fontWeight: '500',
        fontSize: '14px',
        marginBottom: '44px',
        textAlign: 'center',
        color: 'rgba(24, 24, 27, 0.6)',
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: 'full',
        marginBottom: '18px',
    },
});
