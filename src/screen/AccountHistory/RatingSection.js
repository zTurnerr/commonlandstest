/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { Box, Center, ChevronDownIcon, HStack, Text, useTheme } from 'native-base';
import ExploreIcon from '../../components/Icons/ExploreIcon';
import useTranslate from '../../i18n/useTranslate';
import FiveStar from '../../components/Star/FiveStar';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MedalStar from '../../components/Icons/MedalStar';
import { InfoCircle } from 'iconsax-react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ClaimrankTag from '../../components/Tag/ClaimrankTag';
import { toFixedNoZero } from '../../util/utils';
import moment from 'moment';
import {
    SORT_KEY,
    useSortContractSheet,
} from '../../components/ActionSheet/Rating/SortContractSheet';
import { FlatList, LogBox } from 'react-native';
import { getTrustScoreBgCode } from '../../util/trustcore';

const PX = '20px';

const ContractItem = React.memo(({ data }) => {
    const t = useTranslate();
    return (
        <Box px={PX} bg="white" py="20px" mb="5px">
            <HStack alignItems={'center'} justifyContent={'space-between'}>
                <Text fontWeight={700} fontSize={'14px'}>
                    {t('rating.contractWithName', {
                        name: data?.contract,
                    })}
                </Text>
                <Box borderColor={'gray.1400'} borderWidth={1} p="3px" borderRadius={'6px'}>
                    <Text>
                        {data?.role === 'signer'
                            ? t('rating.joinAsSigner')
                            : t('rating.joinAsContractCreator')}
                    </Text>
                </Box>
            </HStack>
            {/*  */}
            <HStack mt="10px" alignItems={'center'}>
                <Box mr="15px" borderRadius={'6px'} p="5px" bg="appColors.secondaryGreen">
                    <Text color="white" fontWeight={600}>
                        {t('components.successful')}
                    </Text>
                </Box>
                <FiveStar size={20} currentStar={data?.rating} />
            </HStack>
            {/*  */}
            <Text mt="10px" color="gray.2400" fontWeight={400}>
                {t('rating.ratedBy', {
                    name: data?.ratedBy,
                    date: moment(data?.ratedAt).format('MMM DD, YYYY'),
                })}
            </Text>
        </Box>
    );
});

