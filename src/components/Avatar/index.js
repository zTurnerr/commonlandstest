import { Avatar, useTheme } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AvatarC = ({ uri, width = 36, height = 36, fullName = '' }) => {
    let { colors } = useTheme();
    let containerW = width + 4,
        containerH = width + 4;

    const styles = StyleSheet.create({
        wrapper: {
            borderRadius: Math.max(containerW / 2, containerH / 2),
            width: containerW,
            height: containerH,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
    return (
        <LinearGradient
            colors={colors.buttonPrimary.bgColor.linearGradient.colors}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 0.0 }}
            style={styles.wrapper}
        >
            <Avatar
                bg="transparent"
                source={{
                    uri,
                }}
                w={`${width}px`}
                h={`${height}px`}
                onErr
            >
                {fullName}
            </Avatar>
        </LinearGradient>
    );
};

export default AvatarC;
