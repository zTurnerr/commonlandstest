import { Avatar, Box, HStack, Text, useTheme } from 'native-base';
import React from 'react';
import Button from '../../components/Button';
import { ThumbDownIcon, ThumbUpIcon } from '../../components/Icons';
import useTranslate from '../../i18n/useTranslate';

export const ButtonPay = ({ active, type = 0, ...other }) => {
    const theme = useTheme();
    const t = useTranslate();
    const BUTTON_REPAY = [
        {
            Icon: ThumbDownIcon,
            text: t('components.cannotRepay'),
            color: theme.colors.danger[700],
        },
        {
            Icon: ThumbUpIcon,
            text: t('components.canRepay'),
            color: theme.colors.primary[600],
        },
    ];

    const buttonElement = BUTTON_REPAY[type];
    const color = active ? buttonElement.color : theme.colors.gray[400];
    return (
        <Button variant="outline" borderRadius={'0px'} borderColor={color} {...other}>
            <HStack space={1}>
                <buttonElement.Icon color={color} />
                <Text color={color} fontWeight={500} fontSize={12}>
                    {buttonElement.text}
                </Text>
            </HStack>
        </Button>
    );
};

const RecommendItem = ({ item, RightButtonComponent, children, haveRecommend, type }) => {
    const t = useTranslate();
    return (
        <Box bgColor={'white'} px={'20px'} py={'20px'} mb={'6px'}>
            {haveRecommend && (
                <Text mb={'10px'}>{t('askRecommendation.yourRecommendationThisClaimant')}</Text>
            )}
            <HStack>
                <Box flex={1}>
                    <HStack space={3}>
                        <Avatar
                            size={haveRecommend ? '40px' : '32px'}
                            source={{
                                uri: item?.avatar,
                            }}
                        />
                        <Box flex={1}>
                            <Text fontWeight={600}>{item?.fullName}</Text>
                            <Text color={'gray.700'}>{item?.phoneNumber}</Text>
                            {(type === 0 || type === 1) && (
                                <Box mt={'15px'}>
                                    <ButtonPay
                                        active
                                        type={type}
                                        _container={{ w: '120px', borderRadius: '8px', h: '35px' }}
                                        isDisabled
                                        _disabled={{
                                            opacity: 1,
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </HStack>
                </Box>
                {RightButtonComponent}
            </HStack>
            {children}
        </Box>
    );
};

export default RecommendItem;
