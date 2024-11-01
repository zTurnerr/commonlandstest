import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function Send2({ color = '#5EC4AC', width = '24', height = '24' }) {
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
                d="M19.5587 4.44132L10.672 13.328M4.72591 8.86272L18.5642 4.0617C19.4164 3.76604 20.234 4.58364 19.9383 5.43584L15.1373 19.2741C14.8084 20.2221 13.4771 20.2481 13.1115 19.3136L10.9141 13.698C10.8043 13.4176 10.5824 13.1957 10.302 13.0859L4.68636 10.8885C3.75191 10.5229 3.7779 9.19162 4.72591 8.86272Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </Svg>
    );
}
