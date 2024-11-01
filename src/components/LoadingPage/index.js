/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Box, Image, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';
import loadingLg from '../../images/loadingLg.png';
import loadingMd from '../../images/loadingMd.png';
import loadingSm from '../../images/loadingSm.png';

export default function Index(props) {
    const text = props.text || 'Loading...';
    const [animation] = useState(new Animated.Value(0));
    const [animation2] = useState(new Animated.Value(0));

    const start = () => {
        Animated.loop(
            Animated.timing(animation, {
                toValue: 1,
                duration: 1200,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ).start();
        Animated.loop(
            Animated.timing(animation2, {
                toValue: 1,
                duration: 1200,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ).start();
    };
    useEffect(() => {
        start();
    }, []);
    const spin = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });
    const spin2 = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['360deg', '0deg'],
    });
    const animationStyle = {
        sm: {
            position: 'absolute',
            left: 15,
            top: 42,
            height: 12,
            justifyContent: 'flex-end',
        },
        rotate: {
            transform: [
                {
                    rotate: spin,
                },
            ],
        },
        rotate2: {
            transform: [
                {
                    rotate: spin2,
                },
            ],
        },
        lg: {
            height: 42,
            width: 42,
            justifyContent: 'flex-end',
        },
        md: {
            height: 28,
            justifyContent: 'flex-start',
            top: 35,
        },
    };
    return (
        <Box
            bgColor="rgba(73, 96, 108, 1)"
            position="absolute"
            w="full"
            h="full"
            zIndex="3"
            alignItems="center"
            justifyContent="center"
            {...props}
        >
            <Box alignItems="center" justifyContent="center">
                <Animated.View style={{ ...animationStyle.sm, ...animationStyle.rotate2 }}>
                    <Image source={loadingSm} alt="sm" />
                </Animated.View>
                <Animated.View style={{ ...animationStyle.rotate, ...animationStyle.md }}>
                    <Image source={loadingMd} alt="md" />
                </Animated.View>
                <Animated.View style={{ ...animationStyle.rotate2, ...animationStyle.lg }}>
                    <Image source={loadingLg} alt="lg" />
                </Animated.View>
            </Box>

            <Text mt="14px" color="rgba(255, 255, 255, 1)">
                {text}
            </Text>
        </Box>
    );
}
