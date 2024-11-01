import { useNavigation } from '@react-navigation/native';

export const useFlagAndUnFlag = () => {
    const navigation = useNavigation();
    const goToPlotInfo = (data) => {
        let info = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
        return navigation.push('PlotInfo', {
            plotID: info.plotID,
        });
    };
    return { goToPlotInfo };
};
