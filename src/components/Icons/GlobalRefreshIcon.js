import { Path, Svg } from 'react-native-svg';
import React from 'react';
import { useTheme } from 'native-base';

export default function GlobalRefreshIcon({ color, width = '30', height = '30', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...other}
        >
            <Path
                d="M27.5 15c0-6.9-5.6-12.5-12.5-12.5S2.5 8.1 2.5 15 8.1 27.5 15 27.5"
                stroke={currentColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M10 3.75h1.25a35.53 35.53 0 000 22.5H10M18.75 3.75A35.693 35.693 0 0120.575 15"
                stroke={currentColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M3.75 20v-1.25A35.693 35.693 0 0015 20.575M3.75 11.25a35.53 35.53 0 0122.5 0M24.375 18.373a5.479 5.479 0 00-1.563-.225 4.676 4.676 0 000 9.35c2.575 0 4.675-2.1 4.675-4.675 0-.962-.287-1.862-.787-2.6M25.05 18.498l-1.563-1.787M25.05 18.5l-1.825 1.325"
                stroke={currentColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
