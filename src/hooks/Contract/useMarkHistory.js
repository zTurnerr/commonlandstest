import { useEffect, useState } from 'react';
import { getMarkHistory } from '../../rest_client/apiClient';

const useMarkHistory = (contractId) => {
    const [markHistory, setMarkHistory] = useState([]);
    const fetchMarkHistory = async (contractId) => {
        try {
            let { data } = await getMarkHistory(contractId);
            setMarkHistory(data?.history);
        } catch (error) {}
    };

    useEffect(() => {
        fetchMarkHistory(contractId);
    }, [contractId]);

    return { markHistory };
};

export default useMarkHistory;
