import { useTheme } from 'native-base';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const MailSent = ({ color = '#5EC4AC', width = '21', height = '22' }) => {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none">
            <Path
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
                d="M1.75 7.938c0-3.063 1.75-4.375 4.375-4.375h8.75c2.625 0 4.375 1.312 4.375 4.374v6.125c0 3.063-1.75 4.376-4.375 4.376h-8.75"
            />
            <Path
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
                d="m14.875 8.375-2.739 2.188c-.901.717-2.38.717-3.281 0l-2.73-2.188M1.75 14.938H7M1.75 11.438h2.625"
            />
        </Svg>
    );
};
export default MailSent;
