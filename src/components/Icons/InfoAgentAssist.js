import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function InfoAgentAssist({ color, width = '24', height = '24', ...other }) {
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
                d="M11.9992 15V12M11.9992 9V9.0752M19.9985 12C19.9985 13.15 19.7558 14.2434 19.319 15.2316L20 19.9992L15.9146 18.9778C14.7573 19.6287 13.4216 20 11.9992 20C7.58138 20 4 16.4183 4 12C4 7.58172 7.58138 4 11.9992 4C16.4171 4 19.9985 7.58172 19.9985 12Z"
                stroke={currentColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
