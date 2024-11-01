import { Box, ScrollView } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import BasicProfile from '../../components/BasicProfile';
import Header from '../../components/Header';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';

export default function Index() {
    const user = useShallowEqualSelector((state) => state.user.userInfo);
    const t = useTranslate();
    return (
        <Box h="full">
            <Header title={t('profile.profileHistory')} />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <BasicProfile data={user} hideName active />
                {user.oldNumbers?.length ? (
                    <BasicProfile
                        data={{
                            phoneNumber: user.oldNumbers[user.oldNumbers.length - 1],
                            avatar: user.oldPOF,
                        }}
                        hideName
                        mt="12px"
                    />
                ) : null}
            </ScrollView>
        </Box>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        paddingBottom: 40,
    },
});
