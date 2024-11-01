import { useEffect, useState } from 'react';
import useDetectEnvironmentTraining from '../useDetectEnvironmentTranining';

const useGetTrainingMode = () => {
    const [isTraining, setIsTraining] = useState(false);
    const { detectIsInProduction } = useDetectEnvironmentTraining();

    const checkTrainingMode = async () => {
        try {
            const isProduction = await detectIsInProduction();
            setIsTraining(!isProduction);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        checkTrainingMode();
    }, []);
    return { isTraining };
};

export default useGetTrainingMode;
