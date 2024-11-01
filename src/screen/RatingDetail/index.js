import React from 'react';
import { Box, Text, ScrollView, CloseIcon, VStack, Center, HStack } from 'native-base';
import HeaderPage from '../../components/HeaderPage';
import useTranslate from '../../i18n/useTranslate';
import MedalStar from '../../components/Icons/MedalStar';
import AlertCircleFilled from '../../components/Icons/AlertCircleFilled';

const PX = '20px';
const CELL_HEIGHT = '30px';

// const getBgCode = (type) => {
//     switch (type) {
//         case 'N/A':
//             return 'na';
//         case 'Very Poor':
//             return 'veryPoor';
//         case 'Poor':
//             return 'poor';
//         case 'Okay':
//             return 'okay';
//         case 'Good':
//             return 'good';
//         case 'Very Good':
//             return 'veryGood';
//         case 'Excellent':
//             return 'excellent';
//         default:
//             return 'na';
//     }
// };

const getTitleCell = ({ bg, text }) => {
    return (
        <Center py="5px" bg={bg} w="115px" h={CELL_HEIGHT}>
            <Text fontSize={'11px'} fontWeight={700} color="white">
                {text}
            </Text>
        </Center>
    );
};

const getTableRow = ({
    bg = 'white',
    textArr,
    color = 'black',
    fontWeight = 700,
    hasBorder = true,
}) => {
    const borderStyle = hasBorder ? { borderColor: 'gray.1400', borderWidth: 1 } : {};

    return (
        <HStack space={1}>
            {textArr.map((text, index) => (
                <Center
                    key={index}
                    bg={bg}
                    w="45px"
                    h={CELL_HEIGHT}
                    px="5px"
                    justifyContent={'center'}
                    {...borderStyle}
                >
                    <Text fontSize={'11px'} fontWeight={fontWeight} color={color}>
                        {text}
                    </Text>
                </Center>
            ))}
        </HStack>
    );
};

const RatingDetail = () => {
    const t = useTranslate();

    const getRatingScore = ({
        firstText = t('contract.from'),
        firstNum = 0,
        secondText = '',
        secondNum = 0,
        key = '',
    }) => {
        const tagBg = 'trustScore.' + key;
        const tagText = 'trustscore.' + key;
        return (
            <HStack
                mt="3px"
                px="10px"
                py="10px"
                bg="gray.100"
                alignItems={'center'}
                space={2}
                borderRadius={'8px'}
            >
                <Text fontWeight={700}>{firstText}</Text>
                <Center bg="gray.2600" py="1px" px="8px" borderRadius={'100px'}>
                    <Text fontWeight={700} color={'white'}>
                        {firstNum}
                    </Text>
                </Center>
                {!!secondText && <Text fontWeight={700}>{secondText}</Text>}
                {!!secondNum && (
                    <Center bg="gray.2600" py="1px" px="8px" borderRadius={'100px'}>
                        <Text fontWeight={700} color={'white'}>
                            {secondNum}
                        </Text>
                    </Center>
                )}
                <Box flex={1}></Box>
                <Center
                    borderTopRightRadius={'8px'}
                    borderBottomLeftRadius={'8px'}
                    bg={tagBg}
                    p="5px"
                    flexDirection={'row'}
                >
                    {key !== 'na' && <MedalStar />}
                    <Text ml="3px" fontSize={'10px'} fontWeight={600} color={'white'}>
                        {t(tagText)}
                    </Text>
                </Center>
            </HStack>
        );
    };

    return (
        <Box h={'100%'} w={'100%'}>
            <HeaderPage title={t('rating.ratingDetails')} backIcon={<CloseIcon />} />
            <ScrollView pb="20px">
                <Box bg="white" px={PX} mt="10px" py="15px">
                    <Text>{t('rating.ratingViaCommonlands1')}</Text>
                    <ScrollView mt="15px" horizontal={true}>
                        <VStack space={1} w={'115px'}>
                            {getTitleCell({ bg: 'primary.1400', text: t('rating.claimStrength') })}
                            {getTitleCell({ bg: 'gray.2500', text: '' })}
                            {getTitleCell({ bg: 'strength.na', text: t('trustscore.na') })}
                            {getTitleCell({
                                bg: 'strength.veryPoor',
                                text: t('trustscore.veryPoor'),
                            })}
                            {getTitleCell({ bg: 'strength.poor', text: t('trustscore.poor') })}
                            {getTitleCell({ bg: 'strength.okay', text: t('trustscore.okay') })}
                            {getTitleCell({ bg: 'strength.good', text: t('trustscore.good') })}
                            {getTitleCell({
                                bg: 'strength.veryGood',
                                text: t('trustscore.veryGood'),
                            })}
                        </VStack>
                        <VStack ml="3px" space={1}>
                            <Center h={CELL_HEIGHT} bg="yellow.700">
                                <Text fontSize={'11px'} color={'white'} fontWeight={700}>
                                    {t('rating.trustScore1')}
                                </Text>
                            </Center>
                            {getTableRow({
                                bg: 'yellow.1600',
                                textArr: [
                                    t('rating.numberStar', { number: 0 }),
                                    t('rating.numberStar', { number: 1 }),
                                    t('rating.numberStar', { number: 2 }),
                                    t('rating.numberStar', { number: 3 }),
                                    t('rating.numberStar', { number: 4 }),
                                    t('rating.numberStar', { number: 5 }),
                                ],
                                color: 'brown.100',
                                fontWeight: 400,
                                hasBorder: false,
                            })}
                            {getTableRow({
                                textArr: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
                            })}
                            {getTableRow({
                                textArr: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
                            })}
                            {getTableRow({
                                textArr: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
                            })}
                            {getTableRow({
                                textArr: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
                            })}
                            {getTableRow({
                                textArr: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
                            })}
                            {getTableRow({
                                textArr: [0.5, 0.6, 0.7, 0.8, 0.9, 1],
                            })}
                        </VStack>
                    </ScrollView>
                    <HStack w="full" mt="20px">
                        <AlertCircleFilled />
                        <Text flex={1} ml="5px" fontWeight={500}>
                            {t('rating.trustScoreAlert')}
                        </Text>
                    </HStack>
                </Box>
                <Box bg="white" px={PX} mt="10px" py="15px">
                    <Text mb="20px" fontWeight={600} fontSize={'14px'}>
                        {t('rating.ratingScore')}
                    </Text>
                    {getRatingScore({
                        firstText: t('rating.equal'),
                        firstNum: 0,
                        key: 'na',
                    })}
                    {getRatingScore({
                        firstNum: 0,
                        secondText: t('rating.lessThan'),
                        secondNum: 0.2,
                        key: 'veryPoor',
                    })}
                    {getRatingScore({
                        firstNum: 0.2,
                        secondText: t('rating.lessThan'),
                        secondNum: 0.4,
                        key: 'poor',
                    })}
                    {/* good */}
                    {getRatingScore({
                        firstNum: 0.4,
                        secondText: t('rating.lessThan'),
                        secondNum: 0.6,
                        key: 'good',
                    })}
                    {/* very good */}
                    {getRatingScore({
                        firstNum: 0.6,
                        secondText: t('rating.lessThan'),
                        secondNum: 0.8,
                        key: 'veryGood',
                    })}
                    {/* excellent */}
                    {getRatingScore({
                        firstNum: 0.8,
                        secondText: t('rating.lessThanOrEqual'),
                        secondNum: 1,
                        key: 'excellent',
                    })}
                </Box>
            </ScrollView>
        </Box>
    );
};

export default RatingDetail;
