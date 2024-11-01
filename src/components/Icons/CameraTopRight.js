import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function CameraTopRightSvg({ color = '#5EC4AC', width = '54', height = '53' }) {
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
                d="M1 1L37 1C45.8366 1 53 8.16344 53 17L53 52"
                stroke={currentColor}
                stroke-width="2"
                stroke-linecap="round"
            />
        </Svg>
    );
}
