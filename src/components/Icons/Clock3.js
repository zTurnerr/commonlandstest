import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function Clock3({ color, width = '12', height = '12' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM6.5 3.25V5.65505L7.98809 6.93056C8.30259 7.20012 8.33901 7.6736 8.06944 7.98809C7.79988 8.30259 7.3264 8.33901 7.01191 8.06944L5.26191 6.56944C5.09567 6.42696 5 6.21894 5 6V3.25C5 2.83579 5.33579 2.5 5.75 2.5C6.16421 2.5 6.5 2.83579 6.5 3.25Z"
                fill={currentColor}
            />
        </Svg>
    );
}
