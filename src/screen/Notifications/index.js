import { Box, Skeleton, Text, VStack } from 'native-base';
import useTranslate from '../../i18n/useTranslate';

import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import Header from '../../components/Header';
import { MarkReadAll } from '../../components/Icons';
import LoadingPage from '../../components/LoadingPage';
import { getAllNo } from '../../redux/actions/notification';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { notificationsSliceActions } from '../../redux/reducer/notifications';
import { markReadNotification } from '../../rest_client/apiClient';
import NotificationItem from './NotificationItem';
import EmptyNotify from './components/EmptyNotify';

const EMPTY = 'empty';
export default function Notifications() {
    const notifications = useShallowEqualSelector((state) => state.notifications);
    const { data, perPage, total, totalUnReads } = notifications;
    const [requesting, setRequesting] = React.useState(false);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [marking, setMarking] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const getAllNotification = () => {
        if (requesting) {
            return null;
        }
        setRequesting(true);
        dispatch(
            getAllNo({ page: 1, perPage }, () => {
                setRequesting(false);
            }),
        );
    };
    const loadMore = async () => {
        if (loadingMore || data.length === total) {
            return;
        }
        setLoadingMore(true);
        dispatch(
            getAllNo({ page: 1, perPage: Number(perPage) + 10, isLoadMore: true }, () => {
                setLoadingMore(false);
            }),
        );
    };
    const markReadAll = async () => {
        try {
            setMarking(true);
            await markReadNotification({ markAsReadsAll: true });
            dispatch(notificationsSliceActions.markReadAll());
        } catch (err) {
            console.log(err);
        }
        setMarking(false);
    };
    let dataRender = JSON.parse(JSON.stringify(data));
    if (dataRender.length === 0) {
        dataRender = [
            {
                _id: EMPTY,
            },
        ];
    }
    const t = useTranslate();
    return (
        <Box bg="white" w="full" h="full">
            {loading && <LoadingPage />}
            <Header
                showAccountBtn
                title={t('bottomTab.alerts')}
                shadow={'none'}
                border
                borderColor={'gray.400'}
            >
                {totalUnReads > 0 && (
                    <TouchableOpacity
                        leOpacity
                        onPress={() => {
                            markReadAll();
                        }}
                        style={styles.markAllAsReadButton}
                        disabled={marking}
                    >
                        <Box flexDir="row" alignItems="center">
                            <MarkReadAll />
                            <Text ml="2px">{t('notification.markAllAsRead')}</Text>
                        </Box>
                    </TouchableOpacity>
                )}
            </Header>
            {!data?.length && (
                <VStack flex={1} w="full" justifyContent="center" alignItems="center" h="100%">
                    <EmptyNotify />
                </VStack>
            )}
            {!!data?.length && (
                <FlatList
                    flex={1}
                    data={dataRender}
                    renderItem={({ item }) => {
                        if (item._id === EMPTY) {
                            return null;
                        }
                        return (
                            <NotificationItem
                                getData={getAllNotification}
                                data={item}
                                key={item._id}
                                setLoading={setLoading}
                            />
                        );
                    }}
                    refreshing={requesting}
                    onRefresh={() => {
                        getAllNotification();
                    }}
                    onEndReached={() => {
                        loadMore();
                    }}
                    ListFooterComponent={() => {
                        return (
                            loadingMore && (
                                <>
                                    <LoadingSkeleton />
                                    <LoadingSkeleton />
                                </>
                            )
                        );
                    }}
                    contentContainerStyle={styles.alertList}
                ></FlatList>
            )}
        </Box>
    );
}

const LoadingSkeleton = () => {
    return (
        <Box flexDirection="row" h="50px" p="8px">
            <Skeleton rounded="full" w="40px" />
            <Box flex={1}>
                <Skeleton flex={1} />
                <Skeleton flex={1} mt="2px" />
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    markAllAsReadButton: {
        marginRight: 12,
        paddingHorizontal: 12,
    },
    alertList: {
        minHeight: '100%',
        backgroundColor: 'white',
        display: 'flex',
    },
});
