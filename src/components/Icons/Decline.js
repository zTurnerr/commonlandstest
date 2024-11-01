import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

/**
 * icon Decline ownership in modal announce accept or decline ownership
 *
 * @param {object} props - Object containing color, size, width, height, and other props
 * @return {JSX.Element} SVG element
 */
export default function Decline({ color, width = '40', height = '40', ...other }) {
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
                d="M17.2296 6.70516H7.77987C5.69231 6.70516 4 8.39747 4 10.485V33.1643C4 35.2519 5.69231 36.9442 7.77987 36.9442H30.4591C32.5467 36.9442 34.239 35.2519 34.239 33.1643V21.8247M4.94497 21.9347C12.5047 21.9347 22.8994 22.8797 23.8443 16.2649M23.8443 16.2649H18.1745M23.8443 16.2649V23.0586M23.7154 3.05859V7.13688M36 15.3432H31.9217M32.2201 6.83847L29.5141 9.54007"
                stroke={currentColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
