import { useEffect, useState } from 'react';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { getInvitesByContractId } from '../../rest_client/apiClient';

const useContractSigner = ({ contract }) => {
    const [invites, setInvites] = useState([]);
    const user = useShallowEqualSelector((state) => state.user.userInfo);
    //invites group by date
    const invitesGroupByDate = () => {
        let res = [];
        invites.forEach((item) => {
            const date = new Date(item?.createdAt).toDateString();
            const index = res.findIndex((i) => i?.date === date);
            if (index === -1) {
                res.push({
                    date,
                    data: [item],
                });
            } else {
                res[index].data.push(item);
            }
        });
        return res;
    };

    const groupBySignedAt = () => {
        let res = [];
        invites.forEach((item) => {
            if (item?.status !== 'accepted') return;
            const date = new Date(item?.updatedAt).toDateString();
            const index = res.findIndex((i) => i?.date === date);
            if (index === -1) {
                res.push({
                    date,
                    data: [item],
                });
            } else {
                res[index].data.push(item);
            }
        });
        return res;
    };

    const fetchInvite = async () => {
        const { data } = await getInvitesByContractId(contract?._id);
        setInvites(data?.invites || []);
    };

    const showActionBtn = () => {
        let res = false;
        invites.forEach((item) => {
            if (item?.status !== 'pending') {
                return;
            }
            if (item?.receiver?._id === user?._id) {
                res = true;
            }
        });
        return res;
    };

    useEffect(() => {
        fetchInvite();
    }, []);

    return {
        invites,
        showActionBtn,
        fetchInvite,
        invitesGroupByDate,
        groupBySignedAt,
    };
};

export default useContractSigner;
