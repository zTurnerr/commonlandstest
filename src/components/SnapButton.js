import { Box, Button, Icon, Text } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import useTranslate from '../i18n/useTranslate';
import Constants, { getStorage, setStorage } from '../util/Constants';
import { ArrowLeftSquare, SnapPoint } from './Icons';

import { useTheme } from 'native-base';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonC from './Button';

const FlashingBackground = () => {
    const colorAnimation = useRef(new Animated.Value(0)).current;
    const { colors } = useTheme();
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(colorAnimation, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: false,
                }),
                Animated.timing(colorAnimation, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: false,
                }),
            ]),
        ).start();
    }, [colorAnimation]);

    const backgroundColor = colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['white', colors.primary[500]],
    });

    return <Animated.View style={[styles.container, { backgroundColor }]} />;
};

export default function Index({ open, snapPoint = () => {}, onOpenSnapping, type }) {
    const t = useTranslate();
    const [extend, setExtend] = useState(false);
    const { colors } = useTheme();
    useEffect(() => {
        initState();
    }, []);
    const initState = async () => {
        let status = await getStorage(Constants.STORAGE.snapStatus);
        if (status === 'true') {
            status === true;
        } else {
            status = false;
        }
        setExtend(Boolean(status));
    };
    const show = () => {
        try {
            setExtend(true);
            setStorage(Constants.STORAGE.snapStatus, 'true');
        } catch (err) {}
    };
    const hide = () => {
        try {
            setExtend(false);
            setStorage(Constants.STORAGE.snapStatus, 'false');
        } catch (err) {}
    };

    return open ? (
        extend ? (
            <Box {...styles.container2}>
                <Box {...styles.containerSnapPoint}>
                    <SnapPoint />
                    <Text flex={1} fontWeight="bold">
                        {t('snap.title')}
                    </Text>
                </Box>
                <Box {...styles.containerSnapLine}>
                    <Button {...styles.snapLine} onPress={() => snapPoint(false)}>
                        {t('snap.snapToLine')}
                    </Button>
                    <ButtonC
                        {...styles.snapCorner}
                        variant="outline"
                        onPress={() => snapPoint(true)}
                        isDisabled={type === 0}
                    >
                        {t('snap.snapCorner')}
                    </ButtonC>
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                    <TouchableOpacity onPress={onOpenSnapping}>
                        <Box flexDirection="row" alignItems="center">
                            <Icon
                                as={<MaterialCommunityIcons name="information-outline" />}
                                {...styles.iconInfo}
                            />
                            <Text {...styles.learnMore}>{t('snap.learnMore')}</Text>
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={hide}>
                        <Box flexDir="row">
                            <Text mr="4px" color="text.secondary">
                                {t('snap.hideSnap')}
                            </Text>
                            <ArrowLeftSquare color={colors.text.secondary} />
                        </Box>
                    </TouchableOpacity>
                </Box>
            </Box>
        ) : (
            <Box {...styles.container3}>
                <TouchableOpacity onPress={() => show()}>
                    <Box {...styles.container3Content}>
                        <SnapPoint /> <Text fontWeight="bold">{t('snap.snap')}</Text>
                    </Box>
                </TouchableOpacity>

                <FlashingBackground />
            </Box>
        )
    ) : null;
}

const styles = {
    container: {
        flex: 2,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'white',
        position: 'absolute',
        top: -8,
        right: -4,
    },
    container2: {
        p: '12px',
        position: 'absolute',
        bottom: '147px',
        background: 'white',
        w: '94%',
        borderWidth: '1px',
        borderColor: 'gray.100',
        shadow: 9,
        borderRadius: '12px',
        left: '3%',
    },
    container3: {
        position: 'absolute',
        bottom: '147px',
        background: 'white',
        w: '82px',
        h: '40px',
        borderWidth: '1px',
        borderColor: 'gray.100',
        shadow: 9,
        borderRadius: '12px',
        right: '12px',
    },
    container3Content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        w: 'full',
        h: 'full',
    },
    containerSnapPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        mb: '16px',
    },
    containerSnapLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        mb: '12px',
    },
    snapLine: {
        h: '32px',
        w: '48%',
        p: '0px',
        mr: '8px',
        _text: {
            fontSize: '12px',
        },
    },
    snapCorner: {
        h: '32px',
        w: '48%',
        p: '0px',
        _text: {
            fontSize: '12px',
        },
    },
    iconInfo: {
        size: 6,
        color: 'link',
        mr: '4px',
    },
    learnMore: {
        fontSize: '12px',
        fontWeight: '500',
        color: 'link',
    },
};
