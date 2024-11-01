import { Alert, Center, Slide, Text } from 'native-base';
import React, { useEffect, useState } from 'react';

export const useErrorAlert = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');

    const showErrorAlert = (text) => {
        setIsOpen(true);
        setText(text);
    };

    const closeErrorAlert = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                setIsOpen(false);
            }, 5000);
        }
    }, [isOpen]);

    const Component = () => {
        return <ErrorAlert isOpen={isOpen} text={text} />;
    };

    return {
        showErrorAlert,
        closeErrorAlert,
        Component,
    };
};

const ErrorAlert = ({ isOpen, text }) => {
    return (
        <Slide in={isOpen} placement="top">
            <Alert justifyContent="center" status="error" safeAreaTop={8}>
                <Center flexDirection={'row'} position={'absolute'}>
                    <Alert.Icon />
                    <Text ml="10px" color="error.600" fontWeight="medium">
                        {text}
                    </Text>
                </Center>
            </Alert>
        </Slide>
    );
};

export default ErrorAlert;
