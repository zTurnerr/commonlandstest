import { Box, Text, useDisclose, useTheme } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Setting from '../../../components/Icons/Setting';
import useTranslate from '../../../i18n/useTranslate';
import SheetActions from './SheetActions';

export default function Index({ permissions, onSelect, plotData, isFlagged }) {
    const { isOpen, onOpen, onClose } = useDisclose();
    const { colors } = useTheme();
    const t = useTranslate();

    return (
        <>
            <TouchableOpacity onPress={onOpen}>
                <Box flexDirection="row" alignItems="center" mr="12px">
                    <Setting color={colors.primary[500]} />
                    <Text fontWeight="500" ml="4px" color="primary.500">
                        {t('plotInfo.settings')}
                    </Text>
                </Box>
            </TouchableOpacity>
            <SheetActions
                isOpen={isOpen}
                onClose={onClose}
                permissions={permissions}
                onSelect={onSelect}
                plotData={plotData}
                isFlagged={isFlagged}
            />
        </>
    );
}
