import React from 'react';
import { UserAddIcon } from '../../../components/Icons';
import IconWrapper from './IconWrapper';
import Info from './Info';
import Wrapper from './Wrapper';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'native-base';
import TYPES from '../NotificationConstants';
import { getEditPlotPolygon } from '../../../rest_client/apiClient';
import { SCREEN_HEIGHT, showMessage } from '../../../util/Constants';
import useTranslate from '../../../i18n/useTranslate';

export default function Index({ data }) {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const t = useTranslate();

    const onPress = async () => {
        const json = JSON.parse(data.data);
        let plotId = json.plotId;
        let plotName = json.plotName;
        let disputePlotId = json?.disputePlotId;
        let disputePlotName = json?.disputePlotName;
        let title = data?.title;
        if (data.type === TYPES.editPlotRequest) {
            try {
                let { data } = await getEditPlotPolygon(plotId);
                if (!data?.allOwnersVoted && disputePlotId) {
                    throw t('error.voteInProgress');
                }
                navigation.navigate('PolygonPending', {
                    plotId: plotId,
                    namePlot: plotName,
                    disputePlotId,
                    disputePlotName,
                });
            } catch (err) {
                const text = err || err?.message;
                let lines = text?.length > 50 ? 2 : 1;
                showMessage({
                    text: err || err?.message,
                    marginBottom: SCREEN_HEIGHT - 30 - lines * 15,
                });
            }
        } else {
            if (title.includes('Edit plot boundaries rejected')) {
                navigation.navigate('PolygonPending', {
                    plotId: plotId,
                    namePlot: plotName,
                    disputePlotId,
                    viewHistory: true,
                });
            } else {
                navigation.push('PlotInfo', {
                    plotID: plotId,
                });
            }
        }
    };

    return (
        <Wrapper data={data} onPress={onPress}>
            <IconWrapper>
                <UserAddIcon color={colors.primary[600]} />
            </IconWrapper>
            <Info data={data} />
        </Wrapper>
    );
}
