import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function Lock({ color = '#61C7DF', width = '48', height = '48' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M12 20v-4c0-6.62 2-12 12-12s12 5.38 12 12v4M34 44H14C6 44 4 42 4 34v-4c0-8 2-10 10-10h20c8 0 10 2 10 10v4c0 8-2 10-10 10ZM31.993 32h.018M23.991 32h.018M15.989 32h.018"
            />
        </Svg>
    );
}
