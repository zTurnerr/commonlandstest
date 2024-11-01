import useTranslate from '../../../i18n/useTranslate';
import { Box } from 'native-base';
import React from 'react';
import Steps from '../../../components/Steps';

export default function Index({ step, createSubPlotStep }) {
    const t = useTranslate();
    const STEPS_CREATE_PLOT = [
        {
            label: t('subplot.addSubPlot'),
            value: 0,
        },
        {
            label: t('components.invitePeople'),
            value: 1,
        },
        {
            label: t('components.review'),
            value: 2,
        },
    ];
    return step === 6 ? (
        <Box {...styles.container}>
            <Steps steps={STEPS_CREATE_PLOT} step={createSubPlotStep} />
        </Box>
    ) : null;
}

const styles = {
    container: {
        mb: '12px',
        px: '4px',
    },
};
