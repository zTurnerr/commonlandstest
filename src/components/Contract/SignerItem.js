import useTranslate from '../../i18n/useTranslate';
import { Box, CheckCircleIcon, HStack, Image, Text, VStack } from 'native-base';
import React from 'react';
import Clock3 from '../Icons/Clock3';
import CertLockTag from './CertLockTag';
import Trash from '../Icons/Trash';
import { TouchableOpacity } from 'react-native';
import SignerAction from './SignerAction';
import InviteSentTag from './InviteSentTag';
import CertUnlockedTag from './CertUnlockedTag';
import RejectInvite from './RejectInvite';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import PendingApprovalTag from './PendingApprovalTag';
import CertDefaultTag from './CertDefaultTag';
import { useNavigation } from '@react-navigation/native';
import FiveStar from '../Star/FiveStar';
import { getUserRating } from '../../util/contract/rating';

const SignerItem = ({
    onRemove = () => {},
    onSign = () => {},
    onSentInvite = () => {},
    info = {},
    contract = {},
    onOpenModalSigner = null,
    _container = {},
}) => {
    const user = useShallowEqualSelector((state) => state.user.userInfo);
    const navigation = useNavigation();
    const isOwner = user?._id === contract?.creator?.user?._id;
    const signerIds = contract?.signers?.map((item) => item?.user?._id);
    const renderStatus = () => {
        if (info?.receiver?._id === contract?.creator?.user?._id) {
            return null;
        }
        if (!isOwner && info?.status === 'pending') {
            return <PendingApprovalTag />;
        }
        if (contract?.status === 'completed') {
            return <CertUnlockedTag />;
        }
        if (info?.status === 'accepted') {
            if (contract?.status === 'defaulted') {
                return <CertDefaultTag />;
            }
            return <CertLockTag />;
        }
        return null;
    };

    const renderBadge = () => {
        if (info?.status === 'pending') {
            return <Clock3 color="#EAA300" />;
        }
        if (info?.status === 'accepted') {
            return <CheckCircleIcon size="12px" color="#13A10E" />;
        }
    };

    const canInvite = () => {
        // if not response then can not invite
        if (info?.isExpired) {
            return true;
        }
        return !!info?.isResponded;
    };

    const getInfoWithPof = () => {
        let signer = contract?.signers?.find((item) => item?.user?._id === info?.receiver?._id);
        return { ...info, pof: signer?.pof };
    };

    const t = useTranslate();

    // case the signer sign contract but then not in the signers list
    if (info?.status === 'accepted' && !signerIds.includes(info?.receiver?._id)) {
        return null;
    }

    return (
        <TouchableOpacity
            disabled={
                !onOpenModalSigner ||
                info?.status === 'pending' ||
                info?.status === 'rejected' ||
                contract?.status === 'completed'
            }
            onPress={() => {
                // onOpenModalSigner(getInfoWithPof());
                navigation.navigate('ViewCertificate', {
                    item: getInfoWithPof(),
                });
            }}
        >
            <HStack mb="15px" space={4} p="15px" bg="white" w="full" {..._container}>
                <Box w="40px" h="40px" bg="gray.300" borderRadius={'100px'}>
                    <Image
                        source={{ uri: info?.receiver?.avatar }}
                        alt="image base"
                        w="full"
                        h="full"
                        resizeMode="cover"
                        borderRadius={'100px'}
                    />
                    <Box
                        bg="white"
                        borderRadius={'100px'}
                        position={'absolute'}
                        bottom={'-2px'}
                        right={'-2px'}
                        borderWidth={'2px'}
                        borderColor={'white'}
                    >
                        {renderBadge()}
                    </Box>
                </Box>
                <VStack flex={1}>
                    <HStack>
                        <Box mr="10px">
                            <Text fontSize={'14px'} fontWeight={600}>
                                {info?.receiver?.fullName}
                            </Text>
                            <Text mb="10px" color="gray.700">
                                {info?.receiver?.phoneNumber}
                            </Text>
                        </Box>
                        {!info.isResponded &&
                            contract?.status === 'created' &&
                            isOwner &&
                            !info?.isExpired && <InviteSentTag />}
                        {info?.status === 'rejected' && (
                            <RejectInvite text={t('invite.rejectInvite')} />
                        )}
                        {info?.isExpired && info?.status === 'pending' && (
                            <RejectInvite text={t('contract.expired')} />
                        )}
                    </HStack>
                    <HStack alignItems={'center'} space={2}>
                        {renderStatus()}
                        {getUserRating(contract, info?.receiver?._id) && (
                            <FiveStar
                                size={20}
                                disabled={true}
                                currentStar={getUserRating(contract, info?.receiver?._id)}
                            />
                        )}
                    </HStack>
                    {(info?.status === 'pending' || info?.status === 'rejected') && isOwner && (
                        <SignerAction
                            onSentInvite={canInvite() ? () => onSentInvite(info) : null}
                            onSign={
                                info?.status === 'rejected' || info?.isExpired
                                    ? null
                                    : () => {
                                          onSign(info);
                                      }
                            }
                        />
                    )}
                </VStack>
                {(info?.status === 'pending' || info?.status === 'rejected') && isOwner && (
                    <TouchableOpacity
                        onPress={() => {
                            onRemove(info);
                        }}
                    >
                        <Trash />
                    </TouchableOpacity>
                )}
            </HStack>
        </TouchableOpacity>
    );
};

export default SignerItem;
