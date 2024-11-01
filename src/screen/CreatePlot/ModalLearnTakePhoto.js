import useTranslate from '../../i18n/useTranslate';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Actionsheet, Box, Image, ScrollView, Text } from 'native-base';
import React from 'react';
import learnTakePhoto1 from '../../images/learnTakePhoto1.png';
import learnTakePhoto2 from '../../images/learnTakePhoto2.png';

export default function Index({ isOpen, onClose }) {
    const t = useTranslate();
    return (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content alignItems="flex-start" px="12px">
                <Box h="full" w="full" p="12px">
                    <ScrollView>
                        <Text fontWeight="bold" fontSize="16px">
                            {t('others.howToTake')}
                        </Text>
                        <Text>{t('others.twoWaysTakePhotos')}: </Text>
                        <Text mt="12px">{t('others.takePhoto1')}</Text>
                        <Box
                            bg="rgba(244, 244, 244, 1)"
                            mt="12px"
                            borderRadius="12px"
                            alignItems="center"
                            justifyContent="center"
                            p="12px"
                        >
                            <Image alt="graph" source={learnTakePhoto1} />
                        </Box>
                        <Text mt="18px">{t('others.takePhoto2')}</Text>
                        <Box
                            bg="rgba(244, 244, 244, 1)"
                            mt="12px"
                            borderRadius="12px"
                            alignItems="center"
                            justifyContent="center"
                            p="12px"
                        >
                            <Image alt="graph" source={learnTakePhoto2} />
                        </Box>
                    </ScrollView>
                </Box>
            </Actionsheet.Content>
        </Actionsheet>
    );
}
