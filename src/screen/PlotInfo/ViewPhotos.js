/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Box, Center, Icon, Image, Text } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MarkerSwiper from '../../components/MarkerSwiper';
import useTranslate from '../../i18n/useTranslate';
import { SCREEN_WIDTH, SEND_TYPE, initSource } from '../../util/Constants';

const width = SCREEN_WIDTH;

const Button = ({ onPress, icon, ...other }) => {
    return (
        <Box
            position="absolute"
            top="50%"
            width="40px"
            h="40px"
            bg="white"
            alignItems="center"
            justifyContent="center"
            borderRadius="20px"
            shadow={2}
            transform={[{ translateY: -20 }]}
            {...other}
        >
            <TouchableOpacity onPress={onPress}>
                <Icon
                    as={<MaterialCommunityIcons name={icon} />}
                    size={5}
                    color="text.primary"
                ></Icon>
            </TouchableOpacity>
        </Box>
    );
};

export default function Index({
    sendMessage,
    plotData,
    files,
    points,
    activePoint = 0,
    imageActiveIndex = 0,
}) {
    const t = useTranslate();
    const [indexCoordinateActive, setIndexCoordinateActive] = useState(activePoint);
    const [imageActive, setImageActive] = useState(imageActiveIndex || 0);
    const swiperRef = useRef();
    const swiperImage = useRef();
    useEffect(() => {
        if (plotData?.plot) {
            sendMessage({
                type: SEND_TYPE.addSource,
                source: getSource(plotData.plot),
            });
        }
    }, [plotData]);
    useEffect(() => {
        try {
            if (points) {
                addSourceDefault(activePoint);
                addSourceSelected(activePoint);
            }
        } catch (err) {
            // setError(err?.message || err);
        }
    }, [points]);

    useEffect(() => {
        return () => {
            setIndexCoordinateActive(0);
            addSourceDefault(-1);
            addSourceSelected(-1);
            sendMessage({
                type: SEND_TYPE.addSource,
                source: getSource(null),
            });
        };
    }, []);
    const getSource = (plot) => {
        let source = initSource({
            plots: !plot ? [] : [plot],
            type: 'selected',
            id: 'new_plot',
        });

        return source;
    };

    const getSelectedPoint = (index = indexCoordinateActive) => {
        return points.filter((e, i) => i === index);
    };
    const getDefailtPoint = (index = indexCoordinateActive) => {
        return points.filter((e, i) => {
            return i !== index && (!files[i] || !files[i].length);
        });
    };

    const addSourceDefault = (index) => {
        let p = getDefailtPoint(index);
        let source = initSource({
            points: isHide(index) ? [] : p,
            type: 'default',
            id: 'source_point_default',
        });
        sendMessage({
            type: SEND_TYPE.addSource,
            source,
        });
    };
    const isHide = (index) => {
        return index === -1;
    };
    const addSourceSelected = (index) => {
        let p = getSelectedPoint(index);
        let source = initSource({
            points: isHide(index) ? [] : p,
            type: 'selected',
            id: 'source_point_selected',
        });
        sendMessage({
            type: SEND_TYPE.addSource,
            source,
        });
    };
    const onCoordinateChange = (index) => {
        if (index === indexCoordinateActive) {
            return;
        }
        setImageActive(0);
        swiperImage?.current?.scrollToIndex({ index: 0 });
        setIndexCoordinateActive(index);
        addSourceDefault(index);
        addSourceSelected(index);
    };
    const activeFile = files[indexCoordinateActive];
    return (
        <Box>
            <MarkerSwiper
                swiperRef={swiperRef}
                data={points}
                onChange={onCoordinateChange}
                value={indexCoordinateActive}
                padding={20}
            />
            <Box px="24px">
                <Text textAlign="left" my="12px" fontWeight="500">
                    {t('plot.description')}
                </Text>
                <Box borderWidth="1px" borderColor="#C5C6CC" borderRadius="12px" p="12px">
                    <Text color="#8F9098">
                        {activeFile.description ||
                            `${t('plot.descriptionMarker')} ` + (indexCoordinateActive + 1)}
                    </Text>
                </Box>
            </Box>
            {activeFile?.images?.length ? (
                <Box h="250px" mt="24px">
                    <SwiperFlatList
                        ref={(_ref) => {
                            swiperImage.current = _ref;
                        }}
                        data={activeFile.images}
                        onChangeIndex={(e) => {
                            setImageActive(e.index);
                        }}
                        index={imageActive}
                    >
                        {activeFile.images.map((item, index) => {
                            return (
                                <Center key={index} w={width} px="20px">
                                    <Image
                                        source={{ uri: item.uri }}
                                        alt="image"
                                        w="100%"
                                        h="100%"
                                        borderRadius="8px"
                                    />
                                </Center>
                            );
                        })}
                    </SwiperFlatList>
                    <Button
                        icon="chevron-left"
                        left="4px"
                        onPress={() => {
                            let index = imageActive - 1;
                            if (index < 0) {
                                index = activeFile.images.length - 1;
                            }
                            swiperImage?.current?.scrollToIndex({ index });
                        }}
                    />
                    <Button
                        icon="chevron-right"
                        right="4px"
                        onPress={() => {
                            let index = imageActive + 1;
                            if (index > activeFile.images.length - 1) {
                                index = 0;
                            }
                            swiperImage?.current?.scrollToIndex({ index });
                        }}
                    />
                </Box>
            ) : null}
        </Box>
    );
}
