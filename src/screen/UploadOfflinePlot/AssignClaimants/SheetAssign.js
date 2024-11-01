/* eslint-disable react-native/no-inline-styles */
import { Actionsheet, Box, CloseIcon, Flex, Text, useTheme } from 'native-base';
import React from 'react';
import useTranslate from '../../../i18n/useTranslate';
import { TouchableOpacity } from 'react-native';
import { AssignYourself, LookupAssign } from '../../../components/Icons';

const SheetAssign = ({ isOpen, onClose, setAssign }) => {
    const t = useTranslate();
    // t('offlineMaps.lookupAssignPeople')
    //                                 : t('offlineMaps.assignYourself')
    const items = [
        {
            label: t('offlineMaps.assignYourself'),
            value: 'trainer',
            Icon: AssignYourself,
            self: true,
        },
        {
            label: t('offlineMaps.lookupAssignPeople'),
            value: 'owner',
            Icon: LookupAssign,
            self: false,
        },
    ];

    const onPress = (value) => {
        setAssign((prev) => ({ ...prev, self: value }));
        onClose();
    };

    const { colors } = useTheme();
    return (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content>
                <Flex w={'full'}>
                    <Box px={'10px'} py={'10px'}>
                        <Box flexDir={'row'} alignItems={'center'}>
                            <Text fontWeight={700} fontSize={16} flex={1}>
                                {t('components.assignThePeople')}
                            </Text>
                            <TouchableOpacity onPress={onClose}>
                                <CloseIcon size={5} />
                            </TouchableOpacity>
                        </Box>
                        {items.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{ marginTop: 20 }}
                                onPress={() => onPress(item.self)}
                            >
                                <Box flexDir={'row'} alignItems={'center'}>
                                    <Box
                                        mr={'10px'}
                                        bgColor={'appColors.bgPrimary'}
                                        p={'10px'}
                                        borderRadius={'50px'}
                                    >
                                        <item.Icon color={colors.primary[600]} />
                                    </Box>
                                    <Text fontWeight={600} fontSize={12}>
                                        {item.label}
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        ))}
                    </Box>
                </Flex>
            </Actionsheet.Content>
        </Actionsheet>
    );
};

export default SheetAssign;
