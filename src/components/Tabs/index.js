import { Box, Flex, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';
import { SCREEN_WIDTH } from '../../util/Constants';

const style = { flex: 1 };
const tabs = 2;
/**
 * @typedef {{
 * label: string
 * }} TabsItem
 * @typedef {{
 * items: TabsItem[]
 * activeIndex: number
 * onTabChange: (index: number) => void
 * width: number
 * } & import('native-base').IFlexProps} TabsProps
 * @param {TabsProps} props
 * @returns {React.ReactElement}
 */
export default function Tabs(props) {
    const {
        items,
        activeIndex = 0,
        onTabChange = () => {},
        width = SCREEN_WIDTH,
        ...other
    } = props;
    const [windowWidth, setWidth] = useState(width);
    const Left = [0, windowWidth / tabs];
    const [animation] = useState(new Animated.Value(activeIndex));
    const _setIndex = (index) => {
        Animated.timing(animation, {
            toValue: Left[index],
            duration: 200,
            useNativeDriver: true,
        }).start();
    };
    const animationStyle = {
        width: windowWidth / tabs,
        bottom: 0,
        height: 2,
        backgroundColor: '#5EC4AC',
        position: 'absolute',
        transform: [
            {
                translateX: animation,
            },
        ],
    };

    useEffect(() => {
        let listener = EventRegister.addEventListener(EVENT_NAME.gotoPendingClaimantReq2, () => {
            _setIndex(1);
        });
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);

    return (
        <Flex
            {...styles.container}
            onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setWidth(width);
            }}
            {...other}
        >
            {items.map((item, index) => {
                return (
                    <TouchableOpacity
                        onPress={() => {
                            if (index === activeIndex) {
                                return;
                            }
                            _setIndex(index);
                            onTabChange(index);
                        }}
                        key={index}
                        style={style}
                    >
                        <Flex {...styles.tab}>
                            <Box>
                                {item.renderLabel ? (
                                    item.renderLabel({
                                        active: activeIndex === index,
                                        item,
                                    })
                                ) : (
                                    <Text
                                        fontWeight="bold"
                                        color={activeIndex === index ? 'primary.500' : 'black'}
                                    >
                                        {item.label}
                                    </Text>
                                )}
                            </Box>
                        </Flex>
                    </TouchableOpacity>
                );
            })}
            <Animated.View style={animationStyle} />
        </Flex>
    );
}

const styles = {
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        w: 'full',
        h: '51px',
        borderBottomColor: '#E9ECED',
        borderBottomWidth: 1,
        backgroundColor: 'white',
    },
    tab: {
        h: 'full',
        alignItems: 'center',
        justifyContent: 'center',
        w: '100%',
    },
};
