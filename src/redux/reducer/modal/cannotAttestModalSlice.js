import { createSlice } from '@reduxjs/toolkit';
import store from '../../store';
import useShallowEqualSelector from '../../customHook/useShallowEqualSelector';

const initialState = {
    isOpen: false,
    plotData: {},
};

const cannotAttestModalSlice = createSlice({
    name: 'cannotAttestModal',
    initialState,
    reducers: {
        open(state, action) {
            state.isOpen = true;
            state.plotData = action.payload.plotData;
        },
        close(state) {
            state.isOpen = false;
        },
    },
});

export default cannotAttestModalSlice.reducer;

export const openCannotAttestModal = (plotData) => {
    store.dispatch(cannotAttestModalSlice.actions.open({ plotData }));
};

export const closeCannotAttestModal = () => {
    store.dispatch(cannotAttestModalSlice.actions.close());
};

export const useCannotAttestModal = () => {
    return useShallowEqualSelector((state) => state.cannotAttestModal);
};
