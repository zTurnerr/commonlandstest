import { Danger } from 'iconsax-react-native';
import moment from 'moment';
import { Box, Button, FlatList, HStack, Text, VStack, theme } from 'native-base';
import React, { useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ConfirmModal from '../../../components/ConfirmModal';
import EmptyText from '../../../components/EmptyText';
import IconChip from '../../../components/IconChip';
import { getPlotStatus } from '../../../components/PlotStatus';
import { toast } from '../../../components/Toast';
import useTranslate from '../../../i18n/useTranslate';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import PlotRow from './PlotRow';

export default function Index({ neightbors = [], neightborsPending, onPlotPress, onDeleteInvite }) {
    const t = useTranslate();
    const [cancelInviteId, setCancelInviteId] = useState(null);
    const [isCancelInviteSubmitting, setIsCancelInviteSubmitting] = useState(false);

    const numberOfNeightbors = useMemo(
        () => neightbors.length + neightborsPending.length,
        [neightbors, neightborsPending],
    );

    const handleCancelInvite = async () => {
        try {
            setIsCancelInviteSubmitting(true);
            await onDeleteInvite?.(cancelInviteId);
            toast.success(t('invite.cancelInviteSuccess'));
        } catch (error) {
            toast.error(error);
        } finally {
            setCancelInviteId(null);
            setIsCancelInviteSubmitting(false);
        }
    };

    const user = useShallowEqualSelector((state) => state.user);

    return (
        <>
            <Box>
                {neightborsPending.map((item, index) => {
                    let { button: ButtonC } = item;
                    if (!item.inviteePlotID?.name && !ButtonC) {
                        return null;
                    }
                    const expireTime = moment(Date.now() + item.willExpireAfter).fromNow(true);

                    return (
                        <VStack
                            space="12px"
                            key={index}
                            borderBottomColor="divider"
                            borderBottomWidth="1px"
                            p="12px"
                            bg="white"
                        >
                            <Box flex={1} mr="12px">
                                <Text fontWeight="bold">{item.inviteePlotID?.name}</Text>
                                <Text>{item.inviteePlotID?.placeName}</Text>
                            </Box>
                            {/* {ButtonC ? ButtonC : <Claimrank hideIcon hideTitle rank={0} px="12px" />} */}
                            <FlatList
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
                                        icon: <MaterialCommunityIcons name="history" size={16} />,
                                        text: t('invite.expireIn', { time: expireTime }),
                                    },
                                ]}
                                renderItem={({ item, index }) => (
                                    <IconChip
                                        {...item}
                                        key={index}
                                        colorScheme="warning"
                                        mr="5px"
                                    />
                                )}
                                horizontal
                            />

                            {user.userInfo._id === item.createdBy?._id && (
                                <HStack space="5px">
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        variant="outline"
                                        borderColor="blue.600"
                                        onPress={() => setCancelInviteId(item._id)}
                                    >
                                        {t('invite.cancelInvite')}
                                    </Button>
                                </HStack>
                            )}
                        </VStack>
                    );
                })}
                {neightbors &&
                    neightbors
                        .map((item) => ({
                            ...item,
                            status: getPlotStatus({
                                plot: item,
                            }),
                        }))
                        .sort((a, b) => {
                            return a.status - b.status;
                        })
                        .map((item, index) => {
                            return onPlotPress ? (
                                <TouchableOpacity key={index} onPress={() => onPlotPress(item)}>
                                    <PlotRow data={item} />
                                </TouchableOpacity>
                            ) : (
                                <PlotRow key={index} data={item} />
                            );
                        })}

                {!numberOfNeightbors && <EmptyText text={t('plot.noNeighbors')} />}
            </Box>

            <ConfirmModal
                isOpen={!!cancelInviteId}
                isLoading={isCancelInviteSubmitting}
                icon={<Danger size={32} color={theme.colors.error[400]} />}
                colorScheme="error"
                title={t('invite.cancelInviteTitle')}
                description={t('invite.cancelInviteNeighborDescription')}
                onClose={() => setCancelInviteId(null)}
                onCancel={() => setCancelInviteId(null)}
                onConfirm={handleCancelInvite}
                confirmText={t('invite.cancelInvite')}
                cancelText={t('button.back')}
            />
        </>
    );
}
