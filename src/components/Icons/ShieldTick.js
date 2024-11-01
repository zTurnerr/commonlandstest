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
                d="M8.7418 1.8583L4.58346 3.42497C3.62513 3.7833 2.8418 4.91663 2.8418 5.9333V12.125C2.8418 13.1083 3.4918 14.4 4.28346 14.9916L7.8668 17.6666C9.0418 18.55 10.9751 18.55 12.1501 17.6666L15.7335 14.9916C16.5251 14.4 17.1751 13.1083 17.1751 12.125V5.9333C17.1751 4.9083 16.3918 3.77497 15.4335 3.41663L11.2751 1.8583C10.5668 1.59997 9.43346 1.59997 8.7418 1.8583Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M7.5415 9.89157L8.88317 11.2332L12.4665 7.6499"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
