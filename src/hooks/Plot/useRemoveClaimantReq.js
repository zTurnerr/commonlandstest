import { useEffect, useState } from 'react';
import { getRemoveClaimantRequest } from '../../rest_client/apiClient';
import { showErr } from '../../util/showErr';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';
import { toMillisecond } from '../../util/time/getMiliSecond';
import useUserInfo from '../useUserInfo';

const useRemoveClaimantReq = (plotId) => {
    const navigation = useNavigation();
    const [removeClaimantReqs, setRemoveClaimantReqs] = useState([]);
    const [afterFirstFetch, setAfterFirstFetch] = useState(false);
    const user = useUserInfo();
    const fetchData = async () => {
        if (!plotId) return;
        try {
            let { data } = await getRemoveClaimantRequest(plotId);
            setRemoveClaimantReqs(
                data
                    ?.filter?.(
                        (item) =>
                            moment(item?.expiredAt).isAfter(moment()) &&
                            ['pending', 'accepted'].includes(item?.status) &&
                            !item?.isClaimantVoted,
                    )
                    .map((item) => {
                        return {
                            ...item,
                            expiredAt: toMillisecond(moment().toString()) + item?.willExpiredAt,
                        };
                    }),
            );
            setAfterFirstFetch(true);
        } catch (error) {
            showErr(error);
        }
    };

    useEffect(() => {
        let removingClaimants =
            removeClaimantReqs?.map((req) => {
                return {
                    claimant: req?.claimant,
                    expiredAt: req?.expiredAt,
                    _id: req?._id,
                    isAllOwnerApproved: req?.isAllOwnerApproved,
                };
            }) || [];
        if (afterFirstFetch) {
            navigation.setParams({ removingClaimants });
        }
        // listener
        const listener = EventRegister.addEventListener(EVENT_NAME.refetchRemoveClaimantReq, () => {
            fetchData();
        });
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, [removeClaimantReqs, afterFirstFetch]);

    useEffect(() => {
        if (!user?.phoneNumber) {
            return;
        }
        fetchData();
    }, []);

    return {
        removeClaimantReqs:
            removeClaimantReqs?.filter(
                (item) =>
                    moment(item?.expiredAt).isAfter(moment()) &&
                    ['pending', 'accepted'].includes(item?.status),
            ) || [],
    };
};

export default useRemoveClaimantReq;
