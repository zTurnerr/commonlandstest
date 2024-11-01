/**
 * Copyright (c) 2023 - Fuixlabs Vietnam Limited
 *
 * @author  THDLong / thdailong@gmail.com
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'native-base';
export default function Index({ color, width = '26', height = '22', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 26 22" fill="none" {...other}>
            <Path
                d="M19.75 11.2193L25 13.9103L13 20.0612L1 13.9103L6.34595 11.1701M13 1.94141L25 8.09234L13 14.2433L1 8.09234L13 1.94141Z"
                stroke={currentColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
