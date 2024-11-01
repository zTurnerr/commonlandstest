/**
 * Copyright (c) 2023 - Fuixlabs Vietnam Limited
 *
 * @author  THDLong / thdailong@gmail.com
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'native-base';
export default function Index({ color, width = '16', height = '16', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 16 16" fill="none" {...other}>
            <Path
                d="M6.94659 8.6663C6.33326 8.3063 5.91992 7.63964 5.91992 6.87297C5.91992 5.7263 6.84659 4.79297 7.99992 4.79297C8.76659 4.79297 9.43325 5.2063 9.79325 5.8263"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M3.99338 11.8728C2.76672 10.1994 1.87338 8.05942 2.42005 5.65942C3.52005 0.81942 9.71338 0.0394205 12.4534 3.31942"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M13.5861 5.66699C14.3528 9.05366 12.2461 11.9203 10.3994 13.6937C9.05944 14.987 6.93944 14.987 5.59277 13.6937"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M14.6663 1.33301L1.33301 14.6663"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </Svg>
    );
}
