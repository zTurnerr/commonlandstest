import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function ShieldSlash({ color, width = '24', height = '24' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M7.83984 20.0201L9.42984 21.2101C10.8398 22.2701 13.1598 22.2701 14.5698 21.2101L18.8698 18.0001C19.8198 17.2901 20.5998 15.7401 20.5998 14.5601V7.12012"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M18.9802 4.34006C18.8302 4.25006 18.6702 4.17006 18.5102 4.10006L13.5202 2.23006C12.6902 1.92006 11.3302 1.92006 10.5002 2.23006L5.50016 4.11006C4.35016 4.54006 3.41016 5.90006 3.41016 7.12006V14.5501C3.41016 15.7301 4.19016 17.2801 5.14016 17.9901L5.34016 18.1401"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M22 2L2 22"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
