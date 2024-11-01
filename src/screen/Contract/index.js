import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { Box, Spinner, VStack } from 'native-base';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useContractListTab } from '../../components/Tabs/ContractListTab';
import useSignatoryList from '../../hooks/Contract/useSignatoryList';
import useContractFilter from '../../hooks/useContractFilter';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { searchAndFilterContract } from '../../rest_client/apiClient';
import { showErr } from '../../util/showErr';
import { ModalContext } from '../Main';
import { ContractList } from './components/ContractList';
import HeaderContract from './components/HeaderContract';
import ModalStatusContract from './components/ModalStatusContract';

let lock = false;

export default function Index({ route }) {
    const { loadingNewContract } = route?.params || {};
    let { user, isLogged } = useShallowEqualSelector((state) => ({
        user: state.user.userInfo,
        isLogged: state.user.isLogged,
    }));
    const navigate = useNavigation();
    const modalContext = useContext(ModalContext);
    const [listContract, setListContract] = useState([]);
    const [visibleStatus, setVisibleStatus] = useState(false);
    const [statusSelected, setStatusSelected] = useState([]);
    const signatoryHook = useSignatoryList();
    const [loading, setLoading] = useState(true);
    const contractTabHook = useContractListTab();
    const contractFilterHook = useContractFilter();

    const filteredListContract = () => {
        return listContract;
    };

    const getPendingCount = () => {
        return signatoryHook.invites.filter((e) => {
            return e?.status === 'pending' && !e?.isExpired;
        }).length;
    };

    const addContract = useCallback(() => {
        navigate.navigate('CreateContract', { user });
    }, [navigate]);

    async function onFocusScreen() {
        setLoading(true);
        await getListContract();
        setLoading(false);
    }

    useFocusEffect(
        useCallback(() => {
            onFocusScreen();
        }, [contractFilterHook.filter, contractTabHook.index]),
    );

    useEffect(() => {
        setListContract([]);
    }, [contractFilterHook.filter, contractTabHook.index]);

    const getListContract = async () => {
        if (lock) {
            return;
        }
        lock = true;
        let timeout;
        try {
            signatoryHook.fetchInvite();
            let { data } = await searchAndFilterContract({
                filters: {
                    onlyCreator: contractTabHook.index === 0,
                    onlySigner: contractTabHook.index === 1,
                    ...contractFilterHook.filter,
                    startAmount: contractFilterHook.filter.startAmount + '',
                    endAmount: contractFilterHook.filter.endAmount + '',
                },
            });
            contractFilterHook.setMaxAmount(data?.maxAmount);
            navigate.setParams({ loadingNewContract: false });
            // filter signatory that not contain owner
            if (contractTabHook.index === 1) {
                data = {
                    ...data,
                    contracts: data?.contracts?.filter((e) => e?.creator?.user?._id !== user?._id),
                };
            }
            setListContract(data?.contracts || []);
            setLoading(false);
            if (data?.contracts?.[0]?.status === 'pending') {
                timeout = setTimeout(() => {
                    getListContract();
                }, 5000);
            }
        } catch (error) {
            console.log('error', error);
            showErr(error);
        }
        lock = false;
        return () => clearTimeout(timeout);
    };

    const openModalStatus = useCallback(() => {
        setVisibleStatus(true);
    }, []);

    const closeModalStatus = useCallback(() => {
        setVisibleStatus(false);
    }, []);

    const onClearSelection = useCallback(() => {
        setStatusSelected([]);
    }, []);

    const onSelectItem = useCallback(
        ({ item }) => {
            const finalStatusSelected = statusSelected?.includes(item?.label)
                ? statusSelected?.filter((e) => e !== item?.label)
                : [...statusSelected, item?.label];
            setStatusSelected(finalStatusSelected);
        },
        [statusSelected, setStatusSelected],
    );

    const pressAvatar = useCallback(() => {
        if (!isLogged) {
            return modalContext.onOpenModal();
        }
        navigate.navigate('Profile');
    }, [isLogged, modalContext, navigate]);

    const pendingArray = loadingNewContract ? [{ status: 'pending' }] : [];

    return (
        <>
            <HeaderContract
                addContract={addContract}
                user={user}
                onPressAvatar={pressAvatar}
                listContract={listContract}
                openModalStatus={openModalStatus}
                maxAmount={contractFilterHook.maxAmount}
            />
            {contractTabHook.Component({ pendingCount: getPendingCount() })}
            {loading && (
                <VStack position={'absolute'} bottom="5" zIndex={10} w="full" alignItems={'center'}>
                    <Box bg="white" shadow={9} borderRadius={'100px'} p="10px">
                        <Spinner size="sm" />
                    </Box>
                </VStack>
            )}
            <ContractList
                loading={loading}
                addContract={addContract}
                // listContract={[]}
                listContract={[...pendingArray, ...filteredListContract()]}
                getListContract={getListContract}
            />
            <ModalStatusContract
                isVisible={visibleStatus}
                onClose={closeModalStatus}
                onClear={onClearSelection}
                onSelectItem={onSelectItem}
                selectedItems={statusSelected}
            />
        </>
    );
}
