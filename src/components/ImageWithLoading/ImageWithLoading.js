import { Box, Center, Image, Spinner } from 'native-base';
import React, { useEffect } from 'react';

const ImageWithLoading = ({ uri, w = '100%', h = '80%', resizeMode = 'contain' }) => {
    const [loadingImage, setLoadingImage] = React.useState(true);
    useEffect(() => {
        if (!uri?.includes('https://')) {
            setLoadingImage(false);
        }
    }, [uri]);

    return (
        <Box flex={1}>
            {!!uri && (
                <Image
                    alt=""
                    source={{
                        uri,
                    }}
                    w={w}
                    h={h}
                    display={loadingImage ? 'none' : 'flex'}
                    onLoad={() => {
                        setLoadingImage(false);
                    }}
                    resizeMode={resizeMode}
                />
            )}
            {loadingImage && (
                <Center flex={1}>
                    <Spinner />
                </Center>
            )}
        </Box>
    );
};

export default ImageWithLoading;
