import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function NoteRemove({ color = 'white', width = '18', height = '18' }) {
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
                d="M5.25 10.5H9"
                stroke={currentColor}
                strokeWidth="1.5"
                stroke-miterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M5.25 4.46973L2.4375 1.65723"
                stroke={currentColor}
                strokeWidth="1.5"
                stroke-miterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M5.21997 1.6875L2.40747 4.5"
                stroke={currentColor}
                strokeWidth="1.5"
                stroke-miterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M5.25 7.5H11.25"
                stroke={currentColor}
                strokeWidth="1.5"
                stroke-miterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M7.5 1.5H12C14.4975 1.635 15.75 2.5575 15.75 5.9925V12"
                stroke={currentColor}
                strokeWidth="1.5"
                stroke-miterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M2.25 6.75781V11.9853C2.25 14.9928 3 16.5003 6.75 16.5003H9C9.1275 16.5003 11.13 16.5003 11.25 16.5003"
                stroke={currentColor}
                strokeWidth="1.5"
                stroke-miterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15.75 12L11.25 16.5V14.25C11.25 12.75 12 12 13.5 12H15.75Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
