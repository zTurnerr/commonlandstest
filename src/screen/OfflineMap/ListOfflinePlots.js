/* eslint-disable react-native/no-inline-styles */
import * as Turf from '@turf/turf';
import moment from 'moment';
import { Box, Checkbox, Text, useTheme } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import EmptySearchResult from '../../components/EmptySearchResult/EmptySearchResult';
import { CreatePlot, Location } from '../../components/Icons';
import Trash from '../../components/Icons/Trash';
import useTranslate from '../../i18n/useTranslate';

const Row = ({
    name = 'Offline 1',
    timestamp = 'oct 25, 2021',
    coordinates,
    onPressDelete,
    active,
    onPressCheckbox,
    placeName = 'Offline',
}) => {
    const { colors } = useTheme();
    const date = new Date(timestamp);
    const t = useTranslate();
    const _tmp = [...coordinates, coordinates[0]];
    const polygon = Turf.polygon([_tmp]);
    const area = Turf.area(polygon);
    const roundedArea = Math.round(area * 100) / 100;

    const onPress = () => {
        onPressCheckbox();
    };

    return (
        <Box
            flexDirection={'row'}
            px={'14px'}
            py={'10px'}
            mt={'10px'}
            mx={'20px'}
            borderRadius={'12px'}
            bgColor={'white'}
            borderWidth={'1px'}
            borderColor={active ? 'primary.600' : 'white'}
        >
            <Box flexDirection={'row'} flex={1}>
                <Box p={'8px'} px={'7px'} pr={'10px'}>
                    <Checkbox
                        value="check"
                        accessibilityLabel="checkbox offline"
                        aria-label="checkbox offline"
                        isChecked={active}
                        onChange={onPress}
                    />
                </Box>
                <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
                    <Box flex={1}>
                        <Text fontWeight={600} fontSize={14} mt={2}>
                            {name}
                        </Text>
                        <Text color={'gray.700'}>
                            {t('components.createdAt')}: {moment(date).format('MMM DD, YYYY')}
                        </Text>
                        <Box flexDir={'row'} my={1}>
                            <Box mr={2}>
                                <Location color={colors.primary[600]} />
                            </Box>
                            <Text>{t('explore.location')}: </Text>
                            <Text fontWeight={700} flex={1}>
                                {placeName}
                            </Text>
                        </Box>
                        <Box flexDir={'row'} alignItems={'center'}>
                            <Box mr={2}>
                                <CreatePlot width="16" height="16" color={colors.primary[600]} />
                            </Box>
                            <Text>{t('components.size')}: </Text>
                            <Text fontWeight={700}>{roundedArea}m2</Text>
                        </Box>
                    </Box>
                </TouchableOpacity>
            </Box>
            <Box alignItems={'center'} justifyContent={'center'} w={'40px'}>
                <TouchableOpacity onPress={onPressDelete}>
                    <Trash />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};
const ListOfflinePlots = ({
    data,
    selectedPlots,
    setSelectedPlots,
    openDeleteModal,
    setIndexToDelete,
}) => {
    const t = useTranslate();
    if (data?.length === 0)
        return (
            <EmptySearchResult
                title={t('searchContract.noResult')}
                description={t('contract.noData')}
            />
        );

    return (
        <>
            {data?.map((item, index) => (
                <Row
                    name={item.name}
                    coordinates={item.coordinates}
                    timestamp={item.date}
                    key={index}
                    placeName={item?.placeName}
                    onPressDelete={() => {
                        setIndexToDelete(index);
                        openDeleteModal();
                    }}
                    onPressCheckbox={() => {
                        setSelectedPlots((old) => ({
                            ...old,
                            [item?.uuid]: !old[item?.uuid],
                        }));
                    }}
                    active={selectedPlots[item?.uuid] || false}
                />
            ))}
        </>
    );
};

export default ListOfflinePlots;
