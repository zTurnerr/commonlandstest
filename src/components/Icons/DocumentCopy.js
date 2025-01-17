import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function DocumentCopy({ color, width = '24', height = '24' }) {
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
                d="M17 13.4V16.4C17 20.4 15.4 22 11.4 22H7.6C3.6 22 2 20.4 2 16.4V12.6C2 8.6 3.6 7 7.6 7H10.6"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M16.9996 13.4H13.7996C11.3996 13.4 10.5996 12.6 10.5996 10.2V7L16.9996 13.4Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M11.5996 2H15.5996"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M7 5C7 3.34 8.34 2 10 2H12.62"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M22.0004 8V14.19C22.0004 15.74 20.7404 17 19.1904 17"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M22 8H19C16.75 8 16 7.25 16 5V2L22 8Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
