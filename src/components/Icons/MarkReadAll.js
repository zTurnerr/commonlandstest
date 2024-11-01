import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Index({ color, width = '24', height = '24', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...other}>
            <Path
                d="M22 7.42999V13.43C22 14.93 21.5 16.18 20.62 17.06C19.75 17.93 18.5 18.43 17 18.43V20.56C17 21.36 16.11 21.84 15.45 21.4L11 18.43H8.88C8.96 18.13 9 17.82 9 17.5C9 16.48 8.61 15.54 7.97 14.83C7.25 14.01 6.18 13.5 5 13.5C3.88 13.5 2.86 13.96 2.13 14.71C2.04 14.31 2 13.88 2 13.43V7.42999C2 4.42999 4 2.42999 7 2.42999H17C20 2.42999 22 4.42999 22 7.42999Z"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M9 17.5C9 18.25 8.79001 18.96 8.42001 19.56C8.21001 19.92 7.94 20.24 7.63 20.5C6.93 21.13 6.01 21.5 5 21.5C3.54 21.5 2.26999 20.72 1.57999 19.56C1.20999 18.96 1 18.25 1 17.5C1 16.24 1.58 15.11 2.5 14.38C3.19 13.83 4.06 13.5 5 13.5C7.21 13.5 9 15.29 9 17.5Z"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M3.43945 17.5L4.42944 18.49L6.55945 16.52"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M8.5 10.5H15.5"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </Svg>
    );
}
