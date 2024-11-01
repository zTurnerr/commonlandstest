import { Box, HStack, Icon, Input, Text } from 'native-base';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import useTranslate from '../../i18n/useTranslate';

const EnterInfoAfterDraw = ({ text, setText, error, setError }) => {
    const t = useTranslate();

    const onTextChange = (value) => {
        setText(value);
        if (value.length > 0) {
            setError('');
        } else {
            setError(t('error.descriptionCannotBeEmpty'));
        }
    };

    return (
        <Box flex={1} px={'16px'}>
            <Text mt={'40px'} fontWeight={600} fontSize={16} color={'text.darkNeutral'}>
                {t('offlineMaps.enterDescriptionOfflinePlot')}
            </Text>
            <Input
                value={text}
                onChangeText={onTextChange}
                mt={'16px'}
                placeholder="Enter description"
            />
            {error?.length > 0 && (
                <Text color={'error.500'} fontWeight={500}>
                    {error}
                </Text>
            )}
            <Box px={'20px'} py={'15px'} mt={'16px'} bgColor={'gray.1100'} borderRadius={'8px'}>
                <HStack>
                    <Box mr={'6px'}>
                        <Icon
                            as={<MaterialCommunityIcons name="information" />}
                            // {...styles.iconInfo}
                            size={6}
                            color={'primary.600'}
                            // bgColor={'primary.600'}
                        />
                    </Box>
                    <Box flex={1}>
                        <Text fontWeight={700} fontSize={12} color={'text.darkNeutral'}>
                            {t('components.tips')}
                        </Text>
                        <Text mt={'6px'} fontSize={12}>
                            {t('offlineMaps.tipDescription')}
                        </Text>
                    </Box>
                </HStack>
            </Box>
        </Box>
    );
};

export default EnterInfoAfterDraw;
