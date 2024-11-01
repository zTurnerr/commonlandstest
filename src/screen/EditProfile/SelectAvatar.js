import useTranslate from '../../i18n/useTranslate';
import React from 'react';
import { Box, Text, Actionsheet } from 'native-base';
import { TouchableOpacity } from 'react-native';
const styles = {
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        mb: '8px',
    },
};
export default function Index({ isOpen, onClose, startCamera, selectImage }) {
    const t = useTranslate();
    return (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content alignItems="flex-start" px="12px">
                <TouchableOpacity onPress={startCamera}>
                    <Box
                        {...styles.row}
                        px="12px"
                        py="12px"
                        borderBottomColor="divider"
                        // borderBottomWidth="1px"
                    >
                        <Text fontWeight="500" textAlign="center" w="full">
                            {t('components.takeAPhoto')}
                        </Text>
                    </Box>
                </TouchableOpacity>
                <TouchableOpacity onPress={selectImage}>
                    <Box {...styles.row} px="12px" py="12px">
                        <Text fontWeight="500" textAlign="center" w="full">
                            {t('components.selectGallery')}
                        </Text>
                    </Box>
                </TouchableOpacity>
            </Actionsheet.Content>
        </Actionsheet>
    );
}
