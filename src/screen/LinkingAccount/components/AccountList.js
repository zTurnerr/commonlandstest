import { useNavigation } from '@react-navigation/native';
import { AddIcon, Box, Center, HStack, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import AccountItem from './AccountItem';

const AccountList = ({
    showAddBtn = true,
    canSelect = false,
    canDel = true,
    msisdnSelected = '',
    setMsisdnSelected = () => {},
}) => {
    let { user } = useShallowEqualSelector((state) => ({
        user: state.user.userInfo,
    }));
    const navigation = useNavigation();
    return (
        <Box w="full">
            {user?.msisdn?.length
                ? user?.msisdn?.map((item, index) => {
                      return (
                          <AccountItem
                              msisdnSelected={msisdnSelected}
                              setMsisdnSelected={setMsisdnSelected}
                              canDel={canDel}
                              canSelect={canSelect}
                              item={item}
                              key={index}
                          />
                      );
                  })
                : null}
            {showAddBtn && (
                <HStack w="full" justifyContent={'center'}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('AddAccountLink');
                        }}
                    >
                        <Center
                            flexDirection={'row'}
                            bg="primary.600"
                            px="15px"
                            py="10px"
                            borderRadius={'24px'}
                            mt="24px"
                        >
                            <AddIcon color="white" size="3.5" />
                            <Text ml="6px" color="white" fontSize={'12px'} fontWeight={700}>
                                Add account link
                            </Text>
                        </Center>
                    </TouchableOpacity>
                </HStack>
            )}
        </Box>
    );
};

export default AccountList;
