import React from 'react';
import ActiveTag from '../../components/Tag/ActiveTag';
import DefaultTag from '../../components/Tag/DefaultTag';
import PendingTag from '../../components/Tag/PendingTag';
import UnlockedTag from '../../components/Tag/UnlockedTag';

export const extractContractStatus = (contract) => {
    if (contract?.status === 'created') {
        return 'created';
    }
    if (contract?.status === 'completed') {
        return 'completed';
    }
    if (contract?.markedStatus === 'defaulted') {
        if (contract?.status === 'defaulted') {
            return 'defaulted';
        }
        return 'markedDefaulted';
    }
    return contract?.status;
};

export const showStatusTag = (status) => {
    switch (status) {
        case 'markedDefaulted':
            return <DefaultTag marked={true} />;
        case 'defaulted':
            return <DefaultTag />;
        case 'created':
            return <PendingTag />;
        case 'active':
            return <ActiveTag />;
        case 'completed':
            return <UnlockedTag />;
        default:
            return <PendingTag />;
    }
};
