/**
 * Copyright (c) 2023 - Fuixlabs Vietnam Limited
 *
 * @author  THDLong / thdailong@gmail.com
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'native-base';
export default function Index({ color, width = '24', height = '24', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...other}>
            <Path
                d="M10.51 11.22L8.31 2.39C8.26 2.16 8.05 2 7.81 2C4.6 2 2 4.6 2 7.81V13.51C2 13.85 2.33 14.1 2.66 14L10.16 11.83C10.42 11.76 10.58 11.49 10.51 11.22Z"
                fill={currentColor}
            />
            <Path
                d="M11.12 13.6799C11.05 13.3999 10.76 13.2299 10.48 13.3099L2.37 15.6699C2.15 15.7399 2 15.9399 2 16.1699V16.1899C2 19.3999 4.6 21.9999 7.81 21.9999H12.53C12.86 21.9999 13.11 21.6899 13.03 21.3599L11.12 13.6799Z"
                fill={currentColor}
            />
            <Path
                d="M16.1908 2H10.4408C10.1108 2 9.86081 2.31 9.94081 2.64L14.6808 21.61C14.7408 21.84 14.9408 22 15.1808 22H16.1808C19.4008 22 22.0008 19.4 22.0008 16.19V7.81C22.0008 4.6 19.4008 2 16.1908 2Z"
                fill={currentColor}
            />
        </Svg>
    );
}
