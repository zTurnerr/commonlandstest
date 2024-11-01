import React, { useEffect, useState } from 'react';
import { getContractTransferRequest } from '../../rest_client/apiClient';

const useTransferReq = (contract) => {
    const [transferReqs, setTransferReqs] = useState([]);
    const isExistPending = () => {
        return transferReqs.some((req) => req.status === 'pending' && req.isExpired === false);
    };

    const fetchData = async () => {
        try {
            let { data } = await getContractTransferRequest(contract?._id);
            setTransferReqs(data?.requests || []);
        } catch (error) {}
    };

    useEffect(() => {
        fetchData();
    }, [contract]);

    return {
        transferReqs,
        isExistPending,
    };
};

export default useTransferReq;
