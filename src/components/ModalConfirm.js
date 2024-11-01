import { Box, Text, useTheme } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const ModalConfirm = ({ isVisible, title = '', content = '', titleButton = 'OK', onPressOk }) => {
    const { colors } = useTheme();

    return (
        <Modal style={styles.modal} isVisible={isVisible} onBackdropPress={onPressOk}>
            <Box
                px={'21px'}
                py={'25px'}
                backgroundColor={colors.white}
                borderRadius={'12px'}
                shadow={1}
            >
                <Text fontWeight={'700'} fontSize={'14px'} mb={'10px'}>
                    {title}
                </Text>
                <Text fontWeight={'400'} fontSize={'12px'}>
                    {content}
                </Text>
                <TouchableOpacity style={styles.btnOke} onPress={onPressOk}>
                    <Text color={colors.primary[600]} fontWeight={'700'} fontSize={'14px'}>
                        {titleButton}
                    </Text>
                </TouchableOpacity>
            </Box>
        </Modal>
    );
};

export default ModalConfirm;

const styles = StyleSheet.create({
    modal: {
        margin: 22,
    },
    btnOke: {
        alignItems: 'flex-end',
        marginTop: 24,
    },
});
