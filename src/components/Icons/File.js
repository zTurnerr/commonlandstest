import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function File({ color, width = '20', height = '20' }) {
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
                d="M10.9725 2.5V6.25C10.9725 6.76777 11.4078 7.1875 11.9448 7.1875H15.8337M11.1394 2.5H6.11144C5.03755 2.5 4.16699 3.33947 4.16699 4.375V15.625C4.16699 16.6605 5.03755 17.5 6.11144 17.5H13.8892C14.9631 17.5 15.8337 16.6605 15.8337 15.625V7.02665C15.8337 6.52937 15.6288 6.05246 15.2641 5.70083L12.5143 3.04917C12.1496 2.69754 11.6551 2.5 11.1394 2.5Z"
                stroke={currentColor}
                strokeWidth="1.5"
            />
        </Svg>
    );
}
