import { Danger } from 'iconsax-react-native';
import moment from 'moment/moment';
import { Box, FlatList, HStack, Button as NativeButton, Text, VStack, useTheme } from 'native-base';
import React, { useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../../components/Button';
import ConfirmModal from '../../../components/ConfirmModal';
import EmptyText from '../../../components/EmptyText';
import IconChip from '../../../components/IconChip';
import Tabs from '../../../components/Tabs';
import { toast } from '../../../components/Toast';
import useTranslate from '../../../i18n/useTranslate';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import { INVITE_STATUS, SEND_TYPE } from '../../../util/Constants';

const isPendingApproval = (plot, plotData) => {
    if (plot._id === plotData?.plot._id || plot.isOwner || plot.isSub) return false;
    return plot.inviteStatus === INVITE_STATUS.sent;
};

const isNotPendingApproval = (plot, plotData) => {
    if (plot._id === plotData?.plot._id || plot.isSub) return false;
    if (plot.inviteStatus === INVITE_STATUS.receive) return true;
    if (plot.isOwner) return false;

    return plot.inviteStatus !== INVITE_STATUS.sent;
};

export default function Index({
    plotsN,
    plotData,
    iDMarkerActive,
    getStatusData,
    setIDMarkerActive,
    renderPlot,
    sendMessage,
    onDeleteInvite,
}) {
    const t = useTranslate();
    const [tabIndex, setTabIndex] = useState(0);
    const [cancelInviteId, setCancelInviteId] = useState(null);
    const user = useShallowEqualSelector((state) => state.user);

    const theme = useTheme();
    const [isCancelInviteSubmitting, setIsCancelInviteSubmitting] = useState(false);

    const handleCancelInvite = async () => {
        try {
            setIsCancelInviteSubmitting(true);
            await onDeleteInvite(cancelInviteId);
            toast.success(t('invite.cancelInviteSuccess'));
        } catch (error) {
            toast.error(error);
        } finally {
            setIsCancelInviteSubmitting(false);
            setCancelInviteId(null);
        }
    };

    const filteredNeighbors = useMemo(() => {
        return plotsN
            .map((e, index) => ({
                ...e,
                isPending: tabIndex === 1,
                index,
            }))
            .filter((item) =>
                tabIndex === 0
                    ? isNotPendingApproval(item, plotData)
                    : isPendingApproval(item, plotData),
            );
    }, [plotsN, plotData, tabIndex]);

    const numberOfNotPendingApproval = useMemo(() => {
        return plotsN.reduce(
            (acc, item) => (isNotPendingApproval(item, plotData) ? ++acc : acc),
            0,
        );
    }, [plotsN]);

    const numberOfPendingApproval = useMemo(() => {
        return plotsN.reduce((acc, item) => (isPendingApproval(item, plotData) ? ++acc : acc), 0);
    }, [plotsN]);

    return (
        <>
            <Box>
                <Box p="15px" bg="white">
                    <Text fontWeight="400" fontSize="14px">
                        {t('invite.content')}
                    </Text>
                </Box>

                <Tabs
                    items={[
                        {
                            label: `${t('invite.neighbors')} (${numberOfNotPendingApproval})`,
                        },
                        {
                            label: `${t('invite.pendingApproval')} (${numberOfPendingApproval})`,
                        },
                    ]}
                    activeIndex={tabIndex}
                    onTabChange={setTabIndex}
                />

                {filteredNeighbors.length ? (
                    filteredNeighbors.map((item) => {
                        let statusData = getStatusData(item.inviteStatus);
                        const expireTime = moment(Date.now() + item.willExpireAfter).fromNow(true);
                        return (
                            <Box
                                py="12px"
                                borderBottomColor="divider"
                                borderBottomWidth="1px"
                                mt="5px"
                                minH="60px"
                                px="15px"
                                bg="white"
                                key={item._id}
                            >
                                <Box flexDirection="row" alignItems="center" borderRadius="12px">
                                    <Box flex={1}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                let isActive = item._id === iDMarkerActive;
                                                setIDMarkerActive(isActive ? null : item._id);
                                                renderPlot(isActive ? null : item._id);
                                                sendMessage({
                                                    type: SEND_TYPE.addMarker,
                                                    longlat: isActive ? null : item.centroid,
                                                    style: {
                                                        color: 'red',
                                                    },
                                                });
                                            }}
                                        >
                                            <Text fontSize="14px" fontWeight="bold">
                                                {t('bottomTab.plot')} {item.name}
                                            </Text>

                                            <Text
                                                fontSize="11px"
                                                lineHeight="20px"
                                                color="gray.600"
                                            >
                                                {item.placeName}
                                            </Text>
                                        </TouchableOpacity>
                                    </Box>

                                    {Boolean(statusData.button) && !item.isPending && (
                                        <Button
                                            variant={statusData.button.variant}
                                            color={statusData.button.color}
                                            _container={{
                                                w: '100px',
                                                h: '38px',
                                                mr: '12px',
                                                py: 0,
                                            }}
                                            _text={{
                                                fontSize: '12px',
                                            }}
                                            isDisabled={statusData.button.isDisabled}
                                            onPress={() => {
                                                statusData.button.onPress({
                                                    index: item.index,
                                                    ...item,
                                                });
                                            }}
                                        >
                                            {statusData.button.label}
                                        </Button>
                                    )}
                                </Box>
                                {item.isPending ? (
                                    <VStack space="15px">
                                        <FlatList
                                            mt="11px"
                                            data={[
                                                {
                                                    icon: (
                                                        <MaterialCommunityIcons
                                                            name="clock-check-outline"
                                                            size={16}
                                                        />
                                                    ),
                                                    text: t('invite.pendingApproval'),
                                                },
                                                {
                                                    icon: (
                                                        <MaterialCommunityIcons
                                                            name="history"
                                                            size={16}
                                                        />
                                                    ),
                                                    text: t('invite.expireIn', {
                                                        time: expireTime,
                                                    }),
                                                },
                                            ]}
                                            renderItem={({ item, index }) => (
                                                <IconChip
                                                    {...item}
                                                    colorScheme="warning"
                                                    mr="5px"
                                                    key={index}
                                                />
                                            )}
                                            horizontal
                                        />

                                        {item.invite?.createdBy?._id === user.userInfo._id && (
                                            <HStack space="5px">
                                                <NativeButton
                                                    variant="outline"
                                                    size="sm"
                                                    colorScheme="blue"
                                                    borderColor="blue.600"
                                                    onPress={() => setCancelInviteId(item.inviteID)}
                                                >
                                                    {t('invite.cancelInvite')}
                                                </NativeButton>
                                            </HStack>
                                        )}
                                    </VStack>
                                ) : (
                                    <HStack space="5px">
                                        <Box alignItems="center" justifyContent="center">
                                            <Box
                                                bgColor={statusData.text.color}
                                                borderRadius="sm"
                                                opacity={0.1}
                                                px="8px"
                                                py="4px"
                                            >
                                                <Text fontSize="11px" fontWeight="500" opacity={0}>
                                                    {statusData.text.value}
                                                </Text>
                                            </Box>
                                            <Text
                                                fontSize="11px"
                                                fontWeight="500"
                                                color={statusData.text.color}
                                                position="absolute"
                                            >
                                                {statusData.text.value}
                                            </Text>
                                        </Box>
                                        {/* {item.isCancelled && (
                                            <Box alignItems="center" justifyContent="center">
                                                <Box
                                                    bgColor="error.200"
                                                    borderRadius="sm"
                                                    px="8px"
                                                    py="4px"
                                                >
                                                    <Text
                                                        fontSize="11px"
                                                        fontWeight="500"
                                                        color="error.600"
                                                    >
                                                        {t('invite.cancelled')}
                                                    </Text>
                                                </Box>
                                            </Box>
                                        )} */}
                                    </HStack>
                                )}
                            </Box>
                        );
                    })
                ) : (
                    <EmptyText text={t('others.noPeopleFound')} />
                )}
            </Box>
            <ConfirmModal
                isOpen={!!cancelInviteId}
                icon={<Danger size={32} color={theme.colors.error[600]} />}
                title={t('invite.cancelInviteTitle')}
                description={t('invite.cancelInviteNeighborDescription')}
                isLoading={isCancelInviteSubmitting}
                colorScheme="error"
                cancelText={t('button.back')}
                confirmText={t('invite.cancelInvite')}
                onClose={() => setCancelInviteId(null)}
                onCancel={() => setCancelInviteId(null)}
                onConfirm={handleCancelInvite}
            />
        </>
    );
}
