import { useState } from 'react';
import { downloadFileFromURI } from '../../util/script';

let fileNameObj = {};

function getFileName(plotName, isDownload = false) {
    let res = `Plot_${plotName}_commonlands_certificate`;
    if (!isDownload) {
        return res;
    }
    if (fileNameObj[res]) {
        fileNameObj[res] += 1;
        res = `Plot_${plotName}_commonlands_certificate(${fileNameObj[res]})`;
    } else {
        fileNameObj[res] = 1;
    }
    return res;
}

const useDownloadCertToDevice = () => {
    const [downloading, setDownloading] = useState(false);

    const onDownload = async (pdfURL, cert) => {
        setDownloading(true);
        try {
            await downloadFileFromURI(pdfURL, getFileName(cert.name, true) + '.pdf', true);
        } catch (error) {
            console.log(error);
        }
        setDownloading(false);
    };

    return { downloading, onDownload };
};

export default useDownloadCertToDevice;
