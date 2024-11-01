/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  THDLong / thdailong@gmail.com
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'native-base';
export default function Index({ color, width = '48', height = '48', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 48 48" fill="none" {...other}>
            <Path
                d="M25.9402 35.22L21.7202 31"
                stroke={currentColor}
                strokeWidth="3"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M25.9002 31.0391L21.6602 35.2791"
                stroke={currentColor}
                strokeWidth="3"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <Path
                d="M11.0796 22.2402C1.71957 22.9002 1.71957 36.5202 11.0796 37.1802H14.9196"
                stroke={currentColor}
                strokeWidth="3"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M11.1801 22.2403C4.76006 4.38028 31.8401 -2.75971 34.9401 16.0003C43.6001 17.1003 47.1001 28.6403 40.5401 34.3803C38.5401 36.2003 35.9601 37.2003 33.2601 37.1803H33.0801"
                stroke={currentColor}
                strokeWidth="3"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M34 33.0596C34 34.5396 33.68 35.9396 33.08 37.1796C32.92 37.5396 32.74 37.8796 32.54 38.1996C30.82 41.0996 27.64 43.0596 24 43.0596C20.36 43.0596 17.18 41.0996 15.46 38.1996C15.26 37.8796 15.08 37.5396 14.92 37.1796C14.32 35.9396 14 34.5396 14 33.0596C14 27.5396 18.48 23.0596 24 23.0596C29.52 23.0596 34 27.5396 34 33.0596Z"
                stroke={currentColor}
                strokeWidth="3"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
