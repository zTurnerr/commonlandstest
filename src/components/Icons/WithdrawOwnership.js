import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

/**
 * icon Withdraw Ownership that use in Transfer Ownership screen
 *
 * @param {object} props - Object containing color, size, width, height, strokeWidth, and other props
 * @return {JSX.Element} Rendered SVG icon
 */
export default function Index({ color, width = 24, height = 24, strokeWidth = 2, ...other }) {
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
                d="M2.25 21.5999L2.2504 17.9995C2.25063 16.0114 3.86234 14.3999 5.8504 14.3999H12.45M21.75 15.5999H16.35M14.25 5.9999C14.25 7.98813 12.6382 9.5999 10.65 9.5999C8.66177 9.5999 7.05 7.98813 7.05 5.9999C7.05 4.01168 8.66177 2.3999 10.65 2.3999C12.6382 2.3999 14.25 4.01168 14.25 5.9999Z"
                stroke={currentColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
