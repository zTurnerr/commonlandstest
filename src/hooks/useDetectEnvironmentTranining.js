import { useDispatch } from 'react-redux';
import { updateChangeBackendServer } from '../rest_client';
import { getVersionAppApi } from '../rest_client/apiClient';
import Constants, { getStorage, setStorage } from '../util/Constants';
import { mapSliceActions } from '../redux/reducer/map';

const PRODUCTION = 'production';
const TRAINING = 'training';

const useDetectEnvironmentTraining = () => {
    const dispatch = useDispatch();
    const fetchEnvironmentTraining = async () => {
        try {
            let env = await getStorage(Constants.STORAGE.trainingEnvironment);
            // Never comment below in development
            if (!env) {
                await setStorage(Constants.STORAGE.trainingEnvironment, PRODUCTION);
                env = PRODUCTION;
            }

            if (env === PRODUCTION) {
                updateChangeBackendServer(Constants.backendServer);
            } else {
                updateChangeBackendServer(Constants.backendTestServer);
            }
        } catch (error) {
            updateChangeBackendServer(Constants.backendServer);
        }
    };

    const updateMap = async () => {
        const response = await getVersionAppApi();
        dispatch(
            mapSliceActions.updateMap({
                worthwhileNumber: response?.data?.claimchainFnCThreshold,
                limitPlot: response?.data?.maxPlotPerUser,
            }),
        );
    };

    const switchToProduction = async () => {
        await setStorage(Constants.STORAGE.trainingEnvironment, PRODUCTION);
        await updateChangeBackendServer(Constants.backendServer);
        await updateMap();
    };

    const switchToTraining = async () => {
        await setStorage(Constants.STORAGE.trainingEnvironment, TRAINING);
        await updateChangeBackendServer(Constants.backendTestServer);
        await updateMap();
    };

    const detectIsInProduction = async () => {
        const environment = await getStorage(Constants.STORAGE.trainingEnvironment);
        if (environment === PRODUCTION) return true;
        return false;
    };

    return {
        fetchEnvironmentTraining,
        switchToProduction,
        detectIsInProduction,
        switchToTraining,
        updateMap,
    };
};

export default useDetectEnvironmentTraining;
