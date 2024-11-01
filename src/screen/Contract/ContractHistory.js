import moment from 'moment';
import { Box, HStack, ScrollView, Spinner, Text } from 'native-base';
import React from 'react';
import AvatarWithBadge from '../../components/Avatar/AvatarWithBadge';
import HeaderPage from '../../components/HeaderPage';
import ActiveContract from '../../components/Icons/ContractHistory/ActiveContract';
import BorrowerJoinContract from '../../components/Icons/ContractHistory/BorrowerJoinContract';
import BorrowerRequestUnlock from '../../components/Icons/ContractHistory/BorrowerRequestUnlock';
import CosignerAttachCert from '../../components/Icons/ContractHistory/CosignerAttachCert';
import CreateContract from '../../components/Icons/ContractHistory/CreateContract';
import DefaultContract from '../../components/Icons/ContractHistory/DefaultContract';
import UnlockContract from '../../components/Icons/ContractHistory/UnlockContract';
import useContractSigner from '../../hooks/Contract/useContractSigner';
import useMarkHistory from '../../hooks/Contract/useMarkHistory';
import useTranslate from '../../i18n/useTranslate';
import useTransferReq from '../../hooks/Contract/useTransferReq';
import NewCreatorContract from '../../components/Icons/ContractHistory/NewCreatorContract';
import DownloadContractCertBtn from '../../components/Button/DownloadContractCertBtn';
import useGetContractPdf from '../../hooks/Contract/useGetContractPdf';
import DownloadingModal from '../MyCert/DownloadingModal';
import useUserInfo from '../../hooks/useUserInfo';
import { useModalDownloadSignerCert } from '../../components/Modal/ModalDownloadSignerCert';
import useGetAllContractPdf from '../../hooks/Contract/useGetAllContractPdf';

// const RenderName = ({ name, check = false }) => {
//     const theme = useTheme();
//     return (
//         <HStack mt="10px" alignItems={'center'} space={2}>
//             <Text fontSize={'12px'} fontWeight={700} color="black">
//                 {name}
//             </Text>
//             {check && <CheckCircleIcon color={theme.colors.primary['600']} />}
//         </HStack>
//     );
// };

