/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  THDLong / thdailong@gmail.com
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'native-base';
export default function Index({ color, width = '34', height = '34', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 34 34" fill="none" {...other}>
            <Path
                d="M2.83301 14.138V12.7497C2.83301 5.66634 5.66634 2.83301 12.7497 2.83301H21.2497C28.333 2.83301 31.1663 5.66634 31.1663 12.7497V21.2497C31.1663 28.333 28.333 31.1663 21.2497 31.1663H19.833"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M18.417 15.5833L25.5145 8.47168H19.8337"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M25.5146 8.47168V14.1525"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15.583 22.8795V26.7045C15.583 29.892 14.308 31.167 11.1205 31.167H7.29551C4.10801 31.167 2.83301 29.892 2.83301 26.7045V22.8795C2.83301 19.692 4.10801 18.417 7.29551 18.417H11.1205C14.308 18.417 15.583 19.692 15.583 22.8795Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
