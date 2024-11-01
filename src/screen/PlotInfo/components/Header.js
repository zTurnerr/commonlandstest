import React, { useEffect } from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../../components/Header';

import ButtonEdit from './ButtonEditPlot';

export default function Index({
    step,
    setStep,
    plotData,
    isLoading,
    hideMarker,
    renderPlot,
    navigation,
    onSelectAction,
    title,
    SPACIAL_TAB,
    onCancelCreateSubPlot,
    onCancelEditPolygon,
    isOpenWholeMap,
    onPressOpenMapWide,
    guestBtn = null,
}) {
    const {
        createSubPlotInvitation,
        deletePlot,
        editPlotBoundaries,
        inviteClaimant,
        inviteNeighbor,
    } = plotData?.permissions || {};
    const isShowButtonEdit =
        step === 0 &&
        !isLoading &&
        (createSubPlotInvitation ||
            deletePlot ||
            editPlotBoundaries ||
            inviteClaimant ||
            inviteNeighbor);

    useEffect(() => {
        navigation.setParams({
            isShowButtonEdit,
        });
    }, [isShowButtonEdit]);

    return (
        <Header
            icon={<MaterialCommunityIcons name="close" size={20} color="black" />}
            onBack={() => {
                if (isOpenWholeMap) {
                    hideMarker();
                    return onPressOpenMapWide();
                }
                if (step !== 0) {
                    // remove marker image selected
                    if (SPACIAL_TAB.includes(step)) {
                        renderPlot(null);
                    }
                    // invite step back to review plot
                    if (step === 1) {
                        hideMarker();
                    }
                    if (step === 6) {
                        onCancelCreateSubPlot();
                    }
                    if (step == 7) {
                        onCancelEditPolygon();
                    }
                    return setStep(0);
                }
                if (navigation.canGoBack()) {
                    navigation.goBack();
                } else {
                    navigation.navigate('Main');
                }
            }}
            title={title}
        >
            {!isOpenWholeMap && !isLoading && isShowButtonEdit && (
                <ButtonEdit
                    permissions={plotData?.permissions}
                    onSelect={onSelectAction}
                    plotData={plotData}
                />
            )}
            {!isOpenWholeMap &&
                !isLoading &&
                step === 0 &&
                !isShowButtonEdit &&
                plotData?.waitingAssign !== 'pending' &&
                guestBtn}
        </Header>
    );
}
