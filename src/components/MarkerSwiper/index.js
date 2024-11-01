import useTranslate from '../../i18n/useTranslate';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, { useRef } from 'react';
import { Box, Center, Text, Icon } from 'native-base';
import { SCREEN_WIDTH } from '../../util/Constants';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const width = SCREEN_WIDTH;
export default function Index({ onChange, value, data, swiperRef = {} }) {
    const swiper = useRef();
    const t = useTranslate();

    return (
        <Box h="100px">
            <SwiperFlatList
                ref={(_ref) => {
                    swiper.current = _ref;
                    swiperRef.current = _ref;
                }}
                data={data}
                onChangeIndex={(e) => {
                    onChange(e.index);
                }}
                index={value}
            >
                {data.map((item, index) => {
                    return (
                        <Center key={index} w={width}>
                            <Text fontSize="14px" fontWeight="bold">
                                {t('components.boundaryMarker')} {index + 1}:
                            </Text>
                            <Text fontSize="14px">
                                {item[0]}°‎, {item[1]}°‎
                            </Text>
                        </Center>
                    );
                })}
            </SwiperFlatList>
            <Box position="absolute" top="30px" left="6px">
                <TouchableOpacity
                    onPress={() => {
                        let index = value - 1;
                        if (index < 0) {
                            index = data.length - 1;
                        }
                        swiper.current.scrollToIndex({ index });
                    }}
                >
                    <Icon
                        as={<MaterialCommunityIcons name="chevron-left-circle-outline" />}
                        size={5}
                        color="primary.600"
                    ></Icon>
                </TouchableOpacity>
            </Box>
            <Box position="absolute" top="30px" right="6px">
                <TouchableOpacity
                    onPress={() => {
                        let index = value + 1;
                        if (index > data.length - 1) {
                            index = 0;
                        }
                        swiper.current.scrollToIndex({ index });
                    }}
                >
                    <Icon
                        as={<MaterialCommunityIcons name="chevron-right-circle-outline" />}
                        size={5}
                        color="primary.600"
                    ></Icon>
                </TouchableOpacity>
            </Box>
        </Box>
    );
}
