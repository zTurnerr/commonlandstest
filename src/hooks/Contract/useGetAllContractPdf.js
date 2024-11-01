import { useEffect, useState } from 'react';
import { getSignerCertificates } from '../../rest_client/apiClient';
import { downloadFileFromURI } from '../../util/script';
import { EventRegister } from 'react-native-event-listeners';

let lock = false;
let counter = {};
let timer = null;

// const mockData = {
//     signerCertificates: [
//         {
//             __v: 0,
//             _id: '667ba0bebe0827c7d1782e42',
//             contract: '6666a8b787d15b17b985108d',
//             createdAt: '2024-06-26T05:01:50.853Z',
//             hash: '79ea7fde86b1ba0fc85e4ad36dbeb21569ca06577f0e0d805fa21b5e37ba873f',
//             status: 'pending',
//             txHash: '2048141847d2e95cc4eef23d1ba3d23037bc6c6731a0bbc78c23e029058d099a',
//             updatedAt: '2024-06-26T05:02:03.136Z',
//             url: 'https://commonlands-dev-bucket-aws-us-east-1.s3.us-east-1.amazonaws.com/667ba0bebe0827c7d1782e42.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZBVJQENNESITE3MS%2F20240626%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240626T050624Z&X-Amz-Expires=604800&X-Amz-Signature=0008a510aebb78e3e44ce51a5d233c227bfb707dbd46c88a1fd248a131c6e8c4&X-Amz-SignedHeaders=host&x-id=GetObject',
//         },
//         {
//             __v: 0,
//             _id: '667ba0cbbe0827c7d1782e4e',
//             contract: '6666a8b787d15b17b985108d',
//             createdAt: '2024-06-26T05:02:03.542Z',
//             hash: '3b24ce0c389cf746b967ede623d86668b914227665c9c6f0976a9f90d74c2c09',
//             status: 'completed',
//             txHash: 'f6486c75a35b48e0fbe4fe19922c900f1274b90cd155c185ce93a8a8c5b80d65',
//             updatedAt: '2024-06-26T05:02:15.864Z',
//             url: 'https://commonlands-dev-bucket-aws-us-east-1.s3.us-east-1.amazonaws.com/667ba0cbbe0827c7d1782e4e.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZBVJQENNESITE3MS%2F20240626%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240626T050624Z&X-Amz-Expires=604800&X-Amz-Signature=1f8cff95f8defa0a75d62856ab8163d74080f4692616c2969542a4b777617c23&X-Amz-SignedHeaders=host&x-id=GetObject',
//         },
//     ],
// };
// let mockCounter = 0;
// const mockGetSignerCertificates = async () => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     mockCounter++;
//     if (mockCounter >= 2) {
//         mockData.signerCertificates[0].status = 'completed';
//     }

//     return { data: mockData };
// };

const useGetAllContractPdf = (contract) => {
    const [data, setData] = useState([]);
    const [refetchCounter, setRefetchCounter] = useState(0);
    const [downloading, setDownloading] = useState(false);

    const getFileName = (userId) => {
        let userName = contract?.signers?.find((signer) => signer?.user?._id === userId)?.user
            ?.fullName;
        // replace all spaces with underscore
        userName = userName.replace(/\s/g, '_');
        let certName = `${userName}_Contract_${contract?.name}_commonlands_certificate.pdf`;
        counter[certName] = counter[certName] ? counter[certName] + 1 : 1;
        if (counter[certName] > 1) {
            certName = `${userName}_Contract_${contract?.name}_commonlands_certificate_${counter[certName]}.pdf`;
        }
        return certName;
    };

    const fetchData = async () => {
        if (contract?.status !== 'completed') {
            return;
        }
        try {
            let { data } = await getSignerCertificates(contract?._id, null, null);
            setData(data);
            EventRegister.emit('rerender');
            if (!data?.signerCertificates?.every((cert) => cert.status === 'completed')) {
                timer = setTimeout(() => {
                    fetchData();
                }, 5000);
            }
        } catch (error) {
            console.log(error, refetchCounter);
            timer = setTimeout(() => {
                fetchData();
            }, 5000);
        }
    };

    const downloadPdf = async (userId) => {
        if (lock) {
            return;
        }
        lock = true;
        setDownloading(true);
        try {
            await downloadFileFromURI(
                data?.signerCertificates?.find((cert) => cert?.user?._id === userId)?.url,
                getFileName(userId),
                true,
            );
        } catch (error) {}
        setDownloading(false);
        lock = false;
    };

    const downloadAll = async () => {
        if (lock) {
            return;
        }
        lock = true;
        setDownloading(true);
        try {
            await Promise.all(
                data?.signerCertificates.map(async (cert) => {
                    await downloadFileFromURI(cert?.url, getFileName(cert?.user?._id), true);
                }),
            );
        } catch (error) {}
        setDownloading(false);
        lock = false;
    };

    const canDownload = (userId) => {
        return (
            data?.signerCertificates?.find((cert) => cert?.user?._id === userId)?.status ===
            'completed'
        );
    };

    const canDownloadAll = () => {
        return data?.signerCertificates?.every((cert) => cert.status === 'completed');
    };

    useEffect(() => {
        fetchData();
    }, [contract]);

    useEffect(() => {
        const listener = EventRegister.addEventListener('rerender', () => {
            setRefetchCounter((prev) => prev + 1);
        });
        return () => {
            EventRegister.removeEventListener(listener);
            clearTimeout(timer);
        };
    }, []);

    return {
        fetchData,
        data,
        downloadPdf,
        downloadAll,
        downloading,
        canDownload,
        canDownloadAll,
    };
};

export default useGetAllContractPdf;
