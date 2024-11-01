import useTranslate from '../../i18n/useTranslate';
import { Box, Icon, Image, ScrollView, Text } from 'native-base';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import { TouchableOpacity } from 'react-native';
import learnTakePhoto1 from '../../images/SnappingSystem2.png';
import learnTakePhoto2 from '../../images/SnappingSystem1.png';
import AgentHeader from '../../components/Header/AgentHeader';

export default function Index({ isOpen, onClose }) {
    const t = useTranslate();

    return !isOpen ? null : (
        <Box h="full" zIndex="100" w="full" position="absolute" bg="white">
            <AgentHeader />
            <TouchableOpacity onPress={onClose}>
                <Box
                    flexDir="row"
                    alignItems="center"
                    pt="12px"
                    pb="12px"
                    borderBottomColor="divider"
                    borderBottomWidth="1px"
                >
                    <Icon
                        as={<MaterialCommunityIcons name="close" />}
                        size={5}
                        mr="4px"
                        ml={'20px'}
                        color="text.primary"
                    />
                    <Text fontSize="16px" fontWeight="500">
                        {t('snap.snappingSystem')}
                    </Text>
                </Box>
            </TouchableOpacity>
            <ScrollView>
                <Box px="20px" mt="12px">
                    <Text mb="12px" fontWeight="bold" fontSize="12px">
                        {t('components.overview')}
                    </Text>
                    <Text>{t('snap.snapContent')}</Text>
                    <Text mt={'20px'}>{t('snap.snapHelp')}</Text>
                    <Text mt="12px" fontWeight="600">
                        {t('snap.snapStep')}:
                    </Text>
                    <Text mt="12px">{t('snap.snap1')}</Text>
                </Box>
                <Box
                    bg="rgba(244, 244, 244, 1)"
                    mt="15px"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Image w="full" alt="graph" source={learnTakePhoto1} />
                </Box>
                <Text mt="18px" px="20px">
                    <Text>{t('snap.snap2')}</Text>
                </Text>

                <Box mt="18px" alignItems="center" justifyContent="center" w="full">
                    <Image w="full" alt="graph" source={learnTakePhoto2} />
                </Box>
            </ScrollView>
        </Box>
    );
}
