import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

/**
 * icon External Transfer use in Transfer Ownership screen
 *
 * @param {object} color - the color of the icon
 * @param {number} size - the size of the icon
 * @param {number} width - the width of the icon
 * @param {number} height - the height of the icon
 * @param {object} other - additional props for the SVG element
 * @return {JSX.Element} SVG icon element
 */
export default function Index({ color, width = 40, height = 40, ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 40 40"
            fill="none"
            {...other}
        >
            <Path
                d="M4 36L4.00067 29.9993C4.00105 26.6859 6.68723 24 10.0007 24H20M31.7143 22.5L36 26.5M36 26.5L31.7143 30.5M36 26.5H25M29 4C31.4271 5.36046 33 7.54146 33 10C33 12.4585 31.4271 14.6395 29 16M24 10C24 13.3137 21.3137 16 18 16C14.6863 16 12 13.3137 12 10C12 6.68629 14.6863 4 18 4C21.3137 4 24 6.68629 24 10Z"
                stroke={currentColor}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
