import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function AgentAssist({ color, width = '32', height = '32', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...other}
        >
            <Path
                d="M29.3334 6.22659V22.3199C29.3334 23.5999 28.2934 24.7999 27.0134 24.9599L26.5734 25.0133C23.6667 25.4 19.1867 26.8799 16.6267 28.2932C16.28 28.4932 15.7068 28.4932 15.3468 28.2932L15.2934 28.2666C12.7334 26.8666 8.26679 25.4 5.37345 25.0133L4.98674 24.9599C3.70674 24.7999 2.66675 23.5999 2.66675 22.3199V6.21325C2.66675 4.62658 3.96005 3.42659 5.54671 3.55993C8.34671 3.78659 12.5867 5.19996 14.96 6.67996L15.2934 6.87991C15.68 7.11991 16.3201 7.11991 16.7068 6.87991L16.9334 6.73327C17.7734 6.21327 18.8401 5.69326 20.0001 5.22659V10.6666L22.6667 8.89326L25.3334 10.6666V3.70665C25.6934 3.63999 26.0401 3.59994 26.3601 3.57327H26.4401C28.0268 3.43994 29.3334 4.62659 29.3334 6.22659Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M16 7.32007V27.3201"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M25.3333 3.70679V10.6667L22.6667 8.89339L20 10.6667V5.22673C21.7467 4.53339 23.6933 3.97345 25.3333 3.70679Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
