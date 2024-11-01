import { Center, Input, SearchIcon } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';

const SearchBoxContract = ({
    onFocus = () => {},
    autoFocus = false,
    onChange = () => {},
    onSubmit = () => {},
    value = '',
}) => {
    const t = useTranslate();
    return (
        <Input
            onFocus={onFocus}
            autoFocus={autoFocus}
            flex={1}
            value={value}
            onChangeText={(value) => {
                onChange(value);
            }}
            onSubmitEditing={() => {
                onSubmit();
            }}
            InputLeftElement={
                <Center px="10px" bg="gray.1600" height={'full'}>
                    <SearchIcon size="md" />
                </Center>
            }
            placeholder={t('contract.searchByPhone')}
            _input={{
                bg: 'gray.1600',
            }}
            borderColor={'transparent'}
            keyboardType="numeric"
        />
    );
};

export default SearchBoxContract;
