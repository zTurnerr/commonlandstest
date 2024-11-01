import useTranslate from '../../i18n/useTranslate';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Box, Text, useTheme } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { getRoleLabel } from '../../util/Constants';
import { Delete } from '../Icons';

const Role = ({ onPress = () => {}, info }) => {
    const { colors } = useTheme();
    return (
        <Box flexDirection="row">
            {/* <TouchableOpacity
                onPress={() => {
                    onPress(info,'qr');
                }}
            >
                <Icon
                    mr="12px"
                    as={<MaterialCommunityIcons name="qrcode-scan" />}
                    size={6}
                />
            </TouchableOpacity> */}
            <TouchableOpacity
                onPress={() => {
                    onPress(info, 'delete');
                }}
            >
                <Delete color={colors.primary[600]} />
            </TouchableOpacity>
        </Box>
    );
};
export default function Index({ info, owner, onPress }) {
    const t = useTranslate();
    return (
        <Box flexDirection="row" alignItems="center" mb="4px" py="12px" w="full">
            <Box ml="10px" flex={1}>
                <Text fontSize="14px" fontWeight="bold">
                    {info.phoneNumber}
                </Text>
                <Text color="primary.900" fontSize="11px" fontWeight="400">
                    {t('components.relationship')}: {getRoleLabel(info.relationship)}
                </Text>
            </Box>
            <Role info={info} owner={owner} onPress={onPress} />
        </Box>
    );
}
