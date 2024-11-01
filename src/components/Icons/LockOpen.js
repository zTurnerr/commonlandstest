import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function LockOpen({ color = '#00803A', width = '16', height = '16' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M4.39922 6.0389V5.2425C4.39922 3.22554 6.00493 1.60156 7.99922 1.60156C9.0633 1.60156 10.0168 2.06389 10.6747 2.80156M7.99922 10.4586V8.85859M12.7992 9.62294C12.7992 12.2622 10.6502 14.4017 7.99922 14.4017C5.34825 14.4017 3.19922 12.2622 3.19922 9.62294C3.19922 6.98373 5.34825 4.84422 7.99922 4.84422C10.6502 4.84422 12.7992 6.98373 12.7992 9.62294Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </Svg>
    );
}
