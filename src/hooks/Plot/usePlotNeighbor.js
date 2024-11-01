import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
    getInvitesByPlotID,
    inviteNeightbor,
    updateStatusInviteNeightbor,
} from '../../rest_client/apiClient';
import { INVITE_STATUS } from '../../util/Constants';
import { useDispatch } from 'react-redux';
import { toast } from '../../components/Toast';
import useTranslate from '../../i18n/useTranslate';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';

const usePlotNeighbor = (plotData, setPlotsInvites) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [plotNeighbors, setPlotNeighbors] = useState([]);
    const [plotNeighborIds, setPlotNeighborIds] = useState([]);
    const [selectedNeighborIndex, setSelectedNeighborIndex] = useState('');
    const t = useTranslate();

    const onInviteNeighbor = async (phoneNumber) => {
        try {
            let d = JSON.parse(JSON.stringify(plotNeighbors));
            d[selectedNeighborIndex] = {
                ...d[selectedNeighborIndex],
                inviteStatus: INVITE_STATUS.sent,
            };

            const inviteRes = await inviteNeightbor(
                {
                    neighborInfo: {
                        phoneNumber,
                        plotID: d[selectedNeighborIndex]._id,
                    },
                    inviterPlotID: plotData.plot._id,
                },
                navigation,
                dispatch,
            );
            let resInvites = await getInvitesByPlotID(
                { id: plotData.plot._id },
                navigation,
                dispatch,
            );

            const excludeStatus = [INVITE_STATUS.expired, INVITE_STATUS.cancelled];

            for (const invite of resInvites.data.created) {
                if (excludeStatus.includes(invite.status)) continue;
                if (invite._id !== inviteRes.data.inviteID) continue;

                d[selectedNeighborIndex].expiredAt = invite.expiredAt;
                d[selectedNeighborIndex].inviteID = invite._id;
            }

            setPlotsInvites(resInvites.data);
            EventRegister.emit(EVENT_NAME.refetchPlotData);
            setPlotNeighbors(d);
            toast.success(t('invite.inviteNeighborSuccess'));
        } catch (err) {
            throw err;
        }
    };

    const _acceptNeightbor = async () => {
        try {
            let d = JSON.parse(JSON.stringify(plotNeighbors));
            d[selectedNeighborIndex] = {
                ...d[selectedNeighborIndex],
                inviteStatus: INVITE_STATUS.accepted,
            };

            await updateStatusInviteNeightbor(
                {
                    inviteID: d[selectedNeighborIndex].inviteID,
                    accept: true,
                },
                navigation,
                dispatch,
            );
            let resInvites = await getInvitesByPlotID(
                { id: plotData.plot._id },
                navigation,
                dispatch,
            );

            setPlotsInvites(resInvites.data);
            setPlotNeighbors(d);
        } catch (err) {
            throw err;
        }
    };

    const onRejectNeighbor = async () => {
        try {
            let d = JSON.parse(JSON.stringify(plotNeighbors));
            d[selectedNeighborIndex] = {
                ...d[selectedNeighborIndex],
                inviteStatus: INVITE_STATUS.rejected,
            };

            await updateStatusInviteNeightbor(
                {
                    inviteID: d[selectedNeighborIndex].inviteID,
                    accept: false,
                },
                navigation,
                dispatch,
            );
            let resInvites = await getInvitesByPlotID(
                { id: plotData.plot._id },
                navigation,
                dispatch,
            );
            setPlotsInvites(resInvites.data);
            setPlotNeighbors(d);
        } catch (err) {
            throw err;
        }
    };

    return {
        plotNeighbors,
        setPlotNeighbors,
        plotNeighborIds,
        setPlotNeighborIds,
        selectedNeighborIndex,
        setSelectedNeighborIndex,
        onInviteNeighbor,
        _acceptNeightbor,
        onRejectNeighbor,
    };
};

export default usePlotNeighbor;
