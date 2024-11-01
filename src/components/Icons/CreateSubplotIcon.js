import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Index({ color, width = '40', height = '40', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 40 40" fill="none" {...other}>
            <Path
                d="M17.5003 28.3337H22.5003C26.667 28.3337 28.3337 26.667 28.3337 22.5003V17.5003C28.3337 13.3337 26.667 11.667 22.5003 11.667H17.5003C13.3337 11.667 11.667 13.3337 11.667 17.5003V22.5003C11.667 26.667 13.3337 28.3337 17.5003 28.3337Z"
                stroke={currentColor}
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M20.5 25.417H23.6667C24.9167 25.417 25.4167 24.917 25.4167 23.667V22.167C25.4167 20.917 24.9167 20.417 23.6667 20.417H20.5C19.25 20.417 18.75 20.917 18.75 22.167V23.667C18.75 24.917 19.25 25.417 20.5 25.417Z"
                stroke={currentColor}
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </Svg>
    );
}
