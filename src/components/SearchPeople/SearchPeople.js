import React, { useCallback, useState } from 'react';
import { Box, Text, HStack, useTheme } from 'native-base';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import PhoneInput from 'react-native-phone-number-input';
import { StyleSheet, TouchableOpacity } from 'react-native';
import useTranslate from '../../i18n/useTranslate';
import { debounce } from '../../util/debounce';
import { searchPeople } from '../../rest_client/apiClient';
import Error from '../Error';
import UserItem1 from '../UserItem/UserItem1';

const SearchPeople = ({ onSelectUser = () => {}, err, setErr }) => {
    const [value, setValue] = useState('');
    const { mapReducer } = useShallowEqualSelector((state) => ({
        mapReducer: state.map,
    }));
    const [searchedUser, setSearchedUser] = useState(null);
    const t = useTranslate();

    const onChangeFormattedText = useCallback(
        debounce(async (text) => {
            setErr('');
            setSearchedUser(null);
            if (text.length === 0) {
                return;
            }
            try {
                let { data } = await searchPeople({
                    phoneNumber: text,
                });
                if (!data?.user) {
                    setErr(t('subplot.userNotFound'));
                }
                setSearchedUser(data?.user);
            } catch (error) {}
        }, 500),
        []
    );

    return (
        <Box>
            <Box style={styles.containerStyle}>
                <PhoneInput
                    value={value}
                    onChangeText={(text) => {
                        setValue(text);
                    }}
                    onChangeFormattedText={(text) => {
                        onChangeFormattedText(text);
                    }}
                    textInputStyle={{
                        height: 48,
                    }}
                    textContainerStyle={{ backgroundColor: 'white', width: '100%' }}
                    countryPickerButtonStyle={{ width: 'auto' }}
                    containerStyle={{ paddingLeft: 12, width: '100%' }}
                    hideError
                    placeholder={t('components.enterPhoneNumber')}
                    defaultCode={mapReducer.countryCode || 'UG'}
                    withDarkTheme={false}
                    textInputProps={{
                        placeholderTextColor: '#C5C6CC',
                    }}
                />
            </Box>
            {!!err && <Error>{err}</Error>}
            {searchedUser && (
                <Box
                    mt="5px"
                    // shadow={1}
                    shadow={7}
                    bg="white"
                    px="12px"
                    py="12px"
                    borderRadius="8px"
                >
                    <Text fontWeight={'700'} fontSize={'14px'} mb="15px">
                        {t('components.userFound', {
                            number: 1,
                        })}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            setSearchedUser(null);
                            onSelectUser(searchedUser);
                        }}
                    >
                        <UserItem1
                            user={{
                                user: searchedUser,
                            }}
                        />
                    </TouchableOpacity>
                </Box>
            )}
        </Box>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
        borderColor: '#5EC4AC',
        marginTop: 12,
        justifyContent: 'center',
        height: 48,
    },
});

export default SearchPeople;
