import { useEffect, useState } from 'react';
import { getCertificateOfUser } from '../rest_client/apiClient';

const useGetAllCert = () => {
    const [certList, setCertList] = useState([]);

    useEffect(() => {
        getAllCertificate();
    }, []);

    const getAllCertificate = async () => {
        const response = await getCertificateOfUser();
        if (response?.data) {
            let tmpData = response?.data;
            setCertList(tmpData);
        }
    };

    let freeCert = certList.filter(
        (item) => item?.landCertificateStatus === 'received' && item?.plotStatus === 'F&C',
    );
    // if (isBorrower) {
    //     freeCert = freeCert.filter((item) => item?.type == 'owner');
    // }

    return {
        certList,
        freeCert,
    };
};

export default useGetAllCert;
