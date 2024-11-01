import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Center, Flex, HStack, SectionList, Text } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import WarningBottomAlert from '../../components/Alert/WarningBottomAlert';
import Button from '../../components/Button';
import ContractActiveBtn from '../../components/Contract/ContractActiveBtn';
import DefaultPendingTag from '../../components/Contract/DefaultPendingTag';
import { useModalAcceptInvite } from '../../components/Contract/ModalAcceptInvite';
import { useModalActiveContract } from '../../components/Contract/ModalActiveContract';
import { useModalActiveContractSuccess } from '../../components/Contract/ModalActiveContractSuccess';
import { useModalActiveTransfer } from '../../components/Contract/ModalActiveTransfer';
import { useModalApproveTransferSuccess } from '../../components/Contract/ModalApproveTransferSuccess';
import { useModalBeingActivate } from '../../components/Contract/ModalBeingActivate';
import { useModalContractSigner } from '../../components/Contract/ModalContractSigner';
import { useModalDeclineInvite } from '../../components/Contract/ModalDeclineInvite';
import { useModalDeclineTransfer } from '../../components/Contract/ModalDeclineTransfer';
import { useModalRemoveSigner } from '../../components/Contract/ModalRemoveSigner';
import { useModalReplyReqUnlock } from '../../components/Contract/ModalReplyReqUnlock';
import { useModalReplyTransfer } from '../../components/Contract/ModalReplyTransfer';
import { useModalSentInviteSigner } from '../../components/Contract/ModalSentInviteSigner';
import { useModalSignContractByPass } from '../../components/Contract/ModalSignContractByPass';
import { useModalSignNoPass } from '../../components/Contract/ModalSignNoPass';
import PendingTransferAlert from '../../components/Contract/PendingTransferAlert';
import PendingTransferTag from '../../components/Contract/PendingTransferTag';
import ReqUnlockPendingTag from '../../components/Contract/ReqUnlockPendingTag';
import HeaderPage from '../../components/HeaderPage';
import Setting from '../../components/Icons/Setting';
import LoadingPage from '../../components/LoadingPage';
import { useNotification2 } from '../../components/Notification/NotificationComponent';
import { EVENT_NAME } from '../../constants/eventName';
import useContractSigner from '../../hooks/Contract/useContractSigner';
import useTransferReq from '../../hooks/Contract/useTransferReq';
import useUserInfo from '../../hooks/useUserInfo';
import useTranslate from '../../i18n/useTranslate';
import { getContractByDID } from '../../rest_client/apiClient';
import { contractIsDefaulted } from '../../util/contract/isDefaulted';
import { extractContractStatus } from '../../util/contract/showContractStatusTag';
import { showErr } from '../../util/showErr';
import { useContractSettingSheet } from './components/ContractSettingActionSheet';
import ContractSignerSection from './components/ContractSignerSection';
import { useModalActiveFail } from './components/ModalActiveFail';
import { useModalChangeToDefault } from './components/ModalChangeToDefault';
import { useModalCreatorUnlock } from './components/ModalCreatorUnlock';
import { useModalCreatorUploadProof } from './components/ModalCreatorUploadProof';
import { useModalDefaultToActive } from './components/ModalDefaultToActive';
import { useModalDeleteContract } from './components/ModalDeleteContract';
import { useModalRequestUnlock } from './components/ModalRequestUnlock';
import ProofOfPayment1 from './components/ProofOfPayment1';
import RenderContractInfo from './components/RenderContractInfo';
import SliderRating from './components/SliderRating';
import WaitingActiveTag from '../../components/Contract/WaitingActiveTag';
import { getContractSignerIds } from '../../util/contractObject';

let timer = null;
let listener;
let paymentTimer = null;

