import { useNavigation } from '@react-navigation/native';
import { Box, HStack, Spinner, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import EmptySearchResult from '../../components/EmptySearchResult/EmptySearchResult';
import { BackArrow } from '../../components/Icons';
import Trash from '../../components/Icons/Trash';
import SearchBoxContract from '../../components/SearchBox/SearchBoxContract';
import useTranslate from '../../i18n/useTranslate';
import { searchAndFilterContract } from '../../rest_client/apiClient';
import { showErr } from '../../util/showErr';
import { ContractList } from './components/ContractList';

const get4LastItem = (arr) => {
    // reverse array
    arr = arr.reverse();
    return arr.slice(0, 4);
};

const SearchContract = () => {
    const navigation = useNavigation();
    const t = useTranslate();
    const [searchTxt, setSearchTxt] = useState('');
    const [lastSearchState, setLastSearchState] = useState([]);
    const [contractList, setContractList] = useState([]);
    const [searching, setSearching] = useState(false);

    const fetchLastSearch = async () => {
        try {
            let { data } = await searchAndFilterContract({
                filters: {},
            });
            setLastSearchState(get4LastItem(data?.recentSearch));
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = async (searchTxt) => {
        setSearching(true);
        try {
            const updatedSearchState = [searchTxt, ...lastSearchState].slice(0, 4);
            setLastSearchState(updatedSearchState);
            // fetch data
            let { data } = await searchAndFilterContract({
                filters: {
                    search: searchTxt,
                },
            });
            setContractList(data?.contracts);

            setLastSearchState(get4LastItem(data?.recentSearch));
        } catch (error) {
            showErr(error);
        }
        setSearching(false);
    };

    const onClear = async () => {
        try {
            let { data } = await searchAndFilterContract({
                filters: {},
                clearRecent: true,
            });
            setLastSearchState(get4LastItem(data?.recentSearch));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchLastSearch();
    }, []);

    const RecentSearchSection = (
        <Box
            display={lastSearchState.length > 0 ? 'flex' : 'none'}
            px="20px"
            pt="15px"
            pb="25px"
            bg="white"
            mt="10px"
        >
            <HStack w="full" alignItems={'center'} justifyContent={'space-between'}>
                <Text fontWeight={700} mb="10px">
                    {t('contract.recentSearch')}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        onClear();
                    }}
                >
                    <Trash color="#5EC4AC" />
                </TouchableOpacity>
            </HStack>
            <HStack justifyContent={'flex-start'} flexWrap={'wrap'} mt="10px">
                {lastSearchState.map((searchItem, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.searchItem}
                        onPress={() => {
                            setSearchTxt(searchItem);
                            onSubmit(searchItem);
                        }}
                    >
                        <Box py="10px" px="15px" bg="gray.2200" borderRadius={'8px'}>
                            <Text>{searchItem}</Text>
                        </Box>
                    </TouchableOpacity>
                ))}
            </HStack>
        </Box>
    );

    return (
        <Box h="full">
            <HStack pr="24px" pt="10px" bg="white" alignItems={'center'} pb="15px">
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <BackArrow width="24" height="24" />
                </TouchableOpacity>
                <SearchBoxContract
                    onSubmit={() => onSubmit(searchTxt)}
                    onChange={(value) => {
                        setSearchTxt(value);
                    }}
                    autoFocus={true}
                    value={searchTxt}
                />
            </HStack>
            {lastSearchState.length > 0 && contractList.length === 0 && RecentSearchSection}
            {contractList.length > 0 && !searching && <ContractList listContract={contractList} />}
            {searching && <Spinner mt={'15px'} />}
            {contractList.length === 0 && !searching && (
                <EmptySearchResult
                    title={t('searchContract.noResult')}
                    description={t('contract.noData')}
                />
            )}
        </Box>
    );
};

export default SearchContract;

const styles = StyleSheet.create({
    searchItem: {
        marginRight: 10,
        marginBottom: 10,
    },
    backButton: {
        padding: 10,
    },
});
