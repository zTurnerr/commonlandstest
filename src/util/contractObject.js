import { getContractById } from '../rest_client/apiClient';

export const getContractSignerIds = (contract) => {
    let res = contract?.signers?.map((signer) => signer?.user?._id);
    return res;
};

export const checkSignerIsInContract = (contract, userId) => {
    let res = contract?.signers?.some((signer) => signer?.user?._id === userId);
    return res;
};

export const refetchContractToShowSigner = async (contractId, signerId, onSuccess) => {
    try {
        let { data } = await getContractById(contractId);
        let tmpContract = data?.contract;
        let signerIds = getContractSignerIds(tmpContract);
        if (signerIds.includes(signerId)) {
            onSuccess?.();
            return;
        }
        setTimeout(() => {
            refetchContractToShowSigner(contractId, signerId, onSuccess);
        }, 2000);
    } catch (error) {}
};
