import useTranslate from '../../../i18n/useTranslate';
import { Box, Text } from 'native-base';

import Button from '../../../components/Button';
import LearnMarkerPlacerment from '../../../components/LearnMarkerPlacerment';
import ModalSnapping from '../../../screen/CreatePlot/ModalSnappingSystem';
import React from 'react';
import { SEND_TYPE } from '../../../util/Constants';
import SnapButton from '../../../components/SnapButton';
import { useDisclose } from 'native-base';

export default function Index({
    step,
    createSubPlotStep = 0,
    error,
    requesting,
    polygonData,
    onCancel,
    onSave,
    onReset,
    onNext,
    selectedClaimant,
    showSnapButton,
    snapButtonType,
    sendMessage,
}) {
    const {
        isOpen: isOpenSnapping,
        onOpen: onOpenSnapping,
        onClose: onCloseSnapping,
    } = useDisclose();
    const snapPoint = (corner = false) => {
        let data = { type: SEND_TYPE.snapPoint };
        if (corner) {
            data.options = {
                corner: true,
            };
        }
        sendMessage(data);
    };
    const t = useTranslate();
    return (
        step === 6 && (
            <>
                <Box {...styles.container}>
                    {error ? <Text {...styles.error}>{error}</Text> : null}
                    {createSubPlotStep === 0 && <LearnMarkerPlacerment />}
                    <Box {...styles.box}>
                        {(!polygonData || (polygonData && createSubPlotStep !== 0)) &&
                            createSubPlotStep !== 2 && (
                                <Button
                                    onPress={onCancel}
                                    _container={{ w: '48%' }}
                                    variant="outline"
                                >
                                    {t('button.cancel')}
                                </Button>
                            )}
                        {polygonData && createSubPlotStep === 0 && (
                            <Button onPress={onReset} _container={{ w: '48%' }} variant="outline">
                                {t('button.reset')}
                            </Button>
                        )}
                        {createSubPlotStep === 0 && (
                            <Button
                                isDisabled={!polygonData}
                                _container={{ w: '48%' }}
                                onPress={onNext}
                            >
                                {t('button.next')}
                            </Button>
                        )}
                        {createSubPlotStep === 1 && (
                            <Button
                                _container={{ w: '48%' }}
                                onPress={onNext}
                                isDisabled={!selectedClaimant}
                            >
                                {t('invite.sendInvite')}
                            </Button>
                        )}
                        {createSubPlotStep === 2 && (
                            <Button
                                isLoading={requesting}
                                _container={{ w: '100%' }}
                                onPress={onSave}
                            >
                                {t('button.submit')}
                            </Button>
                        )}
                    </Box>
                </Box>
                <SnapButton
                    open={showSnapButton}
                    snapPoint={snapPoint}
                    onOpenSnapping={onOpenSnapping}
                    type={snapButtonType}
                />
                <ModalSnapping isOpen={isOpenSnapping} onClose={onCloseSnapping} />
            </>
        )
    );
}

const styles = {
    container: {
        w: 'full',
        px: '20px',
        bottom: '0px',
        py: '20px',
        shadow: 1,
    },
    error: {
        mb: '12px',
        color: 'error.400',
        textAlign: 'center',
    },
    box: {
        flexDir: 'row',
        justifyContent: 'space-between',
    },
};
