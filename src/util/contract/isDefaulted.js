export const contractIsDefaulted = (contract) => {
    return contract.status === 'defaulted' || contract?.markedStatus === 'defaulted';
};
