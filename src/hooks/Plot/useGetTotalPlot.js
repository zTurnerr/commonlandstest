import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { CheckExistTrainer } from '../../components/Header/utils/trainer';

const useGetTotalPlot = () => {
    const { mapReducer, numberOfPlot, user } = useShallowEqualSelector((state) => ({
        mapReducer: state.map,
        numberOfPlot: state.user.plots?.length + (state.user.userInfo.blockedPlots?.length || 0),
        user: state.user,
    }));
    return {
        total: numberOfPlot,
        limitPlot: mapReducer?.limitPlot,
        isTraining: !CheckExistTrainer(user?.trainer, user),
    };
};

export default useGetTotalPlot;
