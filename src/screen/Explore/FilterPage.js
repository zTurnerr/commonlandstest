import { useNavigation } from '@react-navigation/native';
import { CLAIMCHAIN_NUMBER, PLOTS_STATUS } from 'cml-script';
import {
    Box,
    Button,
    Checkbox,
    Flex,
    Icon,
    Input,
    ScrollView,
    Stack,
    Switch,
    Text,
    View,
} from 'native-base';
import React, { useState } from 'react';
import {
    DeviceEventEmitter,
    Keyboard,
    Pressable,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import IconSearch from 'react-native-vector-icons/AntDesign';
import IconClose from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import Chip from '../../components/Chip/Chip';
import { TickCircle } from '../../components/Icons';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { initFilter, mapSliceActions } from '../../redux/reducer/map';
import { getAllPlot } from '../../rest_client/apiClient';
import { ALL_STATUS, SCREEN_WIDTH, deviceEvents } from '../../util/Constants';

const style = {
    inActive: {
        bg: 'white',
        borderWidth: 1,
        borderColor: 'gray.400',
    },
    active: {
        bg: 'primary.600',
        borderWidth: 1,
        borderColor: 'primary.600',
    },
};

const FilterPage = ({ route }) => {
    const t = useTranslate();

    const { mapReducer } = useShallowEqualSelector((state) => ({
        mapReducer: state.map,
    }));
    const dispatch = useDispatch();
    const { params } = route || {};
    const navigation = useNavigation();
    const [idPlot, setIdPlot] = useState(params?.textSearch || '');
    const [listPlot, setListPlot] = useState([]);
    const [visibleResult, setVisibleResult] = useState(false);
    const [plotStatus, setPlotStatus] = useState(() => mapReducer?.filter?.status);
    const [showClaimChain, setShowClaimChain] = useState(() => mapReducer?.filter?.showClaimchain);
    const [showUnconnected, setShowUnconnected] = useState(() => mapReducer?.filter?.showUnConnect);
    const pop = () => {
        navigation.goBack();
    };

    const onPressApply = () => {
        Keyboard.dismiss();
        // params?.onApplyFilter?.({ idPlot });
        dispatch(
            mapSliceActions.updateFilter({
                filter: {
                    status: plotStatus,
                    showClaimchain: showClaimChain,
                    showUnConnect: showUnconnected,
                },
            }),
        );
        pop();
    };

    const onPressClearFilter = () => {
        Keyboard.dismiss();
        setShowClaimChain(initFilter.showClaimchain);
        setShowUnconnected(initFilter.showUnConnect);
        setPlotStatus(initFilter.status);
    };

    const onGetAllPlot = async (txt) => {
        try {
            const response = await getAllPlot({
                idPlot: txt || idPlot?.trim(),
                page: 1,
                perPage: 10,
            });
            if (response?.data) {
                setVisibleResult(true);
                setListPlot(response?.data?.plots);
            }
        } catch (err) {}
    };

    const onChangeText = (txt) => {
        setIdPlot(txt);
        if (txt?.trim()?.length > 0) {
            onGetAllPlot(txt?.trim());
        }
    };

    const onPressItem = (plot) => {
        Keyboard.dismiss();
        let textSearch = idPlot;
        DeviceEventEmitter.emit(deviceEvents.explore.filter, { plot, textSearch });
        pop();
        setVisibleResult(false);
    };

    const onPressClose = () => {
        setVisibleResult(false);
        setIdPlot('');
    };

    const onToggleSwitch = () => {
        setShowUnconnected(!showUnconnected);
    };

    const renderItemResult = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => onPressItem(item)}>
                <Text numberOfLines={1} fontSize={14} fontWeight={'500'}>
                    {t('bottomTab.plot')} {item?.name || ''}
                </Text>
                <Text numberOfLines={1} mb={'10px'} fontSize={12} fontWeight={'300'}>
                    {t('explore.location')} <Text fontWeight={'500'}>{item?.placeName || ''}</Text>
                </Text>
                <Flex flexDirection={'row'} flexWrap={'wrap'}>
                    {Boolean(item.totalNeighbors || item.totalClaimants) && (
                        <Chip bg="primary.200">
                            <Text color={'primary.600'} fontWeight={'600'} fontSize={'11px'}>
                                {(item.totalClaimants ? `${item.totalClaimants} Claimants` : '') +
                                    (item.totalNeighbors && item.totalClaimants ? ', ' : '') +
                                    (item.totalNeighbors ? `${item.totalNeighbors} Neighbors` : '')}
                            </Text>
                        </Chip>
                    )}
                    {Boolean(item.totalDisputes) && (
                        <Chip bg={'pink.300'} borderRadius="30px">
                            <Text color={'pink.400'} fontWeight={'600'} fontSize={'11px'}>
                                {item.totalDisputes + ' ' + 'Disputed'}
                            </Text>
                        </Chip>
                    )}
                </Flex>
            </TouchableOpacity>
        );
    };

    const renderEmptyData = () => {
        return (
            <Text textAlign={'center'} mb={'10px'} fontSize={16} fontWeight={'500'}>
                {t('others.noResult')}
            </Text>
        );
    };

    return (
        <View flex={1}>
            <ScrollView flex={1} contentContainerStyle={styles.scrollView} w="full" h="full">
                <Flex w={'full'} h={'full'} flex={1} justifyContent={'space-between'}>
                    <Box>
                        <TouchableOpacity onPress={pop}>
                            <Box
                                marginLeft={'10px'}
                                marginTop={'24px'}
                                alignContent={'center'}
                                flexDirection={'row'}
                            >
                                <IconClose name="close" size={25} color="black" />
                                <Text
                                    marginLeft={'10px'}
                                    fontWeight={'500'}
                                    fontSize={16}
                                    color={'rgba(0, 0, 0, 1)'}
                                >
                                    {t('button.filter')}
                                </Text>
                            </Box>
                        </TouchableOpacity>
                        <Box
                            marginTop={'10px'}
                            w={'100%'}
                            h={'1px'}
                            backgroundColor={'rgba(0, 0, 0, 0.1)'}
                        />
                        <Box paddingLeft={'16px'} marginTop={'20px'}>
                            {/* <Text fontWeight={'700'} fontSize={12} color={'rgba(0, 0, 0, 1)'}>
                    {t('explore.plotStatus')}
                </Text> */}
                            <Input
                                w={SCREEN_WIDTH - 32}
                                variant="rounded"
                                placeholder={`${t('explore.findPlotName')}...`}
                                value={idPlot}
                                defaultValue={idPlot}
                                onChangeText={onChangeText}
                                mt="12px"
                                h={'38px'}
                                backgroundColor={'rgba(0, 0, 0, 0.05)'}
                                InputLeftElement={
                                    <Icon
                                        as={<IconSearch name="search1" />}
                                        size={4}
                                        ml="3"
                                        color="black"
                                    />
                                }
                                InputRightElement={
                                    <>
                                        {idPlot?.length > 0 && (
                                            <TouchableOpacity onPress={onPressClose}>
                                                <Icon
                                                    as={<IconSearch name="close" />}
                                                    size={4}
                                                    mr="3"
                                                    color="black"
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </>
                                }
                            />
                            {visibleResult && idPlot?.length > 0 && (
                                <ScrollView
                                    px={'16px'}
                                    pt={'16px'}
                                    pb={'6px'}
                                    mt={'5px'}
                                    shadow={1}
                                    w={SCREEN_WIDTH - 32}
                                    h={'auto'}
                                    backgroundColor={'white'}
                                    borderRadius={8}
                                    minH={listPlot?.length > 0 ? '200px' : '100px'}
                                    maxH={'50%'}
                                    position={'absolute'}
                                    zIndex={2}
                                    top={'46px'}
                                    left={'16px'}
                                >
                                    {listPlot?.map((item, index) =>
                                        renderItemResult({ item, index }),
                                    )}
                                    {listPlot?.length === 0 && renderEmptyData()}
                                </ScrollView>
                            )}
                        </Box>
                        <Stack
                            space={3}
                            paddingLeft={'16px'}
                            paddingRight={'16px'}
                            marginTop={'20px'}
                        >
                            <Text fontWeight={700}>{t('explore.plotStatus')}</Text>
                            <Flex flexWrap={'wrap'} flexDirection={'row'}>
                                {[ALL_STATUS, ...PLOTS_STATUS].map((item, index) => {
                                    const active = plotStatus === item.value;
                                    const toStyle = active ? style.active : style.inActive;
                                    return (
                                        <Pressable
                                            onPress={() => setPlotStatus(item.value)}
                                            key={index}
                                        >
                                            <Chip
                                                {...toStyle}
                                                paddingLeft={'26px'}
                                                paddingRight={'26px'}
                                            >
                                                {active && (
                                                    <Box position={'absolute'} left={'4px'}>
                                                        <TickCircle color={'white'} />
                                                    </Box>
                                                )}
                                                <Text
                                                    fontWeight="500"
                                                    color={active ? 'white' : 'black'}
                                                >
                                                    {item.label}
                                                </Text>
                                            </Chip>
                                        </Pressable>
                                    );
                                })}
                            </Flex>
                        </Stack>
                        <Box
                            width={'100%'}
                            height={'1px'}
                            backgroundColor={'gray.400'}
                            mt={2}
                        ></Box>
                        <Stack
                            space={3}
                            paddingLeft={'16px'}
                            paddingRight={'16px'}
                            marginTop={'20px'}
                        >
                            <Text fontWeight={700}>{t('explore.showClaimchain')}</Text>
                            <Checkbox.Group
                                onChange={(values) => setShowClaimChain(values.sort() || [])}
                                defaultValue={showClaimChain}
                                accessibilityLabel="Show Claimchain"
                                ml={3}
                                _checkbox={{
                                    borderColor: 'gray.600',
                                    _checked: {
                                        bg: 'primary.600',
                                        _pressed: {
                                            bg: 'primary.600',
                                            borderColor: 'primary.600',
                                        },
                                    },
                                }}
                            >
                                {CLAIMCHAIN_NUMBER.map((item, index) => {
                                    return (
                                        <Checkbox value={item.value} marginBottom={4} key={index}>
                                            <Text fontWeight="500" fontSize="12px">
                                                {item.label}
                                            </Text>
                                        </Checkbox>
                                    );
                                })}
                            </Checkbox.Group>
                        </Stack>
                        <Box
                            width={'100%'}
                            height={'1px'}
                            backgroundColor={'gray.400'}
                            mt={2}
                        ></Box>
                        <Stack
                            direction={'row'}
                            space={3}
                            paddingLeft={'16px'}
                            paddingRight={'16px'}
                            marginTop={'20px'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                        >
                            <Text fontWeight={700} fontSize={12}>
                                {t('explore.showUnconnected')}
                            </Text>
                            <Switch isChecked={showUnconnected} onToggle={onToggleSwitch} />
                        </Stack>
                    </Box>
                    <Box
                        px={'16px'}
                        flexDirection={'row'}
                        alignContent={'center'}
                        justifyContent={'space-between'}
                        py={'32px'}
                    >
                        <Button
                            width={'48%'}
                            height={'48px'}
                            // _container={{
                            //     w: '20%',
                            //     h: '48px',
                            // }}
                            onPress={onPressClearFilter}
                            variant={'outline'}
                        >
                            {t('explore.resetFilter')}
                        </Button>
                        <Button width={'48%'} onPress={onPressApply}>
                            {t('button.apply')}
                        </Button>
                    </Box>
                </Flex>
            </ScrollView>
        </View>
    );
};

export default FilterPage;

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
    },
});
