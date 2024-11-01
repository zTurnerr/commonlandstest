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
                d="M2.5 11.25V8.125C2.5 5.0125 5.0125 2.5 8.125 2.5H11.25"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M18.75 2.5H21.875C24.9875 2.5 27.5 5.0125 27.5 8.125V11.25"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M27.5 20V21.875C27.5 24.9875 24.9875 27.5 21.875 27.5H20"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M11.25 27.5H8.125C5.0125 27.5 2.5 24.9875 2.5 21.875V18.75"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M21.25 11.875V18.125C21.25 20.625 20 21.875 17.5 21.875H12.5C10 21.875 8.75 20.625 8.75 18.125V11.875C8.75 9.375 10 8.125 12.5 8.125H17.5C20 8.125 21.25 9.375 21.25 11.875Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M23.75 15H6.25"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
