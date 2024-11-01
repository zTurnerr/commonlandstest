import { configureStore } from '@reduxjs/toolkit';
import user from './reducer/user';
import settings from './reducer/settings';
import notifications from './reducer/notifications';
import map from './reducer/map';
import contractFilter from './reducer/contractFilter';
import claimrankSheet from './reducer/modal/claimrankSheetSlice';
import cannotAttestModal from './reducer/modal/cannotAttestModalSlice';
import plotDetailPage from './reducer/page/plotDetailPageSlice';
export default configureStore({
    reducer: {
        user,
        settings,
        notifications,
        map,
        contractFilter,
        claimrankSheet,
        cannotAttestModal,
        plotDetailPage,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
