import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';
import { getClaimantRequests, getClaimantRequestsAsClaimant } from '../../rest_client/apiClient';
import useUserInfo from '../useUserInfo';

const useReqClaimantHook = (plotID) => {
    const navigation = useNavigation();
    const [requestorReq, setRequestorReq] = useState([]);
    const [claimantReq, setClaimantReq] = useState([]);
    const requestorPendingReq = requestorReq.length > 0;
    const requestCount = claimantReq.length;
    const user = useUserInfo();
    const fetchReqAsRequestor = async () => {
        try {
            let { data } = await getClaimantRequests();
            data = data.filter((e) => {
                if (new Date(e.expiredAt).getTime() < Date.now()) {
                    return false;
                }
                if (e.plot !== plotID) {
                    return false;
                }
                if (e.status !== 'pending') {
                    return false;
                }
                return true;
            });
            setRequestorReq(data);
        } catch (error) {}
    };

    const fetchReqAsClaimant = async () => {
        try {
            let { data } = await getClaimantRequestsAsClaimant();
            data = data.filter((e) => {
                if (new Date(e.expiredAt).getTime() < Date.now()) {
                    return false;
                }
                if (e.plot !== plotID) {
                    return false;
                }
                if (e.status !== 'pending') {
                    return false;
                }
                return true;
            });
            setClaimantReq(data);
        } catch (error) {}
    };

    useEffect(() => {
        if (!user?.phoneNumber) {
            return;
        }
        fetchReqAsRequestor();
        fetchReqAsClaimant();
        let listener = EventRegister.addEventListener(EVENT_NAME.refetchPlotData, () => {
            fetchReqAsRequestor();
            fetchReqAsClaimant();
        });
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);

    useEffect(() => {
        navigation.setParams({
            requestorPendingReq,
            requestCount,
            claimantReq,
        });
    }, [requestorPendingReq, requestCount, claimantReq]);

    return {
        requestorPendingReq,
        requestCount,
    };
};

export default useReqClaimantHook;
