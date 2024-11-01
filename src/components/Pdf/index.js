import { Base64 } from 'js-base64';
import { Box, Center, Spinner } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import Pdf from 'react-native-pdf';
import { getCertHash } from '../../rest_client/apiClient';
import CardanoBox from '../../screen/MyCert/CardanoBox';
import { SCREEN_WIDTH } from '../../util/Constants';

export default function Index({
    cert = null,
    url,
    pdfRef = null,
    height = '100%',
    setBase64,
    ...props
}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scale, setScale] = useState(1);
    const [hash, setHash] = useState(null);

    async function getHash() {
        if (!cert?.claimant) return;
        try {
            let { data } = await getCertHash(cert?.claimant, null, null);
            setHash(data?.hash);
        } catch (error) {}
    }

    async function downloadFile(url) {
        try {
            setLoading(true);
            const response = await RNFetchBlob.fetch('GET', url);
            let base64Str = '';
            try {
                base64Str = await response.base64();
            } catch (error) {
                let txt = await response.text();
                base64Str = Base64.encode(txt);
            }
            setData(base64Str);
            setBase64?.(base64Str);
            setLoading(false);
            return base64Str;
        } catch (error) {
            console.log(error, 'error');
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if (!url) return;
        getHash();
        downloadFile(url);
        setScale(1);
    }, [url, cert]);
    let style = {
        mt: '6px',
        h: height,
        w: 'full',
    };
    if (scale > 1 || loading) {
        style = {
            ...style,
            h: '100%',
            position: 'absolute',
        };
    }
    return (
        <Box {...style} {...props}>
            {!data && loading && (
                <Center h="full">
                    <Spinner />
                </Center>
            )}

            {data && (
                <>
                    <Pdf
                        ref={(pdf) => {
                            pdfRef.current = pdf;
                        }}
                        source={{ uri: 'data:application/pdf;base64,' + data }}
                        style={styles.pdf}
                        fitPolicy={2}
                        scale={1}
                        onScaleChanged={setScale}
                    />
                    {hash && <CardanoBox hash={hash} />}
                </>
            )}
        </Box>
    );
}

const styles = StyleSheet.create({
    pdf: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: '100%',
        backgroundColor: 'white',
    },
});
