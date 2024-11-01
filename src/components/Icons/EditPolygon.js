import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function Index({ color, width = '24', height = '24', strokeWidth = 1, ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...other}
        >
            <Path
                d="M10.7498 22.5H13.2698C14.2298 22.5 14.8498 21.82 14.6698 20.99L14.2598 19.1801H9.75984L9.34984 20.99C9.16984 21.77 9.84984 22.5 10.7498 22.5Z"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
            />
            <Path
                d="M14.2601 19.1701L15.9901 17.63C16.9601 16.77 17.0001 16.17 16.2301 15.2L13.1801 11.33C12.5401 10.52 11.4901 10.52 10.8501 11.33L7.80006 15.2C7.03006 16.17 7.03005 16.8 8.04005 17.63L9.77005 19.1701"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
            />
            <Path
                d="M12.0103 11.12V13.65"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
            />
            <Path
                d="M11.1501 5.19002L10.3701 4.41C9.90008 3.94 9.90008 3.18004 10.3701 2.71004L11.1501 1.93001C11.6201 1.46001 12.3801 1.46001 12.8501 1.93001L13.6301 2.71004C14.1001 3.18004 14.1001 3.94 13.6301 4.41L12.8501 5.19002C12.3801 5.66002 11.6201 5.66002 11.1501 5.19002Z"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
            />
            <Path
                d="M19.45 9.81H20.55C21.21 9.81 21.75 10.35 21.75 11.01V12.11C21.75 12.77 21.21 13.3101 20.55 13.3101H19.45C18.79 13.3101 18.25 12.77 18.25 12.11V11.01C18.25 10.35 18.79 9.81 19.45 9.81Z"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
            />
            <Path
                d="M4.55 9.81H3.45C2.79 9.81 2.25 10.35 2.25 11.01V12.11C2.25 12.77 2.79 13.3101 3.45 13.3101H4.55C5.21 13.3101 5.75 12.77 5.75 12.11V11.01C5.75 10.35 5.21 9.81 4.55 9.81Z"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
            />
            <Path
                d="M18.5402 10.1L13.2402 4.79999"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
            />
            <Path
                d="M5.45996 10.1L10.76 4.79999"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
            />
        </Svg>
    );
}
