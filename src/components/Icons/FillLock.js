import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function FillLock({ color = 'black', width = '16', height = '16' }) {
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
                d="M8.0002 1.6001C6.00591 1.6001 4.4002 3.2313 4.4002 5.25724V5.86676C3.7402 5.86676 3.2002 6.41534 3.2002 7.08581V13.1811C3.2002 13.8515 3.7402 14.4001 4.4002 14.4001H11.6002C12.2602 14.4001 12.8002 13.8515 12.8002 13.1811V7.08581C12.8002 6.41534 12.2602 5.86676 11.6002 5.86676V5.25724C11.6002 3.2313 9.99448 1.6001 8.0002 1.6001ZM8.0002 2.81915C9.36591 2.81915 10.4002 3.86985 10.4002 5.25724V5.86676H5.6002V5.25724C5.6002 3.86985 6.63448 2.81915 8.0002 2.81915ZM8.0002 8.91438C8.6602 8.91438 9.2002 9.46296 9.2002 10.1334C9.2002 10.8039 8.6602 11.3525 8.0002 11.3525C7.3402 11.3525 6.8002 10.8039 6.8002 10.1334C6.8002 9.46296 7.3402 8.91438 8.0002 8.91438Z"
                fill={currentColor}
            />
        </Svg>
    );
}
