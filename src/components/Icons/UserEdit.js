import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function UserEdit({ color = '#8E8E8E', width = '16', height = '16' }) {
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
                d="M7.99935 7.9987C9.8403 7.9987 11.3327 6.50631 11.3327 4.66536C11.3327 2.82442 9.8403 1.33203 7.99935 1.33203C6.1584 1.33203 4.66602 2.82442 4.66602 4.66536C4.66602 6.50631 6.1584 7.9987 7.99935 7.9987Z"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M12.8061 10.4914L10.446 12.8514C10.3527 12.9448 10.266 13.1181 10.246 13.2447L10.1194 14.1447C10.0727 14.4714 10.2994 14.6981 10.626 14.6514L11.526 14.5247C11.6527 14.5047 11.8327 14.4181 11.9194 14.3247L14.2794 11.9647C14.686 11.5581 14.8794 11.0847 14.2794 10.4847C13.686 9.89139 13.2127 10.0847 12.8061 10.4914Z"
                stroke={currentColor}
                stroke-miterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M12.4668 10.832C12.6668 11.552 13.2268 12.112 13.9468 12.312"
                stroke={currentColor}
                stroke-miterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M2.27344 14.6667C2.27344 12.0867 4.84012 10 8.00012 10C8.69346 10 9.3601 10.1 9.9801 10.2867"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
