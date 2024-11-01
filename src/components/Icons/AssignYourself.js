import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'native-base';
/**
 * icon Internal Transfer use in Transfer Ownership screen
 *
 * @param {object} color - the color of the icon
 * @param {number} size - the size of the icon
 * @param {...object} other - additional props for the SVG component
 * @return {JSX.Element} the SVG icon component
 */
export default function Index({ color, width = 24, height = 24, ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            {...other}
        >
            <Path
                d="M11.7144 8.99989C11.7144 10.5113 10.6592 11.5854 9.35753 11.5854C8.05585 11.5854 7.00063 10.5113 7.00063 8.99989C7.00063 7.48848 8.05585 6.58535 9.35753 6.58535C10.6592 6.58535 11.7144 7.48848 11.7144 8.99989Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <Path
                d="M15.5 17.6851C15.5 19.2397 13.6818 20.4999 9.5 20.4999C5.31818 20.4999 3.5 19.2397 3.5 17.6851C3.5 16.1305 6.18629 14.8702 9.5 14.8702C12.8137 14.8702 15.5 16.1305 15.5 17.6851Z"
                stroke={currentColor}
                strokeWidth="1.5"
                stroke-Linejoin="round"
            />
            <Path
                d="M17 4L17.8499 5.83016L19.8532 6.07295L18.3752 7.44684L18.7634 9.42705L17 8.446L15.2366 9.42705L15.6248 7.44684L14.1468 6.07295L16.1501 5.83016L17 4Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