const RatingSection = ({ certData }) => {
    const navigation = useNavigation();
    const theme = useTheme();
    const t = useTranslate();
    const sortSheetHook = useSortContractSheet();
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, []);

    useEffect(() => {
        switch (sortSheetHook.selectedSort) {
            case SORT_KEY.mostRecent:
                certData?.ratingHistory.sort((a, b) => {
                    return new Date(b?.ratedAt) - new Date(a?.ratedAt);
                });
                break;
            case SORT_KEY.oldest:
                certData?.ratingHistory.sort((a, b) => {
                    return new Date(a?.ratedAt) - new Date(b?.ratedAt);
                });
                break;
            case SORT_KEY.topRated:
                certData?.ratingHistory.sort((a, b) => {
                    return b?.rating - a?.rating;
                });
                break;
            case SORT_KEY.lowRated:
                certData?.ratingHistory.sort((a, b) => {
                    return a?.rating - b?.rating;
                });
                break;
            default:
                break;
        }
        setRerender(!rerender);
        sortSheetHook.close();
    }, [sortSheetHook.selectedSort]);

    const Circle = (
        <AnimatedCircularProgress
            size={240}
            width={18}
            rotation={-90}
            fill={certData?.rating * 100}
            lineCap="round"
            fillLineCap="round"
            arcSweepAngle={181}
            tintColor={theme.colors.primary[1400]}
            backgroundColor={theme.colors.gray[1700]}
            padding={0}
        />
    );

    const AfterCircle = (
        <Center w="full" position={'absolute'} top={8}>
            <Text fontSize={'32px'} fontWeight={600}>
                {toFixedNoZero(certData?.rating, 3)}
            </Text>
            <Center
                borderTopRightRadius={'16px'}
                borderBottomLeftRadius={'16px'}
                py="10px"
                px="15px"
                bg={'trustScore.' + getTrustScoreBgCode(certData?.ratingLabel)}
                flexDirection={'row'}
                mt="10px"
            >
                <MedalStar />
                <Text ml="5px" color="white" fontWeight={600}>
                    {certData?.ratingLabel || t('trustscore.na')}
                </Text>
            </Center>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('RatingDetail');
                }}
            >
                <HStack mt="20px" alignItems={'center'}>
                    <InfoCircle color={theme.colors.gray[700]} />
                    <Text ml="5px" fontWeight={500} color={'gray.700'}>
                        {t('rating.viewRatingDetails')}
                    </Text>
                </HStack>
            </TouchableOpacity>
            <HStack w="full" mt="20px" alignItems={'center'}>
                <Box
                    borderLeftColor={'appColors.secondaryGreen'}
                    borderLeftWidth={2}
                    px="15px"
                    flex={1}
                    py="5px"
                >
                    <Center borderRadius={'100px'} py="3px" bg="appColors.secondaryGreen" w="32px">
                        <Text color="white" fontSize={'13px'} fontWeight={600}>
                            {certData?.successContracts}
                        </Text>
                    </Center>
                    <Text color="gray.600" mt="5px" fontSize={'10px'} fontWeight={500}>
                        {certData?.successContracts > 1
                            ? t('rating.contractSuccess')
                            : t('rating.1contractSuccess')}
                    </Text>
                </Box>
                <Box borderLeftColor={'danger.400'} borderLeftWidth={2} px="15px" flex={1} py="5px">
                    <Center borderRadius={'100px'} py="3px" bg="danger.400" w="32px">
                        <Text color="white" fontSize={'13px'} fontWeight={600}>
                            {certData?.failedContracts}
                        </Text>
                    </Center>
                    <Text color="gray.600" mt="5px" fontSize={'10px'} fontWeight={500}>
                        {certData?.failedContracts > 1
                            ? t('rating.contractDefault')
                            : t('rating.1contractDefault')}
                    </Text>
                </Box>
            </HStack>
        </Center>
    );

    return (
        <Box mt="10px">
            <HStack py="20px" alignItems={'center'} bg="white" px={PX}>
                <ExploreIcon filled color={theme.colors.primary[600]} />
                <Text flex={1} ml="5px" fontWeight={500}>
                    {t('rating.claimRank')}
                </Text>
                <ClaimrankTag
                    type={certData?.claimRank}
                    _container={{
                        mr: '0px',
                    }}
                />
            </HStack>
            <Box px={PX} mt="10px" bg="white">
                <HStack py="20px" alignItems={'center'}>
                    <ExploreIcon filled color={theme.colors.primary[600]} />
                    <Text flex={1} ml="5px" fontWeight={500}>
                        {t('rating.trustScore')}
                    </Text>
                    <FiveStar size={20} disabled currentStar={certData?.trustScore} />
                </HStack>
                <Center pb="30px">
                    {Circle}
                    {AfterCircle}
                </Center>
            </Box>
            <HStack alignItems={'center'} justifyContent={'space-between'}>
                <Text my="20px" px={PX} fontSize={'14px'} fontWeight={600}>
                    {t('rating.ratingViaCommonlands')}
                </Text>
                <TouchableOpacity onPress={sortSheetHook.open}>
                    <HStack alignItems={'center'} pr="15px">
                        <Text color="primary.600" mr="5px">{`${t('sort.sortBy')} ${t(
                            `sort.${sortSheetHook.selectedSort}`,
                        )}`}</Text>
                        <Box position={'relative'} top={'1px'}>
                            <ChevronDownIcon color="primary.600" size={3} />
                        </Box>
                    </HStack>
                </TouchableOpacity>
            </HStack>
            <FlatList
                data={certData?.ratingHistory}
                keyExtractor={(item) => item?.ratedAt}
                renderItem={({ item }) => <ContractItem data={item} />}
            />

            {sortSheetHook.Component()}
        </Box>
    );
};

export default RatingSection;
