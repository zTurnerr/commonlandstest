/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Index({ color, width = '20', height = '20', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" {...other}>
            <Path
                d="M10 12.5001C13.1066 12.5001 15.625 10.075 15.625 7.08341C15.625 4.09187 13.1066 1.66675 10 1.66675C6.8934 1.66675 4.375 4.09187 4.375 7.08341C4.375 10.075 6.8934 12.5001 10 12.5001Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M6.26662 11.2667L6.2583 17.4167C6.2583 18.1667 6.7833 18.5334 7.4333 18.225L9.66663 17.1667C9.84996 17.075 10.1583 17.075 10.3416 17.1667L12.5833 18.225C13.225 18.525 13.7583 18.1667 13.7583 17.4167V11.1167"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
