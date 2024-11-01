import { Path, Svg } from 'react-native-svg';
import React from 'react';
import { useTheme } from 'native-base';

export default function ClockForward({ color = 'black', width = '24', height = '24' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M14.625 14.25L11.25 13.125V8.42087M20.25 12C20.25 7.02944 16.2206 3 11.25 3C6.27944 3 2.25 7.02944 2.25 12C2.25 16.9706 6.27944 21 11.25 21C14.5813 21 17.4898 19.1901 19.046 16.5M17.7811 11.0123L20.0311 13.2623L22.2811 11.0123"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
