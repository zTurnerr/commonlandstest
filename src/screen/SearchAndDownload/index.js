import React, { useCallback, useEffect, useState } from 'react';
import Header from '../../components/Header';
import {
    Box,
    CloseIcon,
    IconButton,
    Input,
    ScrollView,
    SearchIcon,
    Spinner,
    Text,
} from 'native-base';
import { getDestinationFromText } from '../../util/utils';
import { TouchableOpacity } from 'react-native';
import useTranslate from '../../i18n/useTranslate';
import { useNavigation } from '@react-navigation/native';

const Index = ({ route }) => {
    const [dataSearch, setDataSearch] = useState({
        loading: false,
        result: [],
    });
    const [valueText, setValueText] = useState('');

    const params = route?.params;

    const [error, setError] = useState('');
    const t = useTranslate();
    const navigate = useNavigation();

    const searchPlace = async (text) => {
        try {
            //convert white space in text to %20
            let textSearch = text.replace(/\s/g, '%20');
            setError('');
            setDataSearch({ result: [], loading: true });
            const res = await getDestinationFromText(textSearch);
            const places = res?.features;
            setDataSearch({
                loading: false,
                result: places,
            });
        } catch (_error) {
            setError(_error?.message || '');
        }
    };

    const debounce = (func, wait) => {
        let timeout;
        return function (...args) {
            const context = this;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(context, args);
            }, wait);
        };
    };

    const debouncedOnChangeText = useCallback(
        debounce(async (text) => {
            try {
                setError('');
                searchPlace(text);
            } catch (_error) {
                setError(_error?.message || '');
            }
        }, 500),
        [],
    );

    const onPressToAnotherLocation = (location) => {
        navigate.navigate('MapPreview', {
            location: {
                placeName: location?.place_name,
                center: location?.center,
            },
        });
    };

    useEffect(() => {
        if (params?.place) {
            setValueText(params?.place);
            debouncedOnChangeText(params?.place);
        }
    }, [params?.place]);

    return (
        <>
            <Header title={t('offlineMaps.searchLocation')} />
            <Box px={'20px'} zIndex={100}>
                <Input
                    borderRadius={'18px'}
                    placeholder="Search"
                    bgColor={'gray.1600'}
                    px={'12px'}
                    my={'10px'}
                    onChange={(e) => {
                        setValueText(e.nativeEvent.text);
                        debouncedOnChangeText(e.nativeEvent.text);
                    }}
                    value={valueText}
                    defaultValue={params?.place || ''}
                    InputLeftElement={<SearchIcon ml={'12px'} />}
                    _focus={{ borderColor: 'primary.600' }}
                    InputRightElement={
                        valueText?.length > 0 && (
                            <IconButton
                                borderRadius={'full'}
                                icon={<CloseIcon size={3} color="gray.600" />}
                                _pressed={{
                                    bg: 'gray.610',
                                }}
                                onPress={() => {
                                    setValueText('');
                                    debouncedOnChangeText('');
                                }}
                            ></IconButton>
                        )
                    }
                />
            </Box>
            <ScrollView flex={1}>
                {dataSearch?.loading && <Spinner />}
                {error.length > 0 && (
                    <Text flex={1} color={'red.500'}>
                        {error}
                    </Text>
                )}

                {dataSearch.result.map((item, index) => (
                    <Box
                        key={index}
                        py={'10px'}
                        px={'20px'}
                        borderBottomWidth={1}
                        borderBottomColor={'appColors.divider'}
                    >
                        <TouchableOpacity onPress={() => onPressToAnotherLocation(item)}>
                            <Box flex={1}>
                                <Text flex={1} fontWeight={'bold'} fontSize={14}>
                                    {item?.text}
                                </Text>
                                <Text flex={1}>{item?.place_name}</Text>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                ))}
            </ScrollView>
        </>
    );
};

export default Index;
