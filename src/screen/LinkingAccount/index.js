import { Box, Center, ScrollView, Text } from 'native-base';
import React from 'react';
import HeaderPage from '../../components/HeaderPage';
import ShieldTick from '../../components/Icons/ShieldTick';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import AccountList from './components/AccountList';
import LinkAccountDetail from './components/LinkAccountDetail';
import NoAccountLink from './components/NoAccountLink';

const LinkingAccount = ({ navigation }) => {
    let { user } = useShallowEqualSelector((state) => ({
        user: state.user.userInfo,
    }));
    return (
        <Box h="full">
            <HeaderPage
                onPress={() => {
                    navigation.goBack();
                }}
                title={'Linking Account'}
                isRight={true}
            >
                <LinkAccountDetail />
            </HeaderPage>
            <ScrollView>
                <Box flex={1} px="10px">
                    {!user?.msisdn?.length ? (
                        <NoAccountLink navigation={navigation} />
                    ) : (
                        <AccountList />
                    )}
                </Box>
            </ScrollView>
            <Center pt="15px" flexDirection={'row'} pb="15px">
                <ShieldTick color="#5EC4AC" />
                <Text ml="5px" color="gray.700" fontSize={'12px'} fontWeight={500}>
                    Absolutely secure all your information
                </Text>
            </Center>
        </Box>
    );
};

export default LinkingAccount;
