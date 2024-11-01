import { useEffect, useState } from 'react';
import { getInvitesByUser } from '../../rest_client/apiClient';
import useUserInfo from '../useUserInfo';

const useSignatoryList = () => {
    const [invites, setInvites] = useState([]);
    const user = useUserInfo();
    const fetchInvite = async () => {
        const { data } = await getInvitesByUser();
        setInvites(data?.invites || []);
    };

    useEffect(() => {
        if (!user?.phoneNumber) {
            return;
        }
        fetchInvite();
    }, []);

    return {
        invites,
        fetchInvite,
    };
};

export default useSignatoryList;
