import { Path, Svg } from 'react-native-svg';
import React from 'react';
import { useTheme } from 'native-base';

export default function FilledUnlock({ color = '#5EC4AC', width = '40', height = '40' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M19.9999 28.9166C21.5002 28.9166 22.7165 27.7003 22.7165 26.1999C22.7165 24.6996 21.5002 23.4833 19.9999 23.4833C18.4995 23.4833 17.2832 24.6996 17.2832 26.1999C17.2832 27.7003 18.4995 28.9166 19.9999 28.9166Z"
                fill={currentColor}
            />
            <Path
                d="M27.7497 15.7334H12.2497C12.1163 15.7334 11.9997 15.7334 11.8663 15.7334V13.8C11.8663 8.91671 13.2497 5.66671 19.9997 5.66671C27.2163 5.66671 28.133 9.18337 28.133 12.25C28.133 12.9 28.6497 13.4167 29.2997 13.4167C29.9497 13.4167 30.4663 12.9 30.4663 12.25C30.4663 6.33337 26.9497 3.33337 19.9997 3.33337C10.6163 3.33337 9.53301 9.30004 9.53301 13.8V15.8834C4.86634 16.4667 3.33301 18.8334 3.33301 24.65V27.75C3.33301 34.5834 5.41634 36.6667 12.2497 36.6667H27.7497C34.583 36.6667 36.6663 34.5834 36.6663 27.75V24.65C36.6663 17.8167 34.583 15.7334 27.7497 15.7334ZM19.9997 31.2334C17.2163 31.2334 14.9663 28.9667 14.9663 26.2C14.9663 23.4167 17.233 21.1667 19.9997 21.1667C22.7663 21.1667 25.033 23.4334 25.033 26.2C25.033 28.9834 22.783 31.2334 19.9997 31.2334Z"
                fill={currentColor}
            />
        </Svg>
    );
}