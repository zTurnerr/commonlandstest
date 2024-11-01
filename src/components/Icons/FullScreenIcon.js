import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function FullScreenIcon({ color, width = '12', height = '12', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...other}
        >
            <Path
                d="M7.3237 1.19995H10.7996M10.7996 1.19995V4.67582M10.7996 1.19995L6.74439 5.25513M4.67606 10.8H1.2002M1.2002 10.8V7.32409M1.2002 10.8L5.25537 6.74478"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
