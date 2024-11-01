import { Box, ScrollView } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import Notifications from './NotificationSetting';

export default function Index() {
    return (
        <Box w="full" h="full" bgColor="white">
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Box px="12px" w="full" mt="12px">
                    <Notifications />
                </Box>
            </ScrollView>
        </Box>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        paddingBottom: 40,
    },
});
