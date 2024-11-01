/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';
export default function Index({ color, width = '30', height = '30', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors?.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 30 30" fill="none" {...other}>
            <Path
                d="M25 8.6875V21.3125C24.8 21.275 24.5875 21.25 24.375 21.25C22.65 21.25 21.25 22.65 21.25 24.375C21.25 24.5875 21.275 24.8 21.3125 25H8.6875C8.725 24.8 8.75 24.5875 8.75 24.375C8.75 22.65 7.35 21.25 5.625 21.25C5.4125 21.25 5.2 21.275 5 21.3125V8.6875C5.2 8.725 5.4125 8.75 5.625 8.75C7.35 8.75 8.75 7.35 8.75 5.625C8.75 5.4125 8.725 5.2 8.6875 5H21.3125C21.275 5.2 21.25 5.4125 21.25 5.625C21.25 7.35 22.65 8.75 24.375 8.75C24.5875 8.75 24.8 8.725 25 8.6875Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M8.75 5.625C8.75 7.35 7.35 8.75 5.625 8.75C5.4125 8.75 5.2 8.725 5 8.6875C3.575 8.4 2.5 7.1375 2.5 5.625C2.5 3.9 3.9 2.5 5.625 2.5C7.1375 2.5 8.4 3.575 8.6875 5C8.725 5.2 8.75 5.4125 8.75 5.625Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M27.5 5.625C27.5 7.1375 26.425 8.4 25 8.6875C24.8 8.725 24.5875 8.75 24.375 8.75C22.65 8.75 21.25 7.35 21.25 5.625C21.25 5.4125 21.275 5.2 21.3125 5C21.6 3.575 22.8625 2.5 24.375 2.5C26.1 2.5 27.5 3.9 27.5 5.625Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M8.75 24.375C8.75 24.5875 8.725 24.8 8.6875 25C8.4 26.425 7.1375 27.5 5.625 27.5C3.9 27.5 2.5 26.1 2.5 24.375C2.5 22.8625 3.575 21.6 5 21.3125C5.2 21.275 5.4125 21.25 5.625 21.25C7.35 21.25 8.75 22.65 8.75 24.375Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M27.5 24.375C27.5 26.1 26.1 27.5 24.375 27.5C22.8625 27.5 21.6 26.425 21.3125 25C21.275 24.8 21.25 24.5875 21.25 24.375C21.25 22.65 22.65 21.25 24.375 21.25C24.5875 21.25 24.8 21.275 25 21.3125C26.425 21.6 27.5 22.8625 27.5 24.375Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
