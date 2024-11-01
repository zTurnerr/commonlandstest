/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
    Actionsheet,
    Box,
    Text,
    HStack,
    CloseIcon,
    Center,
    IconButton,
    Spinner,
} from 'native-base';
import useTranslate from '../../../i18n/useTranslate';
import { TouchableOpacity } from 'react-native';
import ClaimrankTag from '../../Tag/ClaimrankTag';
import { Claimrank } from '../../Icons';
import DownTriangle from '../../Icons/DownTriangle';
import { InfoCircle } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { getClaimRankText } from '../../../rest_client/apiClient';
import {
    closeClaimrankSheet,
    useGlobalClaimrankSheet,
} from '../../../redux/reducer/modal/claimrankSheetSlice';

export const SORT_KEY = {
    mostRecent: 'mostRecent',
    oldest: 'oldest',
    lowRated: 'lowRated',
    topRated: 'topRated',
};

// const rankList = ['N/A', 'Very Poor', 'Poor', 'Okay', 'Good', 'Very Good'];

// const getNextRank = (curKey) => {
//     const index = rankList.indexOf(curKey);
//     if (index === rankList.length - 1) {
//         return rankList[index];
//     }
//     return rankList[index + 1];
// };

const GrayCircle = () => {
    return <Box bg="gray.2700" w="12px" h="12px" borderRadius={'100px'}></Box>;
};

const SelectedCircle = () => {
    return (
        <Center w="12px" h="12px">
            <Center
                borderWidth={1}
                borderColor={'primary.600'}
                bg="white"
                borderRadius={'100px'}
                w="30px"
                h="30px"
                position={'absolute'}
                zIndex={1}
            >
                <Box position={'relative'} left={0.5}>
                    <Claimrank color={'#3EB6A7'} />
                </Box>
                <Box top={-20} position={'absolute'}>
                    <Box position={'relative'} left={0.45}>
                        <DownTriangle />
                    </Box>
                </Box>
            </Center>
        </Center>
    );
};

const getBgCode = (type) => {
    switch (type) {
        case 'N/A':
            return 'na';
        case 'Very Poor':
            return 'veryPoor';
        case 'Poor':
            return 'poor';
        case 'Okay':
            return 'okay';
        case 'Good':
            return 'good';
        case 'Very Good':
            return 'veryGood';
        case 'Excellent':
            return 'excellent';
        default:
            return 'na';
    }
};

const ClaimrankSheet = () => {
    const t = useTranslate();
    const [loading, setLoading] = useState(true);
    const [helperText, setHelperText] = useState('');
    const { curKey, isOpen, plotId } = useGlobalClaimrankSheet();
    const claimRanks = ['na', 'veryPoor', 'poor', 'okay', 'good', 'veryGood'];
    const navigation = useNavigation();

    const fetchHelper = async () => {
        setLoading(true);
        try {
            let { data } = await getClaimRankText({
                plotId: plotId,
                // expectedClaimrank: key,
                isContinues: true,
            });
            setHelperText(data?.helperText);
        } catch (error) {}
        setLoading(false);
    };

    useEffect(() => {
        if (plotId) {
            fetchHelper();
        }
    }, [plotId]);

    const MainContent = (
        <Box pb="30px" px="20px" w="full">
            <HStack pr="30px" mb="15px" justifyContent={'space-between'} alignItems={'center'}>
                <ClaimrankTag type={curKey} />
                <IconButton
                    _pressed={{
                        bg: 'transparent',
                        opacity: 0.5,
                    }}
                    onPress={closeClaimrankSheet}
                    position={'absolute'}
                    right={-20}
                    top={-20}
                >
                    <CloseIcon color="black" />
                </IconButton>
            </HStack>
            <Text mb="40px" fontWeight={500}>
                {t('trustscore.desc.' + getBgCode(curKey))}
            </Text>
            <HStack mb="70px" alignItems={'center'}>
                {claimRanks.map((rank, index) => {
                    return (
                        <>
                            <Box key={rank}>
                                {getBgCode(curKey) === rank ? <SelectedCircle /> : <GrayCircle />}
                                <Text
                                    fontWeight={500}
                                    textAlign={'center'}
                                    top={7}
                                    left={-20}
                                    w="50px"
                                    position={'absolute'}
                                    color={getBgCode(curKey) === rank ? 'primary.600' : 'gray.2700'}
                                >
                                    {t('trustscore.' + rank)}
                                </Text>
                            </Box>
                            {index + 1 < claimRanks?.length && (
                                <Box bg="#EDF6FB" h="4px" flex={1}></Box>
                            )}
                        </>
                    );
                })}
            </HStack>
            {helperText && (
                <Box mb="20px" px="40px" py="15px" bg="primary.1800" borderRadius={'8px'}>
                    <Text textAlign={'center'} color="blue.100" fontWeight={500}>
                        {helperText}
                    </Text>
                </Box>
            )}
            <TouchableOpacity
                onPress={() => {
                    closeClaimrankSheet();
                    navigation.navigate('ClaimrankSystem');
                }}
            >
                <HStack alignItems={'center'}>
                    <InfoCircle size={24} color={'#3EB6A7'} />
                    <Text fontWeight={500} ml="5px" color="primary.600">
                        {t('rating.learnAboutClaimrank')}
                    </Text>
                </HStack>
            </TouchableOpacity>
        </Box>
    );

    return (
        <Actionsheet isOpen={isOpen} onClose={closeClaimrankSheet}>
            <Actionsheet.Content alignItems="flex-start">
                {!loading && MainContent}
                {loading && (
                    <Center w="full" py="100px">
                        <Spinner />{' '}
                    </Center>
                )}
            </Actionsheet.Content>
        </Actionsheet>
    );
};

export default React.memo(ClaimrankSheet);
