import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function CameraBottomRightSvg({ color = '#5EC4AC', width = '53', height = '54' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 53 54"
            fill="none"
        >
            <Path
                d="M52 1L52 37C52 45.8366 44.8366 53 36 53L1 53"
                stroke={currentColor}
                stroke-width="2"
                stroke-linecap="round"
            />
        </Svg>
    );
}
