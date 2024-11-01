/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author NNTruong / nhuttruong6496@gmail.com
 */
import { createSlice } from '@reduxjs/toolkit';
const initialModel = {
    data: [],
    page: 1,
    perPage: 10,
    totalUnReads: 0,
    total: 0,
};

export const Slice = createSlice({
    name: 'notifications',
    initialState: initialModel,

    reducers: {
        receiveNotification(state, action) {
            state.data = action.payload.data;
            state.page = action.payload.page;
            state.perPage = action.payload.perPage;
            state.total = action.payload.total;
            state.totalUnReads = action.payload.totalUnReads;
            return state;
        },
        markRead(state, action) {
            state.data = state.data.map((i) => {
                if (i._id === action.payload.id) {
                    i.isRead = true;
                }
                return i;
            });
            state.totalUnReads = state.totalUnReads - 1;
            return state;
        },
        markReadAll(state) {
            state.data = state.data.map((i) => {
                i.isRead = true;
                return i;
            });
            state.totalUnReads = 0;
            return state;
        },
    },
});

export const notificationsSliceActions = Slice.actions;
export default Slice.reducer;
