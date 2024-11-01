import React, { useEffect, useState } from 'react';
import useTranslate from '../../../i18n/useTranslate';
import { CLAIMANTS, INVITE_STATUS } from '../../../util/Constants';
import InvitePeopleSheet from '../../CreatePlot/InvitePeople/InvitePeopleSheet';
import { getInvites, inviteClaimants } from '../../../rest_client/apiClient';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../../constants/eventName';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

export default function Index({ plotsInvites, plotData, isOpen, onClose }) {
    const t = useTranslate();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [invitesPending, setInvitesPending] = useState([]);
    useEffect(() => {
        setInvitesPending([]);
    }, [isOpen]);

    const onInvites = async (invitesPending) => {
        try {
            await inviteClaimants(
                {
                    claimants: invitesPending,
                    plotID: plotData?.plot?._id,
                },
                navigation,
                dispatch,
            );
            await getInvites(plotData?.plot?._id);
            onClose();
        } catch (err) {
            throw err;
        } finally {
            EventRegister.emit(EVENT_NAME.refetchPlotData);
        }
    };

    const validateData = (data) => {
        try {
            let error = '';
            plotsInvites?.created?.forEach((i) => {
                if (CLAIMANTS.includes(i.relationship) && i.status === INVITE_STATUS.sent) {
                    if (i.inviteePhoneNumber === data.phoneNumber) {
                        error = t('error.phoneInvitedAdded');
                    }
                    // if (i.relationship === data.relationship) {
                    //     error = `A plot can only have 1 ${data.relationship}.`;
                    // }
                }
            });
            plotData?.claimants?.forEach((i) => {
                if (CLAIMANTS.includes(i.role)) {
                    if (i.phoneNumber === data.phoneNumber) {
                        error = t('error.phoneInvitedAdded');
                    }
                    // if (i.relationship === data.relationship) {
                    //     error = `A plot can only have 1 ${data.relationship}.`;
                    // }
                }
            });
            return error;
        } catch (err) {
            return '';
        }
    };
    return (
        <InvitePeopleSheet
            isOpen={isOpen}
            onClose={onClose}
            onPress={() => onInvites(invitesPending)}
            list={invitesPending}
            setList={setInvitesPending}
            buttonLabel={t('button.submit')}
            validateData={validateData}
        />
    );
}
