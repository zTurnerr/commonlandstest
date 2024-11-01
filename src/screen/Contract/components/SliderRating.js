import { ArrowBackIcon, ArrowForwardIcon, Avatar, Box, Button, HStack, Text } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { EVENT_NAME } from '../../../constants/eventName';
import useTranslate from '../../../i18n/useTranslate';
import { SCREEN_WIDTH } from '../../../util/Constants';
import FiveStar from '../../../components/Star/FiveStar';
import useUserInfo from '../../../hooks/useUserInfo';
import { showErr } from '../../../util/showErr';
import { rateContract } from '../../../rest_client/apiClient';
import moment from 'moment';
const width = SCREEN_WIDTH;

const RatingStar = ({
    name = '',
    phoneNumber = '',
    star = 0,
    image = '',
    onChooseStar = () => {},
    disabled = false,
}) => {
    return (
        <Box
            flexDir={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            mt={5}
            w={width || 'full'}
        >
            <Avatar bg={'primary.600'} size={'xl'} source={{ uri: image }} />
            <Text mt={3} fontSize={'16px'} fontWeight={600}>
                {name}
            </Text>
            <Text color={'gray.700'}>{phoneNumber}</Text>
            <HStack space={0} my={5}>
                <FiveStar onChooseStar={onChooseStar} currentStar={star} disabled={disabled} />
            </HStack>
        </Box>
    );
};

const SliderRating = ({ contract = {} }) => {
    const user = useUserInfo();
    const [index, setIndex] = useState(0);
    const [ratingState, setRatingState] = useState({});
    const swiper = useRef();
    const isCreator = user?._id === contract?.creator?.user?._id;
    const isSigner = contract?.signers?.some((e) => e?.user?._id === user?._id);

    const [loading, setLoading] = useState(false);

    const getRatingList = () => {
        if (isCreator) {
            return contract?.signers;
        }
        if (isSigner) {
            return [contract?.creator];
        }
        return [];
    };
    const ratingListUser = getRatingList();
    const onSubmitRating = async () => {
        setLoading(true);
        try {
            await rateContract(
                contract?._id,
                {
                    vote: ratingState[ratingListUser[index]?.user?._id]?.tmpStar,
                    beingVoterId: ratingListUser[index]?.user?._id,
                },
                null,
                null,
            );
            EventRegister.emit(EVENT_NAME.refreshContract, {
                afterRefresh: () => {
                    setLoading(false);
                },
            });
        } catch (error) {
            showErr(error);
            setLoading(false);
        }
    };

    const nextPress = () => {
        if (ratingListUser?.length > index + 1) {
            setIndex(index + 1);
            swiper.current.scrollToIndex({ index: index + 1 });
        }
    };

    const prevPress = () => {
        if (index > 0) {
            setIndex(index - 1);
            swiper.current.scrollToIndex({ index: index - 1 });
        }
    };

    const onRating = (_star, userId) => {
        setRatingState({
            ...ratingState,
            [userId]: {
                ...ratingState[userId],
                tmpStar: _star,
            },
        });
    };

    const t = useTranslate();

    useEffect(() => {
        let _ratingState = ratingState;
        contract?.rating?.signerRating?.forEach((item) => {
            _ratingState[item?.signer] = {
                ..._ratingState[item?.user?._id],
                ...item,
                tmpStar: item?.rating || 0,
            };
        });
        contract?.rating?.creatorRating?.forEach((item) => {
            if (item?.signerRating !== user?._id) {
                return;
            }
            _ratingState[contract?.creator?.user?._id] = {
                ..._ratingState[contract?.creator?.user?._id],
                ...item,
                tmpStar: item?.rating || 0,
            };
        });
        setRatingState(_ratingState);
    }, [contract]);

    if (contract?.status !== 'completed' || ratingListUser?.length === 0) {
        return null;
    }

    return (
        <Box py={3} pb="40px" bgColor={'white'}>
            <Text textAlign={'center'} fontWeight={400}>
                {isCreator ? t('contract.howSatisfied') : t('contract.howSatisfiedCreator')}
            </Text>
            <SwiperFlatList
                data={ratingListUser}
                index={index}
                ref={(_ref) => {
                    swiper.current = _ref;
                }}
                onChangeIndex={(e) => {
                    setIndex(e.index);
                }}
                renderItem={({ item }) => (
                    <RatingStar
                        name={item?.user?.fullName}
                        phoneNumber={item?.user?.phoneNumber}
                        image={item?.user?.avatar}
                        star={ratingState[item?.user?._id]?.tmpStar || 0}
                        onChooseStar={(star) => onRating(star, item?.user?._id)}
                        disabled={loading || ratingState[item?.user?._id]?.isRated}
                    />
                    // <Text>{item?.user?.fullName}</Text>
                )}
            ></SwiperFlatList>
            <Box
                flexDir={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                w="full"
                mt={3}
                px={3}
            >
                {ratingListUser?.length > 1 && (
                    <Button
                        bg={'black'}
                        borderRadius={'full'}
                        w={'50px'}
                        isDisabled={index === 0}
                        onPress={prevPress}
                        _pressed={{ bg: 'gray.500' }}
                    >
                        <ArrowBackIcon color={'white'} size={5} />
                    </Button>
                )}

                {ratingState[ratingListUser[index]?.user?._id]?.isRated ? (
                    <Text textAlign={'center'} flex={1} color="gray.700" fontWeight={500}>
                        {t('components.submittedAtTime', {
                            time: moment(
                                ratingState[ratingListUser[index]?.user?._id]?.ratedAt,
                            ).format('MMM DD, YYYY'),
                        })}
                    </Text>
                ) : (
                    <Button
                        bg={'primary.600'}
                        h="45px"
                        w={'120px'}
                        mx="auto"
                        p={0}
                        borderRadius={30}
                        onPress={onSubmitRating}
                        isLoading={loading}
                        isDisabled={
                            loading || !ratingState[ratingListUser[index]?.user?._id]?.tmpStar
                        }
                    >
                        {t('contract.rateNow')}
                    </Button>
                )}
                {ratingListUser?.length > 1 && (
                    <Button
                        bg={'black'}
                        borderRadius={'full'}
                        w={'50px'}
                        isDisabled={index === ratingListUser.length - 1}
                        onPress={nextPress}
                        _pressed={{ bg: 'gray.500' }}
                    >
                        <ArrowForwardIcon color={'white'} size={5} />
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default SliderRating;
