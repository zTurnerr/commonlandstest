import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function FileCheck2({ color = '#61C7DF', width = '18', height = '18' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M7.4249 16.2H3.82489C2.83078 16.2 2.0249 15.3941 2.0249 14.4L2.02497 3.60004C2.02498 2.60593 2.83086 1.80005 3.82497 1.80005H11.9252C12.9193 1.80005 13.7252 2.60594 13.7252 3.60005V8.55005M10.1252 13.65L11.7752 15.3L15.9752 10.8"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
