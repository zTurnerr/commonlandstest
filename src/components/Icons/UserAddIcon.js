/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Index({ color, width = '20', height = '20', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" {...other}>
            <Path
                d="M9.99967 9.99999C12.3009 9.99999 14.1663 8.13451 14.1663 5.83332C14.1663 3.53214 12.3009 1.66666 9.99967 1.66666C7.69849 1.66666 5.83301 3.53214 5.83301 5.83332C5.83301 8.13451 7.69849 9.99999 9.99967 9.99999Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M2.8418 18.3333C2.8418 15.1083 6.05013 12.5 10.0001 12.5C10.8001 12.5 11.5751 12.6083 12.3001 12.8083"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M18.3337 15C18.3337 15.2667 18.3003 15.525 18.2337 15.775C18.1587 16.1083 18.0253 16.4333 17.8503 16.7167C17.2753 17.6833 16.217 18.3333 15.0003 18.3333C14.142 18.3333 13.367 18.0083 12.7837 17.475C12.5337 17.2583 12.317 17 12.1503 16.7167C11.842 16.2167 11.667 15.625 11.667 15C11.667 14.1 12.0253 13.275 12.6087 12.675C13.217 12.05 14.067 11.6667 15.0003 11.6667C15.9837 11.6667 16.8753 12.0917 17.4753 12.775C18.0087 13.3667 18.3337 14.15 18.3337 15Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M16.2421 14.9833H13.7588"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15 13.7667V16.2584"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
