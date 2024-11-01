import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

/**
 * icon Transfer Ownership that use in Transfer Ownership screen
 *
 * @param {string} color - the color of the icon
 * @param {number} size - the size of the icon
 * @param {...any} other - additional props passed to the SVG element
 * @return {JSX.Element} the SVG icon component
 */
export default function Index({ color, width = 40, height = 40, ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...other}
        >
            <Path
                d="M10.3999 29.5999L10.4003 25.9995C10.4005 24.0114 12.0122 22.3999 14.0003 22.3999H19.9999M27.0285 21.4999L29.5999 23.8999M29.5999 23.8999L27.0285 26.2999M29.5999 23.8999H22.9999M22.3999 13.9999C22.3999 15.9881 20.7881 17.5999 18.7999 17.5999C16.8117 17.5999 15.1999 15.9881 15.1999 13.9999C15.1999 12.0117 16.8117 10.3999 18.7999 10.3999C20.7881 10.3999 22.3999 12.0117 22.3999 13.9999Z"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
