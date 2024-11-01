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
                d="M5.00001 3.33341C6.39167 2.29175 8.125 1.66675 10 1.66675C14.6 1.66675 18.3333 5.40008 18.3333 10.0001C18.3333 14.6001 14.6 18.3334 10 18.3334C5.40001 18.3334 1.66667 14.6001 1.66667 10.0001C1.66667 8.49175 2.06666 7.07507 2.77499 5.85007L10 10.0001"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
