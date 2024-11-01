import { Box, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import useTranslate from '../../i18n/useTranslate';
import { getCurrentAccount } from '../../util/script';

export default function Index() {
    const [mnemonic, setMnemonic] = useState('');
    const _getCurrentAccount = async () => {
        try {
            const account = await getCurrentAccount();
            setMnemonic(account.seedPhrase);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        _getCurrentAccount();
    }, []);
    const t = useTranslate();
    return (
        <Box p="22px">
            <Text fontSize="14px" fontWeight="bold">
                {t('others.yourMnemonicCode')}:
            </Text>
            <Text>{mnemonic}</Text>
        </Box>
    );
}
