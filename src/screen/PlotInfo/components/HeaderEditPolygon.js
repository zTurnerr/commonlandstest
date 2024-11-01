import useTranslate from '../../../i18n/useTranslate';
import { Box } from 'native-base';
import React from 'react';
import Steps from '../../../components/Steps';

export default function Index({ step, editPolygonStep }) {
    const t = useTranslate();
    const STEPS_EDIT_POLYGON = [
        {
            label: t('components.editPolygon'),
            value: 0,
        },
        {
            label: t('components.review'),
            value: 1,
        },
    ];
    return (
        step === 7 && (
            <>
                <Box {...styles.container}>
                    <Steps steps={STEPS_EDIT_POLYGON} step={editPolygonStep} />
                </Box>
            </>
        )
    );
}

const styles = {
    container: {
        px: '10px',
        bgColor: 'white',
        pb: '12px',
    },
};
