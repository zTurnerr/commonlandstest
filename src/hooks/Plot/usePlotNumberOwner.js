import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const usePlotNumberOwner = (claimants) => {
    const navigation = useNavigation();
    useEffect(() => {
        let numberOwner = 0;
        claimants?.forEach((claimant) => {
            if (claimant.role === 'owner' || claimant.type === 'owner') {
                numberOwner++;
            }
        });
        navigation.setParams({ numberOwner });
    }, [claimants]);
};

export default usePlotNumberOwner;
