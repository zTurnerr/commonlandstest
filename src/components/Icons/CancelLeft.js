import { useTheme } from 'native-base';
import React from 'react';
import { G, Path, Svg } from 'react-native-svg';

/**
 * Icon Withdrawal from Plot in Sheet Actions
 *
 * Function to render a cancel icon with specified color, size, width, and height.
 *
 * @param {object} props - Object containing color, size, width, height, and other properties
 * @return {JSX.Element} A cancel icon SVG component
 */
export default function CancelLeft({ color, width = '24', height = '24', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...other}
        >
            <G opacity="0.9">
                <Path
                    d="M15.375 15.375L8.625 8.625M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke={currentColor}
                    strokeLinecap="round"
                />
            </G>
        </Svg>
    );
}
