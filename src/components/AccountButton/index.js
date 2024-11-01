import { useNavigation } from '@react-navigation/core';
import { Flex } from 'native-base';
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { ModalContext } from '../../screen/Main';
import Avatar from '../Avatar';
import useGetDistanceFromHeader from '../../hooks/useGetDistanceFromHeader';

export default function AccountButton(props) {
    let { user, isLogged } = useShallowEqualSelector((state) => ({
        user: state.user,
        isLogged: state.user.isLogged,
    }));
    const navigate = useNavigation();
    const modalContext = useContext(ModalContext);
    const { distance } = useGetDistanceFromHeader();

    return (
        <Flex
            direction="row"
            justifyContent="center"
            alignItems="center"
            position="absolute"
            left="10px"
            zIndex="2"
            top={`${12 + distance}px`}
            {...props}
        >
            <TouchableOpacity
                onPress={() => {
                    if (!isLogged) {
                        return modalContext.onOpenModal();
                    }
                    navigate.navigate('Profile');
                }}
            >
                <Avatar uri={user?.userInfo.avatar} />
            </TouchableOpacity>
        </Flex>
    );
}
