/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Box, FlatList, Image, Skeleton, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import EmptyText from '../../../components/EmptyText';
import useTranslate from '../../../i18n/useTranslate';

export default function Index({ images, onImagePress = () => {}, imageActive, isLoading }) {
    const t = useTranslate();
    if (!images) {
        return null;
    }
    const substr = (string) => {
        return string.toString().substring(0, 8);
    };
    const renderImage = ({ item, index }) => {
        if (isLoading) {
            return (
                <Skeleton key={index} borderRadius="12px" mt="20px" w="230px" h="150px" mr="12px" />
            );
        }

        const active = JSON.stringify(item) === JSON.stringify(imageActive);
        return (
            <TouchableOpacity key={item.uri} onPress={() => onImagePress(item)} activeOpacity={0.7}>
                <Box
                    mr="12px"
                    background="gray.200"
                    w="230px"
                    h="150px"
                    borderRadius="12px"
                    overflow="hidden"
                    mt="20px"
                    borderWidth="2px"
                    mb="4px"
                    borderColor={active ? 'primary.500' : 'transparent'}
                >
                    <Image w="full" h="full" alt="image" source={{ uri: item.uri }} />
                    <Box
                        position="absolute"
                        bgColor={active ? 'primary.500' : 'white'}
                        bottom="12px"
                        minW="170px"
                        maxW="200px"
                        borderRadius="30px"
                        left="12px"
                        px="12px"
                        py="4px"
                        shadow={9}
                        flexDirection="row"
                    >
                        <Text
                            fontSize="10px"
                            fontWeight="bold"
                            color={active ? 'white' : 'text.primary'}
                        >
                            {item.label}:
                        </Text>
                        <Text fontSize="10px" color={active ? 'white' : 'text.primary'}>
                            {substr(item.points[0])}&#176;, {substr(item.points[1])}
                            &#176;
                        </Text>
                    </Box>
                </Box>
            </TouchableOpacity>
        );
    };
    return (
        <Box w="full">
            <FlatList
                w="full"
                horizontal
                overScrollMode="never"
                data={isLoading ? [{ uri: 1 }, { uri: 2 }, { uri: 3 }] : images}
                renderItem={renderImage}
                keyExtractor={(item, index) => {
                    return item.uri + index;
                }}
            ></FlatList>
            {!images.length && !isLoading && <EmptyText text={t('plot.noPhotos')} />}
        </Box>
    );
}
