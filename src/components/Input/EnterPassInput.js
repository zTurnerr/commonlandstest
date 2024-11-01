import { Input } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';

const EnterPassInput = ({ passwordObj = {} }) => {
    const t = useTranslate();
    return (
        <Input
            flex={1}
            _input={{
                bg: 'gray.1600',
            }}
            type="password"
            value={passwordObj?.password}
            onChangeText={(text) => {
                passwordObj.setPassword(text);
            }}
            placeholder={t('contract.enterPass2')}
        />
    );
};

export default EnterPassInput;
