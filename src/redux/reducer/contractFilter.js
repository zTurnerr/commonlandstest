import { createSlice } from '@reduxjs/toolkit';

const contractFilterInitState = {
    status: '',
    search: '',
    startAmount: '',
    endAmount: '',
    startDate: '',
    endDate: '',
};

const contractFilter = createSlice({
    name: 'contractFilter',
    initialState: contractFilterInitState,
    reducers: {
        updateFilter(state, action) {
            let { payload } = action;
            state = {
                ...state,
                ...payload,
            };
            return state;
        },
        resetFilter(state) {
            state = {
                ...contractFilterInitState,
            };
            return state;
        },
    },
});

export const { updateFilter, resetFilter } = contractFilter.actions;
export default contractFilter.reducer;
