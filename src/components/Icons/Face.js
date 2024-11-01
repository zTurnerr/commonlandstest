import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg, Rect } from 'react-native-svg';

export default function Mask({ color = 'white', width = '26', height = '26' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Rect width="24" height="24" transform="translate(1 1)" fill="white" />
            <Path
                d="M1 11.0309V5C1 2.79086 2.79086 1 5 1H11.1221"
                stroke={currentColor}
                stroke-linecap="round"
            />
            <Path
                d="M1 14.9691V21C1 23.2091 2.79086 25 5 25H11.1221"
                stroke={currentColor}
                stroke-linecap="round"
            />
            <Path
                d="M25 11.0309V5C25 2.79086 23.2091 1 21 1H14.8779"
                stroke={currentColor}
                stroke-linecap="round"
            />
            <Path
                d="M25 14.9691V21C25 23.2091 23.2091 25 21 25H14.8779"
                stroke={currentColor}
                stroke-linecap="round"
            />
            <Path
                d="M17.6724 18.1666V18.1666C14.948 19.3371 11.8624 19.3371 9.13794 18.1666V18.1666"
                stroke={currentColor}
                stroke-linecap="round"
            />
            <Path
                d="M13.9691 9V12.8764C13.9691 13.9441 13.2183 14.8645 12.1724 15.079V15.079"
                stroke={currentColor}
                stroke-linecap="round"
            />
            <Path d="M8 9L8 11.1711" stroke={currentColor} stroke-linecap="round" />
            <Path d="M19 9L19 11.1711" stroke={currentColor} stroke-linecap="round" />
        </Svg>
    );
}
