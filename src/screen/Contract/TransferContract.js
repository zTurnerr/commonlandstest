import React, { useState } from 'react';
import { Box, Text, HStack, ScrollView, CloseIcon, Center, Button } from 'native-base';
import HeaderPage from '../../components/HeaderPage';
import useTranslate from '../../i18n/useTranslate';
import SearchPeople from '../../components/SearchPeople/SearchPeople';
import { showStatusTag } from '../../util/contract/showContractStatusTag';
import UserItem1 from '../../components/UserItem/UserItem1';
import { TouchableOpacity } from 'react-native';
import { useModalTransferContract } from '../../components/Contract/ModalTransferContract';
import useContractSigner from '../../hooks/Contract/useContractSigner';

const TransferContract = ({ navigation, route }) => {
    const { contract } = route.params;
    const [err, setErr] = useState('');

    const t = useTranslate();
    const [selectedPerson, setSelectedPerson] = useState(null);
    const modalTransferHook = useModalTransferContract();
    const signerHook = useContractSigner({ contract });

    const isPendingSigner = (phone) => {
        let res = false;
        signerHook.invites.forEach((item) => {
            if (item?.status !== 'pending') {
                return;
            }
            if (item?.isExpired) {
                return;
            }
            if (item?.receiver?.phoneNumber === phone) {
                res = true;
            }
        });
        return res;
    };

    const isAcceptedSigner = (phone) => {
        let res = false;
        signerHook.invites.forEach((item) => {
            if (item?.status !== 'accepted') {
                return;
            }
            if (item?.receiver?.phoneNumber === phone) {
                res = true;
            }
        });
        return res;
    };

    const onSelectedPerson = (person) => {
        if (contract?.creator?.user?.phoneNumber === person?.phoneNumber) {
            setErr(t('contract.cannotTransferToYourself'));
            return;
        }
        if (isPendingSigner(person?.phoneNumber)) {
            setErr(t('contract.cannotTransferToInvited'));
            return;
        }
        if (isAcceptedSigner(person?.phoneNumber) && contract?.status === 'created') {
            setErr(t('contract.cannotTransferToSigned'));
            return;
        }
        setSelectedPerson(person);
    };

    return (
        <Box h="full">
            <HeaderPage title={t('contract.transferRights')} isRight>
                {showStatusTag(contract?.status)}
            </HeaderPage>
            <Box mt="2px" bg="white" px="15px" pt="25px" flex={1}>
                <Text fontSize={'14px'} fontWeight={600}>
                    {t('contract.selectPersonTransfer')}
                </Text>
                <Text color="gray.700">{t('contract.choosePersonUnlock')}</Text>
                <SearchPeople err={err} setErr={setErr} onSelectUser={onSelectedPerson} />
                {selectedPerson && (
                    <Box mt="15px">
                        <Text mb="15px" fontWeight={600}>
                            {t('others.selectedPerson')}:
                        </Text>
                        <HStack
                            bg="gray.1500"
                            p="5px"
                            borderRadius={'50px'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                        >
                            <UserItem1 user={{ user: selectedPerson }} />
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedPerson(null);
                                }}
                            >
                                <Center
                                    mr="5px"
                                    w="30px"
                                    h="30px"
                                    borderRadius={'full'}
                                    bg="gray.1400"
                                >
                                    <CloseIcon />
                                </Center>
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                )}
                <HStack flex={1} alignItems="flex-end" pb="20px">
                    <Button
                        onPress={() => {
                            navigation.goBack();
                        }}
                        flex={1}
                        variant={'outline'}
                    >
                        {t('button.cancel')}
                    </Button>
                    <Button
                        onPress={() => {
                            modalTransferHook.open();
                        }}
                        disabled={!selectedPerson}
                        opacity={selectedPerson ? 1 : 0.5}
                        flex={1}
                        ml="20px"
                    >
                        {t('transferOwnership.transfer')}
                    </Button>
                </HStack>
            </Box>
            {modalTransferHook.Component({
                user: selectedPerson,
                contract: contract,
            })}
        </Box>
    );
};

export default TransferContract;
