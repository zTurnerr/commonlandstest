import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function ClockCheck({ color, width = '19', height = '18' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 19 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M11.6563 10.6875L9.125 9.84375V6.31565M15.875 9C15.875 5.27208 12.8529 2.25 9.125 2.25C5.39708 2.25 2.375 5.27208 2.375 9C2.375 12.7279 5.39708 15.75 9.125 15.75C9.55759 15.75 9.98067 15.7093 10.3906 15.6315M12.0781 13.6406L13.3438 14.9062L16.7188 11.5312"
                stroke={currentColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
