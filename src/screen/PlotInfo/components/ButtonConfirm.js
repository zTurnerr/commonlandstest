import useTranslate from '../../../i18n/useTranslate';
import Button from '../../../components/Button';
import React from 'react';

const ButtonConfirm = ({ invite, onOpenAcceptClaimant, setSelectedInvite }) => {
    const t = useTranslate();
    return (
        <Button
            _container={{
                w: '100px',
                h: '38px',
                py: 0,
            }}
            _text={{
                fontSize: '12px',
            }}
            variant="outline"
            onPress={() => {
                onOpenAcceptClaimant();
                setSelectedInvite(invite);
            }}
        >
            {t('button.confirm')}
        </Button>
    );
};

export default ButtonConfirm;
