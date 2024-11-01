import axios from 'axios';
import i18next from 'i18next';

/**
 * Check if transferOwnershipRequest or withdrawalOwnershipRequest exist in the given data.
 *
 * @param {object} data - The input data containing transferOwnershipRequest and withdrawalOwnershipRequest
 * @return {boolean} true if either transferOwnershipRequest or withdrawalOwnershipRequest have a status, otherwise false
 */
export const checkExistTransferOrWithdraw = (data) => {
    const { transferOwnershipRequest, withdrawalOwnershipRequest } = data;
    if (transferOwnershipRequest?.status || withdrawalOwnershipRequest?.status) {
        return true;
    }
    return false;
};

export const canAllowTransferOrWithdraw = (plot) => {
    if (plot?.status === 'locked' || plot?.status === 'defaulted') {
        return false;
    }
    return true;
};

// hide phone number only show 3 first digit and 3 last digit
export const hidePhoneNumber = (phoneNumber) => {
    if (phoneNumber) {
        return `${phoneNumber.slice(0, 3)}****${phoneNumber.slice(-3)}`;
    }
    return phoneNumber;
};

export const token =
    'pk.eyJ1IjoiZGV2ZnVpeGxhYnMiLCJhIjoiY2xqemlhYWE0MGNpeDNycDI3b3pxa2FtcCJ9.TNRQyJHqYPhWaHAHFxIHVQ';
const cached = {};
export const getPlace = async ({ long, lat }) => {
    if (cached[`${long},${lat}`]) {
        return cached[`${long},${lat}`];
    }
    const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?limit=1&access_token=${token}`,
    );
    return (cached[`${long},${lat}`] = data);
};

export const getDestinationFromText = async (text) => {
    const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${token}`,
    );
    return data;
};

export const getRoleFromClaimants = (list) => {
    const TYPE = {
        owner: i18next.t('claimants.owner'),
        renter: i18next.t('claimants.renter'),
        rightOfUse: i18next.t('claimants.rightOfUse'),
        'co-owner': i18next.t('claimants.coOwner'),
        creator: i18next.t('components.creator'),
    };
    let numberOwner =
        list?.filter((item) => item.role === 'owner' || item.role === 'co-owner').length || 0;

    const getType = (newRole) => {
        if (numberOwner === 1 && newRole === 'owner') {
            return 'owner';
        }
        if (numberOwner > 1 && newRole === 'owner') {
            return 'co-owner';
        }
        return newRole;
    };

    return list?.map((item) => ({
        ...item,
        role: TYPE[getType(item.role)],
    }));
};

export const toFixedNoZero = (num, fixed) => {
    if (!num) {
        return 0;
    }
    return num.toFixed(fixed).replace(/\.?0+$/, '');
};
