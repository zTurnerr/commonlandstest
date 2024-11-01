import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useShallowEqualSelector from '../redux/customHook/useShallowEqualSelector';
import { resetFilter, updateFilter } from '../redux/reducer/contractFilter';

const useContractFilter = () => {
    const dispatch = useDispatch();
    const [maxAmount, setMaxAmount] = useState(0);
    const filter = useShallowEqualSelector((state) => state.contractFilter);

    const updateFilterContract = (filter) => {
        dispatch(updateFilter(filter));
    };

    const resetFilterContract = () => {
        dispatch(resetFilter());
    };

    const isInitState = () => {
        return Object.keys(filter).every((key) => {
            return filter[key] === '';
        });
    };

    return {
        updateFilterContract,
        resetFilterContract,
        isInitState,
        filter,
        maxAmount,
        setMaxAmount,
    };
};

export default useContractFilter;
