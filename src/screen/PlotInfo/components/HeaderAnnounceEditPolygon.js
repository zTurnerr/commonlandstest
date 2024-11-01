import { Box, HStack, Text, useTheme } from 'native-base';
import React, { useMemo } from 'react';
import useTranslate from '../../../i18n/useTranslate';
import { TouchableOpacity } from 'react-native';
import { EditPolygonIcon } from '../../../components/Icons';
import { useNavigation } from '@react-navigation/native';
import { getPlotByID } from '../../../rest_client/apiClient';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';

const HeaderAnnounceEditPolygon = ({ step, plotData, ghostPlotDisputes, isOpenWholeMap }) => {
    const t = useTranslate();
    const { colors } = useTheme();
    const navigation = useNavigation();
    const availableDisputeGhost =
        ghostPlotDisputes?.length > 0 && ghostPlotDisputes[0]?.allOwnersVoted;
    const claimants = plotData?.claimants || [];
    const userInfo = useShallowEqualSelector((state) => state.user.userInfo);

    const toShowUser = useMemo(() => {
        const usr = claimants.find((item) => item._id === userInfo?._id);
        if (usr) return true;
        return false;
    }, [claimants, isOpenWholeMap]);

    const onNavigateToEditingPolygon = async () => {
        if (plotData?.isEditing) {
            navigation.navigate('PolygonPending', {
                plotId: plotData?.plot?._id,
                namePlot: plotData?.plot?.name,
            });
        } else {
            let { data } = await getPlotByID(ghostPlotDisputes[0]?.rootPlot, navigation);
            navigation.navigate('PolygonPending', {
                plotId: data?.plot?._id,
                namePlot: data?.plot?.name,
                disputePlotId: plotData?.plot?._id,
            });
        }
    };

    const title = useMemo(() => {
        let txt = 'polygonEditing.newDisputeStatus';
        if (plotData?.isEditing) {
            txt = 'polygonEditing.newUpdatedPendingApproval';
            if (plotData?.allOwnersVoted) {
                txt = 'polygonEditing.pendingApproveByNeighbor';
            }
        }
        return t(txt);
    }, [availableDisputeGhost, plotData?.allOwnersVoted]);

    if (
        step === 0 &&
        !isOpenWholeMap &&
        toShowUser &&
        (plotData?.isEditing || availableDisputeGhost)
    ) {
        return (
            <Box px={'20px'} py={'15px'} bgColor={'yellow.900'}>
                <HStack space={2}>
                    <EditPolygonIcon
                        strokeWidth={2}
                        width="20"
                        height="20"
                        color={colors.yellow[1500]}
                    />
                    <Text color={'yellow.1500'} flex={1} fontWeight={600}>
                        {title}
                    </Text>
                    <TouchableOpacity onPress={onNavigateToEditingPolygon}>
                        <Text underline color={'yellow.1500'}>
                            {t('button.view')}
                        </Text>
                    </TouchableOpacity>
                </HStack>
            </Box>
        );
    }
    return null;
};

export default HeaderAnnounceEditPolygon;
