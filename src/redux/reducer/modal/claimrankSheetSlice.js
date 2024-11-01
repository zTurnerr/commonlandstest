import { createSlice } from '@reduxjs/toolkit';
import store from '../../store';
import useShallowEqualSelector from '../../customHook/useShallowEqualSelector';

const initialState = {
    isOpen: false,
    curKey: 'N/A',
    plotId: '',
};

const claimrankSheetReducer = createSlice({
    name: 'claimrankSheet',
    initialState,
    reducers: {
        open(state, action) {
            state.isOpen = true;
            state.plotId = action.payload.plotId;
            state.curKey = action.payload.curKey;
        },
        close(state) {
            state.isOpen = false;
        },
    },
});

export default claimrankSheetReducer.reducer;

export const openClaimrankSheet = (plotId, curKey) => {
    store.dispatch(claimrankSheetReducer.actions.open({ plotId, curKey }));
};

export const closeClaimrankSheet = () => {
    store.dispatch(claimrankSheetReducer.actions.close());
};

export const useGlobalClaimrankSheet = () => {
    return useShallowEqualSelector((state) => state.claimrankSheet);
};
