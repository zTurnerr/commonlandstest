import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'native-base';
/**
 * icon Withdraw Ownership that use in Transfer Ownership screen
 *
 * @param {object} props - Object containing color, size, width, height, strokeWidth, and other props
 * @return {JSX.Element} Rendered SVG icon
 */
export default function SignalIcon({ color, width = 26, height = 22, ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 26 22"
            fill="none"
            {...other}
        >
            <Path
                d="M12.934 10.745H13m-2.725-4.922a5.624 5.624 0 00-2.9 4.922 5.624 5.624 0 002.9 4.922m5.45-9.844c1.73.96 2.9 2.804 2.9 4.922a5.624 5.624 0 01-2.9 4.922m-8.35 4.823a11.246 11.246 0 01-5.625-9.745c0-4.164 2.262-7.8 5.625-9.745m11.25 19.49a11.246 11.246 0 005.625-9.745c0-4.164-2.262-7.8-5.625-9.745"
                stroke={currentColor}
                strokeWidth={2}
                strokeLinecap="round"
            />
        </Svg>
    );
}
