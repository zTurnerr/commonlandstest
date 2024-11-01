import { useNavigation } from '@react-navigation/native';
import { Avatar, Box, Image, Text } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../themes';
import Images from '../themes/Images';
import AgentHeader from './Header/AgentHeader';

const HeaderPage = (props) => {
    const {
        title,
        onPress,
        isRight = false,
        children,
        shadow = 1,
        avatar = '',
        backIcon,
        _container,
    } = props || {};
    const navigation = useNavigation();

    const defaultOnPress = () => {
        navigation.goBack();
    };
    return (
        <>
            <AgentHeader />
            <Box
                backgroundColor={Colors.white}
                h={'66px'}
                justifyContent={'center'}
                shadow={shadow}
                {..._container}
            >
                <Box
                    px={'16px'}
                    flexDir={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                >
                    <TouchableOpacity style={styles.container} onPress={onPress || defaultOnPress}>
                        {avatar ? (
                            <Avatar size={'34px'} source={{ uri: avatar }} />
                        ) : (
                            backIcon || (
                                <Image
                                    alt="android"
                                    w={'20px'}
                                    h={'20px'}
                                    source={Images.icArrowBack}
                                />
                            )
                        )}
                        <Text ml={'8px'} fontWeight={'700'} fontSize={'16px'}>
                            {title}
                        </Text>
                    </TouchableOpacity>
                    {isRight && children}
                </Box>
            </Box>
        </>
    );
};

export default HeaderPage;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
