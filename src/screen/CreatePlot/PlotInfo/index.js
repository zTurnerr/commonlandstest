/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Box, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../../i18n/useTranslate';

export default function Index() {
    const t = useTranslate();
    return (
        <Box px="24px" py="24px">
            {/* <Text
                fontWeight="700"
                fontSize="12px"
                mb="8px"
                color="rgba(143, 144, 152, 1)"
            >
                Plot Name
            </Text>
            <Input
                value={plotData.name}
                isReadOnly
                mb="15px"
                bgColor="#F0F0F0"
                color="rgba(197, 198, 204, 1)"
            />
            <Text
                fontWeight="700"
                fontSize="12px"
                mb="8px"
                color="rgba(143, 144, 152, 1)"
            >
                Plot ID
            </Text>
            <Input
                value={plotData.id}
                isReadOnly
                mb="15px"
                bgColor="#F0F0F0"
                color="rgba(197, 198, 204, 1)"
            /> */}
            <Text fontWeight="700" fontSize="12px" mb="8px">
                {t('plot.uploadPhotos')}
            </Text>
            {/* <Text fontSize="12px">
                Tap on plot marker to upload photos so other people can find it.
            </Text> */}
        </Box>
    );
}
