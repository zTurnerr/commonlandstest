import { Path, Svg } from 'react-native-svg';
import React from 'react';
import { useTheme } from 'native-base';

export default function HorizontalThreeDot({ color = '#5EC4AC', width = '16', height = '4' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 16 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M3.75 2C3.75 2.9665 2.9665 3.75 2 3.75C1.0335 3.75 0.25 2.9665 0.25 2C0.25 1.0335 1.0335 0.25 2 0.25C2.9665 0.25 3.75 1.0335 3.75 2ZM9.75 2C9.75 2.9665 8.9665 3.75 8 3.75C7.0335 3.75 6.25 2.9665 6.25 2C6.25 1.0335 7.0335 0.25 8 0.25C8.9665 0.25 9.75 1.0335 9.75 2ZM14 3.75C14.9665 3.75 15.75 2.9665 15.75 2C15.75 1.0335 14.9665 0.25 14 0.25C13.0335 0.25 12.25 1.0335 12.25 2C12.25 2.9665 13.0335 3.75 14 3.75Z"
                fill={currentColor}
            />
        </Svg>
    );
}
