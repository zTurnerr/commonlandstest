import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'native-base';
/**
 * icon Withdraw Ownership that use in Transfer Ownership screen
 *
 * @param {object} props - Object containing color, size, width, height, strokeWidth, and other props
 * @return {JSX.Element} Rendered SVG icon
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
                d="M20 15V23.3333"
                stroke={currentColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M19.9997 35.6828H9.89973C4.11639 35.6828 1.69973 31.5495 4.49973 26.4995L9.69973 17.1328L14.5997 8.33281C17.5664 2.98281 22.4331 2.98281 25.3997 8.33281L30.2997 17.1495L35.4997 26.5161C38.2997 31.5661 35.8664 35.6995 30.0997 35.6995H19.9997V35.6828Z"
                stroke={currentColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M19.9912 28.3359H20.0062"
                stroke={currentColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
