import {
    getPlotByRectangle,
    getPlotByRectanglePublic,
    getPlotsByRectangleLimited,
} from '../../rest_client/apiClient';

import axios from 'axios';
import { mapSliceActions } from '../reducer/map';

const CancelToken = axios.CancelToken;
let source, source2;

export const fetchPlots = (data, navigation, callback, isLogged) => {
    return async (dispatch) => {
        try {
            if (source) {
                source.cancel('fetch plot cancel');
            }
            source = CancelToken.source();
            let resPlots = await (isLogged ? getPlotByRectangle : getPlotByRectanglePublic)(
                data,
                navigation,
                {
                    cancelToken: source.token,
                },
                dispatch,
            );
            source = null;

            dispatch(
                mapSliceActions.updatePlots({
                    plots: resPlots.data.claimchains,
                }),
            );
            callback();
        } catch (err) {
            callback(err);
        }
    };
};
export const fetchPlotsLimited = (data, navigation, callback) => {
    return async (dispatch) => {
        try {
            if (source2) {
                source2.cancel('fetch plot cancel');
            }
            source2 = CancelToken.source();
            let resPlots = await getPlotsByRectangleLimited(
                data,
                navigation,
                {
                    cancelToken: source2.token,
                },
                dispatch,
            );
            source2 = null;
            dispatch(
                mapSliceActions.updatePlotsCluster({
                    plots: resPlots.data.claimchains,
                }),
            );
            callback();
        } catch (err) {
            console.log(err);
            callback(err);
        }
    };
};
