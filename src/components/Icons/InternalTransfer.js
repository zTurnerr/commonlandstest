import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';
/**
 * icon Internal Transfer use in Transfer Ownership screen
 *
 * @param {object} color - the color of the icon
 * @param {number} size - the size of the icon
 * @param {...object} other - additional props for the SVG component
 * @return {JSX.Element} the SVG icon component
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
                d="M4.00073 36L4.00141 29.9993C4.00178 26.6859 6.68796 24 10.0014 24H20.0007M29.2848 30.5L24.9991 26.5M24.9991 26.5L29.2848 22.5M24.9991 26.5H35.9991M29.0007 4C31.4278 5.36046 33.0007 7.54146 33.0007 10C33.0007 12.4585 31.4278 14.6395 29.0007 16M24.0007 10C24.0007 13.3137 21.3144 16 18.0007 16C14.687 16 12.0007 13.3137 12.0007 10C12.0007 6.68629 14.687 4 18.0007 4C21.3144 4 24.0007 6.68629 24.0007 10Z"
                stroke={currentColor}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
