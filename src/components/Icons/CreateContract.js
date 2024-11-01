/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Index({ color, ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors?.darkText;
    return (
        <Svg width="30" height="30" viewBox="0 0 30 30" fill="none" {...other}>
            <Path
                d="M25.625 14.125V8.80001C25.625 3.76251 24.45 2.5 19.725 2.5H10.275C5.55 2.5 4.375 3.76251 4.375 8.80001V22.875C4.375 26.2 6.20001 26.9875 8.41251 24.6125L8.42499 24.6C9.44999 23.5125 11.0125 23.6 11.9 24.7875L13.1625 26.475"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M10 8.75H20"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M11.25 13.75H18.75"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M22.7638 18.4628L18.3388 22.8879C18.1638 23.0629 18.0013 23.3879 17.9638 23.6254L17.7263 25.3129C17.6388 25.9254 18.0638 26.3504 18.6763 26.2629L20.3638 26.0254C20.6013 25.9879 20.9388 25.8253 21.1013 25.6503L25.5263 21.2254C26.2888 20.4629 26.6513 19.5754 25.5263 18.4504C24.4138 17.3379 23.5263 17.7003 22.7638 18.4628Z"
                stroke={currentColor}
                strokeWidth="1.5"
                stroke-miterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M22.124 19.1003C22.499 20.4503 23.549 21.5003 24.899 21.8753"
                stroke={currentColor}
                strokeWidth="1.5"
                stroke-miterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
