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
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...other}>
            <Path
                d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M7.08337 4.14175L7.26671 3.05008C7.40004 2.25841 7.50004 1.66675 8.90837 1.66675H11.0917C12.5 1.66675 12.6084 2.29175 12.7334 3.05841L12.9167 4.14175"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15.7083 7.6167L15.1666 16.0084C15.075 17.3167 15 18.3334 12.675 18.3334H7.32496C4.99996 18.3334 4.92496 17.3167 4.83329 16.0084L4.29163 7.6167"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M8.60828 13.75H11.3833"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M7.91663 10.4167H12.0833"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
