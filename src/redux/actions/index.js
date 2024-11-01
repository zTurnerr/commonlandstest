import {
    getAllPlotFlagged,
    getInvites,
    getTrainerLog,
    getUserPlots,
} from '../../rest_client/apiClient';

import { getAllNo } from './notification';
import { mapSliceActions } from '../reducer/map';
import { userSliceActions } from '../reducer/user';

export const fetchRequiredData = (userInfo, navigation, callback) => {
    return async (dispatch) => {
        try {
            let resUserPlots = await getUserPlots(userInfo._id, navigation, dispatch);
            let response = await getAllPlotFlagged();

            try {
                let resInvites = await getInvites({}, navigation, dispatch);
                dispatch(
                    mapSliceActions.updateInvites({
                        invites: resInvites.data,
                    }),
                );
                let resAgentPermissions = await getTrainerLog();
                dispatch(mapSliceActions.updateAgentPermissions(resAgentPermissions?.data));
            } catch (err) {}
            let dataUpdate = { userInfo, isLogged: true };
            if (resUserPlots.data) {
                dataUpdate.plots = resUserPlots?.data;
            }
            if (response?.data) {
                dataUpdate.plotFlagged = response?.data;
            }

            dispatch(userSliceActions.setData(dataUpdate));
            dispatch(getAllNo());
            if (callback) {
                callback();
            }
            if (navigation) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                });
            }
        } catch (err) {
            if (callback) {
                callback(err);
            }
        }
    };
};