const CreatorContractDetail = ({ route, navigation }) => {
    const t = useTranslate();
    const { contract, reload = true } = route?.params || {};
    const user = useUserInfo();
    const navigate = useNavigation();
    const [signing, setSigning] = useState(false);
    const [firstLoading, setFirstLoading] = useState(true);
    const settingSheetHook = useContractSettingSheet();
    const modalDeleteContractHook = useModalDeleteContract();
    const modalCreatorUnlock = useModalCreatorUnlock();
    const modalActiveFail = useModalActiveFail();
    const modalChangeToDefault = useModalChangeToDefault();
    const modalCreatorUploadProof = useModalCreatorUploadProof();
    const modalSignNoPass = useModalSignNoPass();
    const modalSignContractByPass = useModalSignContractByPass();
    const modalDeclineInviteHook = useModalDeclineInvite();
    const modalAcceptInviteHook = useModalAcceptInvite();
    const modalDeclineTransferHook = useModalDeclineTransfer(contract);
    const modalRequestUnlockHook = useModalRequestUnlock();
    const modalActiveContractHook = useModalActiveContract();
    const modalDefaultToActiveHook = useModalDefaultToActive();
    const transferReqHook = useTransferReq(contract);
    const modalReplyTransferHook = useModalReplyTransfer({
        transferReqHook,
    });
    const modalActiveTransferHook = useModalActiveTransfer();
    const modalApproveTransferSuccessHook = useModalApproveTransferSuccess();
    const modalContractSigner = useModalContractSigner();
    const notificationHook = useNotification2();
    const [firstShowUploadProof, setFirstShowUploadProof] = useState(false);
    const modalRemoveSignerHook = useModalRemoveSigner({ contract });
    const modalSendInviteSignerHook = useModalSentInviteSigner();
    const modalReplyReqUnlockHook = useModalReplyReqUnlock();
    const modalBeingActivateHook = useModalBeingActivate();
    const modalActiveContractSuccess = useModalActiveContractSuccess();
    const signerHook = useContractSigner({ contract });
    getContractSignerIds(contract);
    const showUploadProof = (contract) => {
        let unlockStatusObj = contract?.requestToUnlock;
        if (
            unlockStatusObj?.isPending &&
            unlockStatusObj?.history?.[0]?.requestType == 'CML' &&
            !unlockStatusObj?.history?.[0]?.proofByUnderwriter?.length
        ) {
            return true;
        }
        return false;
    };

    const isPendingUnlock = () => {
        return contract?.requestToUnlock?.isPending;
    };

    const refetchContract = async (param = { reload: true, afterReload: () => {} }) => {
        clearTimeout(timer);
        try {
            let { data } = await getContractByDID(contract.did);
            signerHook.fetchInvite();
            navigation.setParams({
                contract: data?.contract,
            });
            if (showUploadProof(data?.contract) && !firstShowUploadProof) {
                modalCreatorUploadProof.open();
                setFirstShowUploadProof(true);
            }
            if (param?.reload) {
                setSigning(false);
            }
            param?.afterReload?.();
        } catch (error) {
            console.log('error', error);
            if (JSON.stringify(error).includes('authorization')) {
                showErr(error);
                navigate.goBack();
            }
        }
        setFirstLoading(false);
    };

    const onViewCert = (item) => {
        if (item?.signedAt) {
            navigate.navigate('ViewCertificate', { item, contract });
        }
    };

    const sectionData = [
        {
            data: [
                {
                    component: () =>
                        isPendingUnlock() && !contractIsDefaulted(contract) ? (
                            <ReqUnlockPendingTag
                                _container={{
                                    w: '100%',
                                    py: '10px',
                                    mt: '0px',
                                    px: '15px',
                                }}
                            />
                        ) : null,
                },
            ],
        },
        {
            data: [
                {
                    component: () =>
                        extractContractStatus(contract) === 'markedDefaulted' ? (
                            <DefaultPendingTag
                                _container={{
                                    w: '100%',
                                    py: '10px',
                                    mt: '0px',
                                    px: '15px',
                                    space: 2,
                                }}
                                text={t('contract.markedContractDefault')}
                            />
                        ) : null,
                },
            ],
        },
        {
            data: transferReqHook.isExistPending()
                ? [
                      {
                          component: () => (
                              <PendingTransferTag
                                  contract={contract}
                                  _container={{
                                      p: '15px',
                                      mt: '2px',
                                  }}
                              />
                          ),
                      },
                  ]
                : [],
        },
        {
            data: [
                {
                    component: () => <RenderContractInfo item={contract} />,
                },
            ],
        },
        {
            data: [
                {
                    component: () => (
                        <ContractSignerSection
                            onSign={modalSignContractByPass.open}
                            onRemove={modalRemoveSignerHook.onRemoveSigner}
                            onSentInvite={modalSendInviteSignerHook.open}
                            onOpenModalSigner={modalContractSigner.open}
                            title={t('contract.borrower')}
                            contract={contract}
                            onPress={onViewCert}
                            type="borrower"
                            invites={signerHook.invites}
                            onInviteCosigner={() => {
                                navigate.navigate('InviteCosigner', {
                                    contract,
                                    invites: signerHook.invites,
                                });
                            }}
                        />
                    ),
                },
            ],
        },
        {
            data: [
                {
                    component: () => (
                        <ProofOfPayment1
                            type="creator"
                            contract={contract}
                            navigation={navigation}
                            hideEditBtn={showUploadProof(contract)}
                        />
                    ),
                },
            ],
        },
        {
            data: [
                {
                    component: () => <SliderRating contract={contract} />,
                },
            ],
        },
    ];

    useFocusEffect(
        useCallback(() => {
            refetchContract({ reload: false });

            return () => {
                clearTimeout(timer);
                clearTimeout(paymentTimer);
            };
        }, []),
    );

    useEffect(() => {
        EventRegister.removeEventListener(listener);
        listener = EventRegister.addEventListener(EVENT_NAME.refreshContract, (callData) => {
            refetchContract({ afterReload: callData?.afterRefresh });
        });
        if (!reload) {
            setFirstLoading(false);
            return;
        }
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);

    const SignerGroupBtn = (
        <HStack bg="white" w="full" space={4} px="18px" shadow={9} py="12px">
            <Button
                _container={{
                    flex: 1,
                }}
                variant="outline"
                onPress={() => {
                    modalDeclineInviteHook.open();
                }}
            >
                {t('button.reject')}
            </Button>
            <Button
                _container={{
                    flex: 1,
                    bg: 'primary.600',
                }}
                color="custom"
                textColor="white"
                onPress={() => {
                    modalSignContractByPass.open();
                }}
            >
                {t('button.accept')}
            </Button>
        </HStack>
    );

    return (
        <Flex backgroundColor={'appColors.seconDaryGray'} flex={1}>
            {notificationHook.Component()}
            {modalCreatorUploadProof.Component({})}
            {firstLoading && <LoadingPage />}
            <WarningBottomAlert contract={contract} />
            <HeaderPage
                isRight
                onPress={() => {
                    navigate.goBack();
                }}
                title={`${t('components.contract')} ${contract?.name}`}
            >
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => {
                        settingSheetHook.open();
                    }}
                >
                    <Setting />
                    <Text ml="5px" color="primary.600" fontSize={'12px'} fontWeight={600}>
                        {t('contract.settings')}
                    </Text>
                </TouchableOpacity>
            </HeaderPage>
            <Flex flex={1}>
                {contract?.isActivating && (
                    <WaitingActiveTag
                        _container={{
                            p: '15px',
                            mt: '2px',
                        }}
                    />
                )}
                <SectionList
                    flex={1}
                    sections={sectionData}
                    renderItem={({ item }) => item?.component()}
                    stickySectionHeadersEnabled={false}
                />

                <ContractActiveBtn
                    contract={contract}
                    loading={false}
                    invites={signerHook.invites}
                    onPress={() => modalActiveContractHook.open()}
                />
                <PendingTransferAlert
                    onSeeMore={() => {
                        modalReplyTransferHook.open();
                    }}
                    contract={contract}
                    show={
                        transferReqHook.isExistPending() &&
                        transferReqHook.transferReqs[0]?.newCreator === user?._id &&
                        contract?.status !== 'completed'
                    }
                />
                {signerHook.showActionBtn() && SignerGroupBtn}
                {showUploadProof(contract) && (
                    <Center w="100%" mb={'24px'} mt={'auto'} px="10px">
                        <Button
                            w="100%"
                            isLoading={signing}
                            onPress={() => {
                                navigate.navigate('RequestUnlock', { contract, type: 'creator' });
                            }}
                        >
                            {t('button.uploadYourProof')}
                        </Button>
                    </Center>
                )}
            </Flex>
            {settingSheetHook.Component({
                contract: contract,
                onDelete: () => {
                    settingSheetHook.close();
                    modalDeleteContractHook.open();
                },
                onUnlock: () => {
                    settingSheetHook.close();
                    modalCreatorUnlock.open();
                },
                onChangeToDefault: () => {
                    if (contractIsDefaulted(contract)) {
                        modalDefaultToActiveHook.open();
                    } else {
                        modalChangeToDefault.open();
                    }
                },
                onRequestUnlock: () => {
                    settingSheetHook.close();
                    modalRequestUnlockHook.open();
                },
                isPendingTransfer: transferReqHook.isExistPending(),
            })}
            {modalActiveContractHook.Component({
                contractId: contract?._id,
                contractDid: contract?.did,
            })}
            {modalRequestUnlockHook.Component({
                contract: contract,
            })}
            {modalDeleteContractHook.Component()}
            {modalSignContractByPass.Component({
                contractId: contract?._id,
                contract: contract,
            })}
            {modalSendInviteSignerHook.Component({
                contract: contract,
            })}
            {modalDeclineTransferHook.Component({})}
            {modalActiveTransferHook.Component({
                contractId: contract?._id,
                onApproveSuccess: () => {
                    modalReplyTransferHook.close();
                    modalApproveTransferSuccessHook.open();
                },
            })}
            {modalAcceptInviteHook.Component({})}
            {modalCreatorUnlock.Component({
                contract: contract,
                onPress: async () => {
                    await refetchContract({ reload: false });
                },
            })}
            {modalSignNoPass.Component({
                contractId: contract?._id,
            })}
            {modalDeclineInviteHook.Component({
                contract: contract,
            })}
            {modalApproveTransferSuccessHook.Component({
                contract: contract,
            })}
            {modalActiveContractSuccess.Component({})}
            {modalRemoveSignerHook.Component({})}
            {modalChangeToDefault.Component({
                contract: contract,
            })}
            {modalActiveFail.Component({})}
            {modalContractSigner.Component({
                contract: contract,
            })}
            {modalReplyReqUnlockHook.Component({
                contract: contract,
            })}
            {modalBeingActivateHook.Component({})}
            {modalReplyTransferHook.Component({
                onApprove: () => {
                    modalActiveTransferHook.open();
                },
                onDecline: () => {
                    modalDeclineTransferHook.open();
                },
                contract: contract,
                expiresTime: transferReqHook.transferReqs[0]?.expiresAt,
            })}
            {modalDefaultToActiveHook.Component({
                contract: contract,
            })}
        </Flex>
    );
};

export default CreatorContractDetail;

const styles = StyleSheet.create({
    settingsButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
});
