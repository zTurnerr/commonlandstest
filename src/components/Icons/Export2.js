import { Path, Svg } from 'react-native-svg';
import React from 'react';
import { useTheme } from 'native-base';

export default function Export2({ color = '#5EC4AC', width = '24', height = '24' }) {
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
                d="M16.4405 8.90002C20.0405 9.21002 21.5105 11.06 21.5105 15.11V15.24C21.5105 19.71 19.7205 21.5 15.2505 21.5H8.74047C4.27047 21.5 2.48047 19.71 2.48047 15.24V15.11C2.48047 11.09 3.93047 9.24002 7.47047 8.91002"
                stroke={currentColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M12 15V3.62"
                stroke={currentColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15.3504 5.85L12.0004 2.5L8.65039 5.85"
                stroke={currentColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
