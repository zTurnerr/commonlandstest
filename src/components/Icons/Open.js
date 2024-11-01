/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Index({ color, width = '34', height = '34', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 34 34" fill="none" {...other}>
            <Path
                d="M2.83337 14.1383V12.7499C2.83337 5.66659 5.66671 2.83325 12.75 2.83325H21.25C28.3334 2.83325 31.1667 5.66659 31.1667 12.7499V21.2499C31.1667 28.3333 28.3334 31.1666 21.25 31.1666H19.8334"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M18.4166 15.5833L25.5141 8.47168H19.8333"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M25.5142 8.47168V14.1525"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15.5834 22.8792V26.7042C15.5834 29.8917 14.3084 31.1667 11.1209 31.1667H7.29587C4.10837 31.1667 2.83337 29.8917 2.83337 26.7042V22.8792C2.83337 19.6917 4.10837 18.4167 7.29587 18.4167H11.1209C14.3084 18.4167 15.5834 19.6917 15.5834 22.8792Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
