import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Box, Button, CheckCircleIcon, HStack, ScrollView, Text } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import HeaderPage from '../../components/HeaderPage';
import DatePickerInput from '../../components/Input/DatePickerInput';
import useContractFilter from '../../hooks/useContractFilter';
import useTranslate from '../../i18n/useTranslate';
import { thousandsFormat } from '../../util/currencyFormat';

const selectedStyle = {
    bg: 'primary.600',
    color: 'white',
};

const getStep = (maxAmount) => {
    let tmp = Number(maxAmount);
    let res = 1;
    while (tmp > 1000000) {
        tmp = tmp / 10;
        res = res * 10;
    }
    return res;
};

let timeout = null;

const FilterContract = ({ route }) => {
    const t = useTranslate();
    const filterHook = useContractFilter();
    const dim = useWindowDimensions();
    const navigation = useNavigation();
    let { maxAmount } = route?.params;
    if (maxAmount == 0 || !maxAmount) maxAmount = 100;
    const statusOptions = [
        {
            label: t('contract.all'),
            value: '',
        },
        {
            label: t('components.active'),
            value: 'active',
        },
        {
            label: t('plotStatus.pending'),
            value: 'created',
        },
        {
            label: t('contract.pendingUnlock'),
            value: 'pendingUnlock',
        },
        {
            label: t('contract.unlocked'),
            value: 'completed',
        },
        {
            label: t('plotStatus.default'),
            value: 'defaulted',
        },
    ];

    const [selectedStatus, setSelectedStatus] = useState(filterHook.filter.status || '');
    const [contractAmount, setContractAmount] = useState([
        filterHook.filter.startAmount === '' ? 0 + maxAmount * 0.1 : filterHook.filter.startAmount,
        filterHook.filter.endAmount === ''
            ? maxAmount - maxAmount * 0.1
            : filterHook.filter.endAmount,
    ]);

    const debounceOnChangeAmount = (value) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            setContractAmount(value);
        }, 500);
    };

    const SelectStatusSection = (
        <Box py="15px" px="20px" bg="white" mt="10px">
            <Text mb="10px" fontWeight={700}>
                {t('contract.contractStatus')}
            </Text>
            <HStack w="full" flexWrap={'wrap'} mt="10px" alignItems={'center'}>
                {statusOptions.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => setSelectedStatus(item.value)}>
                        <HStack
                            key={index}
                            px="5px"
                            mb="12px"
                            mr="12px"
                            borderWidth={1}
                            borderColor={'gray.400'}
                            py="10px"
                            borderRadius={'24px'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            {...(selectedStatus === item.value ? selectedStyle : {})}
                        >
                            <Box opacity={selectedStatus === item.value ? 1 : 0}>
                                <CheckCircleIcon size="24px" color="white" />
                            </Box>
                            <Text
                                // ml="5px"
                                pl="5px"
                                fontWeight={500}
                                color={selectedStatus === item.value ? 'white' : 'gray.800'}
                            >
                                {item.label}
                            </Text>
                            <Box opacity={0}>
                                <CheckCircleIcon size="24px" />
                            </Box>
                        </HStack>
                    </TouchableOpacity>
                ))}
            </HStack>
        </Box>
    );

    const AmountSection = (
        <Box py="15px" px="20px" bg="white" mt="10px" pb="40px">
            <Text fontWeight={700} mb="22px">
                {t('contract.loanAmount')}
                <Text fontWeight={400}>
                    : {t('contract.from')} {thousandsFormat(contractAmount[0])} Shillings{' '}
                    {t('contract.to')} {thousandsFormat(contractAmount[1])} Shillings
                </Text>
            </Text>

            <MultiSlider
                values={[Number(contractAmount[0]), Number(contractAmount[1])]}
                min={0}
                max={Number(maxAmount) || 100}
                step={getStep(maxAmount)}
                sliderLength={dim.width - 40}
                enabledTwo={true}
                onValuesChange={(values) => debounceOnChangeAmount(values)}
                selectedStyle={styles.selected}
                unselectedStyle={styles.unselected}
                markerStyle={styles.marker}
                enableLabel={true}
                customLabel={(value) => {
                    return (
                        <HStack
                            position={'absolute'}
                            bottom={'-17px'}
                            justifyContent={'space-between'}
                            w="full"
                        >
                            <Text>{thousandsFormat(value.oneMarkerValue)} Shillings</Text>
                            <Text>{thousandsFormat(value.twoMarkerValue)} Shillings</Text>
                        </HStack>
                    );
                }}
            />
        </Box>
    );

    const [startDate, setStartDate] = useState(filterHook.filter.startDate || null);
    const [endDate, setEndDate] = useState(filterHook.filter.endDate || null);

    const DateCreatedSection = (
        <Box py="15px" px="20px" bg="white" mt="10px">
            <Text fontWeight={700} mb="22px">
                {t('contract.dateCreated')}
            </Text>
            <HStack justifyContent={'space-between'} space={2}>
                <Box flex={1}>
                    <Text mb="8px">{t('contract.from')}</Text>
                    <DatePickerInput
                        value={startDate}
                        onPress={() => {
                            DateTimePickerAndroid.open({
                                value: startDate ? new Date(startDate) : new Date(),
                                mode: 'date',
                                maximumDate: endDate ? new Date(endDate) : new Date(),
                                onChange: (event, selectedDate) => {
                                    if (event.type === 'dismissed') return;
                                    setStartDate(selectedDate);
                                },
                            });
                        }}
                    />
                </Box>
                <Box flex={1}>
                    <Text mb="8px">{t('contract.to')}</Text>
                    <DatePickerInput
                        value={endDate}
                        onPress={() => {
                            DateTimePickerAndroid.open({
                                value: endDate ? new Date(endDate) : new Date(),
                                mode: 'date',
                                maximumDate: new Date(),
                                minimumDate: startDate ? new Date(startDate) : new Date(0),
                                onChange: (event, selectedDate) => {
                                    if (event.type === 'dismissed') return;
                                    setEndDate(selectedDate);
                                },
                            });
                        }}
                    />
                </Box>
            </HStack>
        </Box>
    );

    // useEffect(() => {
    //     DateTimePickerAndroid.open({
    //         value: new Date(),
    //         mode: 'date',
    //     });
    // }, []);

    return (
        <Box h="full">
            <ScrollView>
                <HeaderPage title={t('button.filter')} />
                {SelectStatusSection}
                {AmountSection}
                {DateCreatedSection}
            </ScrollView>
            <HStack px="20px" space={2} h="80px" alignItems={'flex-end'} pb="15px">
                <Button
                    onPress={() => {
                        filterHook.resetFilterContract();
                        navigation.goBack();
                    }}
                    flex={1}
                    variant={'outline'}
                >
                    {t('explore.resetFilter')}
                </Button>
                <Button
                    flex={1}
                    onPress={() => {
                        filterHook.updateFilterContract({
                            status: selectedStatus,
                            startAmount: contractAmount[0],
                            endAmount: contractAmount[1],
                            startDate,
                            endDate,
                        });
                        navigation.goBack();
                    }}
                >
                    {t('button.apply')}
                </Button>
            </HStack>
        </Box>
    );
};

export default FilterContract;

const styles = StyleSheet.create({
    selected: {
        backgroundColor: '#5EC4AC',
    },
    unselected: {
        backgroundColor: '#D9D9D9',
    },
    marker: {
        backgroundColor: '#5EC4AC',
        width: 20,
        height: 20,
    },
});
