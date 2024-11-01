import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'native-base';

export default function CameraBottomLeftSvg({ color = '#5EC4AC', width = '54', height = '53' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 54 53"
            fill="none"
        >
            <Path
                d="M53 52L17 52C8.16344 52 1 44.8366 1 36L1 1"
                stroke={currentColor}
                stroke-width="2"
                stroke-linecap="round"
            />
        </Svg>
    );
}
