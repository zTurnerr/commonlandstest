import { useNavigation } from '@react-navigation/native';
import { Box, FlatList, useTheme } from 'native-base';
import React, { memo, useCallback, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import EmptyContract from './EmptyContract';
import ItemContract from './ItemContract';

export const ContractList = memo(function InternalComponent({
    listContract,
    addContract,
    loading = false,
    getListContract,
}) {
    const [refreshing, setOnRefresh] = useState(false);
    const theme = useTheme();
    let { user } = useShallowEqualSelector((state) => ({
        user: state.user.userInfo,
        isLogged: state.user.isLogged,
    }));

    const navigate = useNavigation();
    const onRefresh = useCallback(() => {
        setOnRefresh(true);
        getListContract();
        setTimeout(() => {
            setOnRefresh(false);
        }, 2000);
    }, [getListContract]);

    const goToDetailContact = useCallback(
        (item) => {
            if (item?.underwriter?.user?.phoneNumber == user?.phoneNumber) {
                navigate.navigate('CreatorContractDetail', { contract: item });
            } else {
                navigate.navigate('CreatorContractDetail', { contract: item });
            }
        },
        [navigate, user],
    );

    const renderItem = useCallback(({ item }) => {
        return <ItemContract key={item?._id} item={item} onPress={() => goToDetailContact(item)} />;
    });

    const renderEmptyData = useCallback(() => {
        if (loading) return null;
        return <EmptyContract onCreateContract={addContract} />;
    }, [addContract, loading]);

    return (
        <FlatList
            // data={[filteredListContract?.[0]]}

            pt={'10px'}
            data={[...listContract]}
            keyExtractor={(_item) => _item?._id}
            renderItem={renderItem}
            ListEmptyComponent={renderEmptyData}
            contentContainerStyle={styles.flatList}
            ItemSeparatorComponent={() => <Box h={'10px'} />}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[theme.colors.appColors.primary, theme.colors.appColors.primaryYellow]}
                />
            }
        />
    );
});

const styles = StyleSheet.create({
    flatList: {
        flexGrow: 1,
        paddingBottom: 24,
    },
});
