import { createSlice } from '@reduxjs/toolkit';
const initialModel = {
    document: [],
    secretQuestion: [],
};

export const Slice = createSlice({
    name: 'settings',
    initialState: initialModel,
    reducers: {
        reset(state) {
            return { ...initialModel, secretQuestion: state.secretQuestion };
        },
        receiveQuestion(state, action) {
            state.secretQuestion = action.payload;
            return state;
        },
    },
});

export const settingsSliceActions = Slice.actions;
export default Slice.reducer;
