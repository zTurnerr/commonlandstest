import { Path, Svg } from 'react-native-svg';
import React from 'react';
import { useTheme } from 'native-base';

export default function AlertCircleFilled({ color = '#5EC4AC', width = '20', height = '20' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM9 10C9 10.5523 9.44772 11 10 11C10.5523 11 11 10.5523 11 10V6C11 5.44772 10.5523 5 10 5C9.44772 5 9 5.44772 9 6V10ZM9 13.5C9 14.0523 9.44772 14.5 10 14.5C10.5523 14.5 11 14.0523 11 13.5C11 12.9477 10.5523 12.5 10 12.5C9.44772 12.5 9 12.9477 9 13.5Z"
                fill={currentColor}
            />
        </Svg>
    );
}
