import { Path, Svg } from 'react-native-svg';
import React from 'react';
import { useTheme } from 'native-base';

export default function FileLock02({
    color = '#5EC4AC',
    size,
    width = '24',
    height = '24',
    ...other
}) {
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
                d="M9.59961 21.5984H7.19961C5.21138 21.5984 3.59961 19.9867 3.59961 17.9984V5.99844C3.59961 4.01021 5.21138 2.39844 7.19961 2.39844H15.5996C17.5878 2.39844 19.1996 4.01021 19.1996 5.99844V8.99844M14.9996 14.9984V13.7984C14.9996 12.8043 15.8055 11.9984 16.7996 11.9984C17.7937 11.9984 18.5996 12.8043 18.5996 13.7984V15.5984M14.9996 7.19844H7.19961M11.3996 10.7984H7.19961M9.59961 14.3984H7.19961M14.3996 21.5984H19.1996C19.8624 21.5984 20.3996 21.0612 20.3996 20.3984V16.7984C20.3996 16.1357 19.8624 15.5984 19.1996 15.5984H14.3996C13.7369 15.5984 13.1996 16.1357 13.1996 16.7984V20.3984C13.1996 21.0612 13.7369 21.5984 14.3996 21.5984Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
