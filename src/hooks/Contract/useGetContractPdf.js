import { useEffect, useState } from 'react';
import { getContractHistory } from '../../rest_client/apiClient';
import { downloadFileFromURI } from '../../util/script';

let counter = {};
let timer = null;

const useGetContractPdf = (contract) => {
    const [data, setData] = useState([]);
    const [downloading, setDownloading] = useState(false);
    let canDownload = data?.contractHistory?.url;

    const getFileName = () => {
        //Name: Contract_{contractName}_commonlands_certificate.pdf
        counter[contract?.name] = counter[contract?.name] ? counter[contract?.name] + 1 : 1;
        let name = `Contract_${contract?.name}_commonlands_certificate.pdf`;
        if (counter[contract?.name] > 1) {
            name = `Contract_${contract?.name}_commonlands_certificate_${counter[contract?.name]}.pdf`;
        }
        return name;
    };

    const fetchData = async () => {
        if (contract?.status !== 'completed') {
            return;
        }
        try {
            let { data } = await getContractHistory(contract?._id, null, null);
            setData(data);
            if (data?.contractHistory?.status !== 'completed') {
                timer = setTimeout(() => {
                    fetchData();
                }, 5000);
            }
        } catch (error) {
            timer = setTimeout(() => {
                fetchData();
            }, 5000);
        }
    };

    const downloadPdf = async () => {
        setDownloading(true);
        try {
            // await downloadFileFromURI('https://www.orimi.com/pdf-test.pdf', getFileName(), true);
            await downloadFileFromURI(data?.contractHistory?.url, getFileName(), true);
        } catch (error) {}
        setDownloading(false);
    };

    useEffect(() => {
        fetchData();
        return () => {
            clearTimeout(timer);
        };
    }, [contract]);

    return {
        fetchData,
        data,
        downloadPdf,
        downloading,
        canDownload,
    };
};

export default useGetContractPdf;
