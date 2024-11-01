import useTranslate from '../../../i18n/useTranslate';
import { Box, Text, useTheme } from 'native-base';
import Button from '../../../components/Button';
import LearnMarkerPlacement from '../../../components/LearnMarkerPlacerment';
import ModalSnapping from '../../CreatePlot/ModalSnappingSystem';
import React, { useEffect, useState } from 'react';
import { SEND_TYPE } from '../../../util/Constants';
import SnapButton from '../../../components/SnapButton';
import { useDisclose } from 'native-base';
import ModalConfirmDecision from '../../../components/Modal/ModalConfirmDecision';
import { MaximizeIcon } from '../../../components/Icons';
import ModalOverlap from '../../CreatePlot/ModalOverlap';
import ModalOverlapNotAllow from '../../CreatePlot/ModalOverlapNotAllow';

const Icon = () => {
    const { colors } = useTheme();
    return (
        <Box borderRadius={'12px'} p={'6px'} mt={'10px'} bgColor={'primary.100'}>
            <MaximizeIcon color={colors.primary[600]} />
        </Box>
    );
};

export default function Index({
    step,
    editPolygonStep = 0,
    error,
    requesting,
    onCancel,
    onSave,
    onNext,
    showSnapButton,
    snapButtonType,
    sendMessage,
    onBackEditPolygon,
    isDisabledNextEditPolygon,
    overlapEditPolygon,
    setOverlapEditPolygon,
    isLoading,
    isOverlap,
}) {
    const {
        isOpen: isOpenSnapping,
        onOpen: onOpenSnapping,
        onClose: onCloseSnapping,
    } = useDisclose();
    const { isOpen: isOpenConfirm, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useDisclose();
    const t = useTranslate();
    const snapPoint = (corner = false) => {
        let data = { type: SEND_TYPE.snapPoint };
        data.options = {
            newSnap: true,
        };
        if (corner) {
            data.options.corner = true;
        }
        sendMessage(data);
    };
    const [overSnapEnableWarning, setOverSnapEnableWarning] = useState(false);

    useEffect(() => {
        if (isOverlap > 0) {
            setOverSnapEnableWarning(true);
        }
    }, [isOverlap]);

    const onBack = () => {
        if (editPolygonStep === 0) {
            onCancel();
        } else {
            onBackEditPolygon();
        }
    };

    const onCloseOverlap = () => {
        setOverlapEditPolygon(false);
    };

    const onSavingEdit = async () => {
        await onSave();
        onCloseConfirm();
        // if (res === 'success') {

        // } else {
        //     onCloseConfirm();
        // }
    };

    return (
        <>
            {step === 7 && (
                <>
                    <Box {...styles.container}>
                        {error ? <Text {...styles.error}>{error}</Text> : null}
                        <LearnMarkerPlacement />
                        <Box {...styles.box}>
                            <Button onPress={onBack} _container={{ w: '48%' }} variant="outline">
                                {editPolygonStep === 0 ? t('button.cancel') : t('button.back')}
                            </Button>
                            {editPolygonStep === 0 && (
                                <Button
                                    _container={{ w: '48%' }}
                                    onPress={() => onNext()}
                                    isDisabled={isDisabledNextEditPolygon}
                                >
                                    {t('button.next')}
                                </Button>
                            )}
                            {editPolygonStep === 1 && (
                                <Button
                                    isLoading={requesting}
                                    _container={{ w: '48%' }}
                                    onPress={onOpenConfirm}
                                    isDisabled={error}
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
            )}
            <ModalConfirmDecision
                Icon={Icon}
                isVisible={isOpenConfirm}
                onClose={onCloseConfirm}
                onCancel={onCloseConfirm}
                title={t('components.updatedPlot')}
                confirmBtnText={t('button.agreeProceed')}
                cancelBtnText={t('button.cancel')}
                description={t('plot.updatePlotPolygonDesc')}
                descriptionStyling={{
                    mt: '20px',
                    mb: '10px',
                    px: '15px',
                }}
                onConfirm={onSavingEdit}
                isLoading={isLoading}
            />
            <ModalOverlap
                isOpen={overlapEditPolygon}
                onClose={onCloseOverlap}
                onPressSubmit={() => onNext(true)}
            />
            <ModalOverlapNotAllow
                isVisible={overSnapEnableWarning}
                onClose={() => setOverSnapEnableWarning(false)}
            />
        </>
    );
}

const styles = {
    container: {
        w: 'full',
        px: '20px',
        bottom: '0px',
        py: '20px',
        shadow: 1,
        bgColor: 'white',
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
