import { ALL_STATUS } from '../../util/Constants';
import { CLAIMCHAIN_NUMBER } from 'cml-script';
import Constants from '../../util/Constants';
import { createSlice } from '@reduxjs/toolkit';

export const initFilter = {
    status: ALL_STATUS.value,
    showClaimchain: CLAIMCHAIN_NUMBER.map((i) => i.value),
    showUnConnect: true,
};

const initialModel = {
    userPosition: {},
    haveFetchData: false,
    currentPosition: {
        long: 32.58252,
        lat: 1.747596,
        zoom: 6,
    },
    plots: [],
    invites: {
        created: [],
        received: [],
    },
    agentPermissions: [],
    plotsCluster: [],
    filter: initFilter,
    worthwhileNumber: Constants.worthwhileNumber,
    limitPlot: Constants.limitPlot,
    countryCode: 'UG',
};

export const Slice = createSlice({
    name: 'map',
    initialState: initialModel,
    reducers: {
        reset(state) {
            return {
                userPosition: {},
                currentPosition: {},
                plots: [],
                invites: {
                    created: [],
                    received: [],
                },
                filter: initFilter,
                worthwhileNumber: state.worthwhileNumber,
                countryCode: state.countryCode,
                limitPlot: state.limitPlot,
            };
        },
        markAsFetched(state) {
            state.haveFetchData = true;
            return state;
        },
        updateCurrentPosition(state, action) {
            let { payload } = action;
            state.currentPosition = {
                ...state.currentPosition,
                ...payload.currentPosition,
            };
            return state;
        },
        updateUserPosition(state, action) {
            let { payload } = action;
            state.userPosition = {
                ...state.userPosition,
                ...payload.userPosition,
            };
            return state;
        },
        updatePlots(state, action) {
            let { payload } = action;
            state.plots = payload.plots;
            return state;
        },
        addPlots(state, action) {
            let { payload } = action;
            if (!state.plots) {
                state.plots = [];
            }
            state.plots.push(payload.plot);
            return state;
        },
        updateInvites(state, action) {
            let { payload } = action;
            state.invites = payload.invites;
            return state;
        },
        updatePlotsCluster(state, action) {
            let { payload } = action;
            state.plotsCluster = payload.plots;
            return state;
        },
        updateFilter(state, action) {
            let { payload } = action;
            state.filter = payload.filter;
            return state;
        },
        updateWorthwhileNumber(state, action) {
            let { payload } = action;
            state.worthwhileNumber = payload.worthwhileNumber;
            return state;
        },
        updateLimitPlot(state, action) {
            let { payload } = action;
            state.limitPlot = payload.limitPlot;
            return state;
        },
        updateMap(state, action) {
            let { payload } = action;
            state = {
                ...state,
                ...payload,
            };
            return state;
        },
        updateAgentPermissions(state, action) {
            let { payload } = action;
            state.agentPermissions = payload?.data;
            return state;
        },
    },
});

export const mapSliceActions = Slice.actions;
export default Slice.reducer;
