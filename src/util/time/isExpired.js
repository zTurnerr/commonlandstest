import moment from 'moment';

export const isExpired = (time) => {
    return moment(time).isBefore(moment());
};
