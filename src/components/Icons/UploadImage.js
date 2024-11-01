/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'native-base';
export default function Index({ color, ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...other}>
            <Path
                d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M13 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V10"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M18 8V2L20 4"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M18 2L16 4"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </Svg>
    );
}
