import { createSlice } from '@reduxjs/toolkit';
const initialModel = {
    userInfo: {},
    plots: [],
    isLogged: false,
    fetched: false,
    showWarning: false,
    isFetching: true,
    plotFlagged: [],
    language: 'en',
    trainer: {},
};

export const Slice = createSlice({
    name: 'user',
    initialState: initialModel,
    reducers: {
        setData(state, action) {
            let { payload } = action;
            for (let key in payload) {
                if (typeof state[key] === 'object' && !Array.isArray(state[key])) {
                    state[key] = { ...state[key], ...payload[key] };
                } else {
                    state[key] = payload[key];
                }
            }
            return state;
        },
        reset() {
            return {
                userInfo: {},
                plots: [],
                isLogged: false,
                fetched: false,
                showWarning: false,
                plotFlagged: [],
                isFetching: false,
                language: 'en',
            };
        },
        updateUserInfo(state, action) {
            let { payload } = action;
            state.userInfo = {
                ...state.userInfo,
                ...payload.userInfo,
            };
            return state;
        },
        addPlots(state, action) {
            let { payload } = action;
            if (!state.plots) {
                state.plots = [];
            }
            state.plots.unshift(payload.plot);
            return state;
        },
        updatePlots(state, action) {
            let { payload } = action;
            state.plots = payload.plots;
            return state;
        },
        deletePlot(state, action) {
            let { payload } = action;
            state.plots = state.plots.filter((plot) => payload.id !== plot._id) || [];
            return state;
        },
        updateDocumentation(state, action) {
            let { payload } = action;
            state.userInfo.documentation = payload.documentation;
            return state;
        },
        setShowWarning(state, action) {
            let { payload } = action;
            state.showWarning = payload.showWarning;
            return state;
        },
        setLogged(state, action) {
            let { payload } = action;
            state.isLogged = payload.isLogged;
            state.isFetching = false;
            return state;
        },
        setFetching(state, action) {
            let { payload } = action;
            state.isFetching = payload.isFetching;
            return state;
        },
        setLanguage(state, action) {
            let { payload } = action;
            state.language = payload.language;
            return state;
        },
    },
});

export const userSliceActions = Slice.actions;
export default Slice.reducer;
