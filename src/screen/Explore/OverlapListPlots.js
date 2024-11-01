import useTranslate from '../../i18n/useTranslate';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { useNavigation } from '@react-navigation/core';
import { Box, FlatList, Modal, Text, useTheme } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MapIcon } from '../../components/Icons';

export default function Index({ plots, isOpen, onClose, onSelectPlot }) {
    const { colors } = useTheme();
    const [selected, setSelected] = useState(null);
    const navigation = useNavigation();
    const viewDetail = (plot) => {
        try {
            // if (!isLogged) {
            //     return modalContext.onOpenModal();
            // }
            onClose();
            navigation.navigate('PlotInfo', {
                plotID: plot._id,
                longlat: JSON.parse(plot.centroid),
            });
        } catch (err) {}
    };
    const t = useTranslate();
    return (
        <Modal
            isOpen={isOpen}
            safeAreaTop={true}
            onClose={() => {
                onClose();
                onSelectPlot();
                setSelected(null);
            }}
            _backdrop={{
                bgColor: 'transparent',
            }}
        >
            <Modal.Content
                borderRadius="0px"
                position="absolute"
                bottom="66px"
                bg="white"
                shadow={0}
                left="0px"
                maxWidth="100%"
                w="full"
            >
                <Modal.Body p="0px">
                    <Box py="12px">
                        <Text pl="12px" fontWeight="700">
                            {t('explore.plotsOverlapping')}
                        </Text>
                        <FlatList
                            data={plots}
                            horizontal
                            contentContainerStyle={styles.plotList}
                            renderItem={({ item, index }) => {
                                return (
                                    <Box
                                        mr="12px"
                                        key={index}
                                        bgColor="white"
                                        w="120px"
                                        h="130px"
                                        shadow={3}
                                        p="12px"
                                        borderRadius="12px"
                                        borderWidth="2px"
                                        borderColor={
                                            selected === index ? 'primary.400' : 'transparent'
                                        }
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (selected !== index) {
                                                    setSelected(index);
                                                    onSelectPlot(item);
                                                    return;
                                                }
                                                setSelected(null);
                                                onSelectPlot();
                                                viewDetail(item);
                                            }}
                                        >
                                            <Box
                                                justifyContent="center"
                                                alignItems="center"
                                                w="full"
                                                h="full"
                                            >
                                                <Box
                                                    w="40px"
                                                    h="40px"
                                                    borderRadius="20px"
                                                    bgColor="primary.100"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <MapIcon color={colors.primary[600]} />
                                                </Box>
                                                <Text fontWeight="bold" mb="12px">
                                                    Plot {item.name}
                                                </Text>
                                                {selected === index ? (
                                                    <Box
                                                        borderRadius="30px"
                                                        bgColor="primary.500"
                                                        flexDir="row"
                                                        p="4px"
                                                        px="8px"
                                                        h="27px"
                                                    >
                                                        <Text color="white">
                                                            {t('components.viewDetail')}
                                                        </Text>
                                                    </Box>
                                                ) : (
                                                    <Box h="27px" />
                                                )}
                                            </Box>
                                        </TouchableOpacity>
                                    </Box>
                                );
                            }}
                        />
                    </Box>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}

const styles = StyleSheet.create({
    plotList: {
        padding: 12,
    },
});
