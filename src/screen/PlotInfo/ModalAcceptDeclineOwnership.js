import { Box, Text, useTheme } from 'native-base';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { useDispatch } from 'react-redux';
import Button from '../../components/Button';
import { Decline } from '../../components/Icons';
import Verify from '../../components/Icons/Verify';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { notificationsSliceActions } from '../../redux/reducer/notifications';
import { markReadNotification } from '../../rest_client/apiClient';
import TYPES from '../Notifications/NotificationConstants';

const StateModal = {
    success: {
        title: 'transferOwnership.congratulations',
        description: 'transferOwnership.successDescription',
    },
    fail: {
        title: 'transferOwnership.declineOwnership',
        description: 'transferOwnership.declineDescription',
    },
};

export default function ModalAcceptDeclineOwnership({ responseTransfer, plotData, refAnnounce }) {
    const notifications = useShallowEqualSelector((state) => state.notifications);
    const user = useShallowEqualSelector((state) => state?.user);
    const { data } = notifications;
    const [isOpen, setIsOpen] = useState(responseTransfer?.visible);
    const [transferOwner, setTransferOwner] = useState(responseTransfer?.status);
    const dispatch = useDispatch();

    const filterWithType = (item, type) => {
        const jsonParse = JSON.parse(item?.data);
        return (
            item?.type === type &&
            !item?.isRead &&
            jsonParse?.nominatedOwner === user?.userInfo?._id &&
            jsonParse?.plot === plotData?.plot?._id
        );
    };

    // console.log('notifications: ', JSON.stringify(notifications, null, 2));
    const dataVotingApprove = data?.filter((item) =>
        filterWithType(item, TYPES.ownershipRequestVotingApproved),
    );
    const dataRejectApprove = data?.filter((item) =>
        filterWithType(item, TYPES.ownershipRequestVotingRejected),
    );

    const readNotify = async (_id, statusModal = 'success') => {
        setIsOpen(true);
        setTransferOwner(statusModal);
        await markReadNotification({ notificationIDs: [_id] });
        dispatch(notificationsSliceActions.markRead({ id: _id }));
    };

    const onCheckVotingApprove = async () => {
        if (dataVotingApprove?.length > 0) {
            await readNotify(dataVotingApprove[0]?._id);
        } else if (dataRejectApprove?.length > 0) {
            await readNotify(dataRejectApprove[0]?._id, 'fail');
        }
    };

    useEffect(() => {
        if (responseTransfer) {
            setIsOpen(responseTransfer?.visible);
            setTransferOwner(responseTransfer?.status);
        }
    }, [responseTransfer]);

    useEffect(() => {
        if (dataVotingApprove?.length > 0 || dataRejectApprove?.length > 0) {
            onCheckVotingApprove();
        }
    }, [dataVotingApprove, dataRejectApprove]);

    const restartRefAnnounce = () => {
        refAnnounce.current.announce = {
            visible: false,
            status: 'success',
        };
    };

    const closing = () => {
        setIsOpen(false);
        restartRefAnnounce();
    };

    const t = useTranslate();
    const { colors } = useTheme();
    return (
        <Modal
            isVisible={isOpen && plotData?.plot?.name}
            safeAreaTop={true}
            onBackdropPress={() => {
                closing();
            }}
        >
            <Box
                justifyContent="center"
                alignItems="center"
                px="20px"
                py="40px"
                borderRadius="8px"
                bgColor="white"
            >
                {transferOwner === 'success' ? (
                    <Verify />
                ) : (
                    <Decline width="48" height="48" color={colors.appColors.primaryRed} />
                )}
                <Text fontSize={16} fontWeight={700} py={'15px'}>
                    {t(StateModal[transferOwner].title)}
                </Text>
                <Text fontSize={14} fontWeight={400} px={'20px'} mb={'20px'} textAlign={'center'}>
                    {t(StateModal[transferOwner].description, { plot: plotData?.plot?.name || '' })}
                </Text>

                <Button bgColor="primary.600" onPress={() => closing()}>
                    {t('button.done')}
                </Button>
            </Box>
        </Modal>
    );
}
