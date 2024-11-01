import useTranslate from '../../../i18n/useTranslate';
import { Box, Button, HStack, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import ImageWithLoading from '../../ImageWithLoading/ImageWithLoading';

let isMounted = false;
const ReviewPhotoStep = ({
    onSubmit = async () => {},
    uri = '',
    showTxt = true,
    onRetake = () => {},
    showRetake = false,
    _containerStyle = {},
    loadingProp = false,
}) => {
    const [loading, setLoading] = useState(false);
    const t = useTranslate();

    useEffect(() => {
        isMounted = true;
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <Box {..._containerStyle}>
            {showTxt && (
                <Box>
                    <Text mt="16px" fontSize={'14px'} fontWeight={500}>
                        {`${t('others.step')} 1`}
                    </Text>
                    <Text color="gray.1800">{t('contract.takePhotoOfFace')}</Text>
                </Box>
            )}
            <Box w="full" h="330px" bg="gray.400" mt="15px">
                {/* <Image source={{ uri }} alt="image base" resizeMode="cover" h="full" w="full" /> */}
                <ImageWithLoading uri={uri} w="full" h="full" resizeMode="cover" />
            </Box>
            <HStack mt="37px" space={4}>
                {showRetake && (
                    <Button
                        onPress={onRetake}
                        flex={1}
                        isDisabled={loading || loadingProp}
                        variant={'outline'}
                    >
                        {t('button.retake')}
                    </Button>
                )}
                <Button
                    onPress={async () => {
                        setLoading(true);
                        await onSubmit();
                        if (isMounted) {
                            setLoading(false);
                        }
                    }}
                    flex={1}
                    isLoading={loading || loadingProp}
                >
                    {t('button.submit')}
                </Button>
            </HStack>
        </Box>
    );
};

export default ReviewPhotoStep;
