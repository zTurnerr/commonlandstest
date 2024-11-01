/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import { Box, Image } from 'native-base';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function Index({ data, onDelete, style = {} }) {
    return (
        <Box shadow={6} w="100px" h="100px" mr="12px" style={style} mt="12px">
            <Box
                w="24px"
                h="24px"
                borderRadius="12px"
                bgColor="rgba(73, 96, 108, 1)"
                position="absolute"
                right={-6}
                zIndex={3}
                top={-6}
                alignItems="center"
                justifyContent="center"
                shadow={6}
            >
                <TouchableOpacity
                    w="full"
                    h="full"
                    onPress={() => {
                        onDelete(data);
                    }}
                >
                    <MaterialCommunityIcons name="close" size={20} color="white" />
                </TouchableOpacity>
            </Box>

            <Box borderRadius="12px" w="full" h="full" overflow="hidden">
                <Image source={{ uri: data.uri }} alt={data.fileName || 'alt'} w="full" h="full" />
            </Box>
        </Box>
    );
}
