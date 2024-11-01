import { createSlice } from '@reduxjs/toolkit';
import useShallowEqualSelector from '../../customHook/useShallowEqualSelector';
import store from '../../store';

const initialState = {
    plotData: {},
};

const plotDetailPageSlice = createSlice({
    name: 'plotDetailPage',
    initialState,
    reducers: {
        updatePlotData: (state, action) => {
            state.plotData = action.payload;
        },
    },
});

export const usePlotDetailPage = () => {
    return useShallowEqualSelector((state) => state.plotDetailPage);
};

export const plotDetailPageFunction = {
    updatePlotData: (payload) => {
        store.dispatch(plotDetailPageSlice.actions.updatePlotData(payload));
    },
};

export default plotDetailPageSlice.reducer;
