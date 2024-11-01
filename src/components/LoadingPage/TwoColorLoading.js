/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Box, Image } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';
import loading from '../../images/loadingTwoColor.png';

export default function TwoColorLoading() {
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
            // position: 'absolute',
            // left: 15,
            // top: 42,
            // height: 12,
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
        <Box alignItems="center" justifyContent="center">
            <Animated.View style={{ ...animationStyle.sm, ...animationStyle.rotate }}>
                <Image source={loading} alt="loading" />
            </Animated.View>
        </Box>
    );
}