const ContractHistory = ({ navigation, route }) => {
    const t = useTranslate();
    const { contract } = route.params;
    const transferHook = useTransferReq(contract);
    const signerHook = useContractSigner({ contract });
    const pdfHistoryHook = useGetContractPdf(contract);
    const allPdfHook = useGetAllContractPdf(contract);
    const isAutoUnlock = contract?.requestToUnlock?.history[0]?.autoUnlock;
    const reqUnlockList = contract?.requestToUnlock?.history?.reverse();
    const modalDownloadSignerCertHook = useModalDownloadSignerCert();
    const markHistoryHook = useMarkHistory(contract?._id);
    const user = useUserInfo();
    const isOwner = contract?.creator?.user?._id === user?._id;
    const renderDate = (str) => {
        return (
            <Text minW="70px" fontSize={'11px'} fontWeight={400} color="gray.700">
                {str}
            </Text>
        );
    };
    const renderTitle = (str) => {
        return (
            <Text mb="5px" fontSize={'12px'} fontWeight={500} color="black">
                {str}
            </Text>
        );
    };

    const getSignerById = (id) => {
        let res = contract?.signers?.find((item) => item?.user?._id === id);
        if (!res) {
            res = contract?.prevCreators?.find((item) => item?.user?._id === id);
        }
        if (!res) {
            res = contract?.creator;
        }
        return res;
    };

    const get6Each = (arr) => {
        let sixSegments = [];
        let temp = [];
        arr?.forEach((item, index) => {
            if (index % 6 === 0 && index !== 0) {
                sixSegments.push(temp);
                temp = [];
            }
            temp.push(item);
        });
        sixSegments.push(temp);
        return sixSegments;
    };

    const getCreatorById = (id) => {
        let res = contract?.prevCreators.find((item) => item?.user?._id === id);
        if (!res) {
            if (contract?.creator?.user?._id === id) {
                return contract?.creator;
            }
        }
        return res;
    };

    const getCreator = () => {
        return contract?.prevCreators?.[0]?.user;
    };

    const getMillisecondsOfItem = (item) => {
        switch (item?.type) {
            case 'active':
                return new Date(item?.signedAt).getTime();
            case 'invite':
                return new Date(item?.date).getTime();
            case 'signed':
                return new Date(item?.date).getTime();
            case 'requestUnlock':
                return new Date(item?.createdAt).getTime();
            case 'markHistory':
                return new Date(item?.markedAt).getTime();
            case 'transfer':
                return new Date(item?.date).getTime();
            case 'newOwner':
                return new Date(item?.date).getTime();
            default:
                return 0;
        }
    };

    const getActiveUser = () => {
        let res = null;
        contract?.prevCreators?.forEach((item) => {
            if (res) {
                return;
            }
            if (item?.signedAt) {
                res = item;
            }
        });
        if (!res) {
            res = contract?.creator;
        }
        return res;
    };

    const getAllTypeItem = () => {
        let res = [];
        // active
        if (contract?.creator?.signedAt) {
            res.push({
                type: 'active',
                ...getActiveUser(),
            });
        }
        // transfer & newOwner
        transferHook.transferReqs.forEach((item) => {
            if (item?.status !== 'accepted') {
                return;
            }
            res.push({
                type: 'transfer',
                date: item?.createdAt,
                user: getCreatorById(item?.currentCreator)?.user,
            });
            res.push({
                type: 'newOwner',
                date: item?.updatedAt,
                user: getCreatorById(item?.newCreator)?.user,
            });
        });

        // invite
        signerHook.invitesGroupByDate().forEach((item) => {
            res.push({
                ...item,
                type: 'invite',
            });
        });
        // signed
        signerHook.groupBySignedAt().forEach((item) => {
            res.push({
                ...item,
                type: 'signed',
            });
        });
        // request unlock
        reqUnlockList.forEach((item) => {
            res.push({
                ...item,
                type: 'requestUnlock',
            });
        });
        // mark history
        markHistoryHook.markHistory.forEach((item) => {
            res.push({
                ...item,
                type: 'markHistory',
            });
        });
        res.sort((a, b) => getMillisecondsOfItem(a) - getMillisecondsOfItem(b));
        return res;
    };

    const getLastestOwnerBeforeTime = (time) => {
        let res = null;
        contract?.prevCreators.forEach((item) => {
            if (new Date(item.signedAt).getTime() <= new Date(time).getTime()) {
                res = item;
            }
        });
        if (contract?.creator?.signedAt <= time) {
            res = contract?.creator;
        }
        return res;
    };

    const mapTypeToIcon = (type) => {
        switch (type) {
            case 'invite':
                return <BorrowerJoinContract />;
            case 'signed':
                return <CosignerAttachCert />;
            case 'requestUnlock':
                return <BorrowerRequestUnlock />;
            case 'markHistory':
                return <DefaultContract />;
            case 'active':
                return <ActiveContract />;
            case 'transfer':
                return <ActiveContract />;
            case 'newOwner':
                return <NewCreatorContract />;
            default:
                return <DefaultContract />;
        }
    };

    const mapTypeToTitle = (item, type) => {
        switch (type) {
            case 'invite':
                return t('contract.inviteCosigner');
            case 'active':
                return t('contract.activeContract');
            case 'signed':
                return t('contract.cosignerAttachCert');
            case 'requestUnlock':
                return t('contract.borrowerRequestUnlock');
            case 'markHistory':
                if (item?.status === 'defaulted') {
                    return t('contract.contractDefault');
                }
                if (item?.status === 'active') {
                    return t('contract.activeContract');
                }
                return t('contract.markHistory');
            case 'transfer':
                return t('contract.transferRights');
            case 'newOwner':
                return t('contract.newContractCreator');
            default:
                return t('contract.contractDefault');
        }
    };

    const mapTypeToAvatar = (type, item) => {
        switch (type) {
            case 'invite':
                return <AvatarWithBadge uri={item?.receiver?.avatar} />;
            case 'signed':
                return <AvatarWithBadge uri={item?.receiver?.avatar} />;
            case 'requestUnlock':
                return <AvatarWithBadge uri={getSignerById(item?.signerId)?.user?.avatar} />;
            case 'markHistory':
                return (
                    <AvatarWithBadge
                        uri={getLastestOwnerBeforeTime(item?.markedAt)?.user?.avatar}
                    />
                );
            case 'active':
                return <AvatarWithBadge uri={item?.user?.avatar} />;
            case 'transfer':
                return <AvatarWithBadge uri={item?.user?.avatar} />;
            case 'newOwner':
                return <AvatarWithBadge uri={item?.user?.avatar} />;
            default:
                return <AvatarWithBadge uri={contract?.creator?.user?.avatar} />;
        }
    };

    const getAvatarSection = (item) => {
        switch (item?.type) {
            case 'invite':
                return (
                    <HStack w="full">
                        {get6Each(item?.data).map((segment, index) => {
                            return (
                                <HStack w="full" key={index}>
                                    {segment.map((i, index) => {
                                        return (
                                            <AvatarWithBadge
                                                key={index}
                                                uri={i?.receiver?.avatar}
                                                _container={{
                                                    position: 'relative',
                                                    left: `${index * -10}px`,
                                                }}
                                            />
                                        );
                                    })}
                                </HStack>
                            );
                        })}
                    </HStack>
                );
            case 'signed':
                return (
                    <HStack w="full">
                        {get6Each(item?.data).map((segment, index) => {
                            return (
                                <HStack w="full" key={index}>
                                    {segment.map((i, index) => {
                                        return (
                                            <AvatarWithBadge
                                                key={index}
                                                uri={i?.receiver?.avatar}
                                                _container={{
                                                    position: 'relative',
                                                    left: `${index * -10}px`,
                                                }}
                                            />
                                        );
                                    })}
                                </HStack>
                            );
                        })}
                    </HStack>
                );
            default:
                return mapTypeToAvatar(item?.type, item);
        }
    };

    return (
        <Box flex={1}>
            <HeaderPage
                isRight={true}
                onPress={() => {
                    navigation.goBack();
                }}
                title={`${t('components.contract')} ${contract?.name}`}
            >
                {pdfHistoryHook.canDownload && (
                    <DownloadContractCertBtn
                        onPress={() => {
                            if (isOwner) {
                                modalDownloadSignerCertHook.open();
                            } else {
                                pdfHistoryHook.downloadPdf();
                            }
                        }}
                    />
                )}
                {!pdfHistoryHook.canDownload && contract?.status === 'completed' && <Spinner />}
            </HeaderPage>
            <DownloadingModal isOpen={pdfHistoryHook.downloading || allPdfHook.downloading} />
            <ScrollView bg="white" flex={1} mt="5px" p="25px 20px">
                <Text color="black" mb="28px" fontSize={'14px'} fontWeight={500}>
                    {t('contract.contractHistory')}
                </Text>
                <HStack space={4}>
                    {renderDate(moment(contract?.createdAt).format('MMM DD, YYYY') || 'N/A')}
                    <Box alignItems={'center'}>
                        <CreateContract />
                        <Box my="5px" flex={1} w="1px" bg="gray.400"></Box>
                    </Box>
                    <Box mb="14px">
                        {renderTitle(t('contract.createContract'))}
                        {/* {renderName(contract?.underwriter?.user?.fullName)} */}
                        <AvatarWithBadge
                            uri={getCreator()?.avatar || contract?.creator?.user?.avatar}
                        />
                    </Box>
                </HStack>
                {/* <DefaultContract /> */}
                {getAllTypeItem().map((item, index) => {
                    return (
                        <HStack key={index} space={4}>
                            {renderDate(moment(getMillisecondsOfItem(item)).format('MMM DD, YYYY'))}
                            <Box alignItems={'center'}>
                                {mapTypeToIcon(item?.type)}
                                <Box my="5px" flex={1} w="1px" bg="gray.400" pb="30px"></Box>
                            </Box>
                            <Box mb="14px">
                                {renderTitle(mapTypeToTitle(item, item?.type))}
                                {getAvatarSection(item)}
                            </Box>
                        </HStack>
                    );
                })}

                {contract?.completedAt && (
                    <HStack mt="7px" space={4}>
                        {renderDate(moment(contract?.completedAt).format('MMM DD, YYYY'))}
                        <Box alignItems={'center'}>
                            <UnlockContract />
                            <Box mt="5px" flex={1} w="1px" bg="gray.400" pb="30px"></Box>
                        </Box>
                        <Box mb="14px">
                            {renderTitle(
                                isAutoUnlock
                                    ? t('contract.autoUnlock')
                                    : t('contract.unlockContract'),
                            )}
                            {!isAutoUnlock && (
                                <AvatarWithBadge uri={contract?.creator?.user?.avatar} />
                            )}
                        </Box>
                    </HStack>
                )}
                <Box color="white" h="40px"></Box>
            </ScrollView>
            {modalDownloadSignerCertHook.Component({
                contract,
                downloadPdf: allPdfHook.downloadPdf,
                downloadAll: allPdfHook.downloadAll,
                canDownloadAll: allPdfHook.canDownloadAll(),
                canDownload: allPdfHook.canDownload,
            })}
        </Box>
    );
};

export default ContractHistory;
