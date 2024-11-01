import { useMemo } from 'react';
import useShallowEqualSelector from '../redux/customHook/useShallowEqualSelector';
import { CheckExistTrainer } from '../components/Header/utils/trainer';
import useGetTrainingMode from './dev/useGetTrainingMode';

const useGetDistanceFromHeader = () => {
    let { user } = useShallowEqualSelector((state) => ({
        user: state.user,
    }));
    const trainer = user?.trainer;
    const { isTraining } = useGetTrainingMode();

    const distance = useMemo(() => {
        let _distance = 0;
        if (isTraining) _distance = 24;
        if (!CheckExistTrainer(trainer, { userInfo: user?.userInfo || user })) {
            _distance += 24;
        }
        return _distance;
    }, [user, trainer, isTraining]);

    return { distance };
};

export default useGetDistanceFromHeader;
