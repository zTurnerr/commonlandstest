import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function CameraTopLeftSvg({ color = '#5EC4AC', width = '52', height = '53' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 52 53"
            fill="none"
        >
            <Path
                d="M1 52V17C1 8.16344 8.16344 1 17 1H51"
                stroke={currentColor}
                stroke-width="2"
                stroke-linecap="round"
            />
        </Svg>
    );
}
