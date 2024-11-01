import { useTheme } from 'native-base';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const CalendarFilled = ({ color = '#7F7D83', width = '19', height = '18', ...other }) => {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            fill="none"
            {...other}
        >
            <Path
                fill={currentColor}
                fillRule="evenodd"
                d="M14.402 2.549a.737.737 0 0 0-.723-.75c-.4 0-.723.336-.723.75v1H6.125v-1a.736.736 0 0 0-.723-.75c-.4 0-.723.336-.723.75v1c-1.066 0-1.929.894-1.929 1.997v8.656c0 1.103.863 1.998 1.929 1.998h9.642c1.066 0 1.929-.895 1.929-1.998V5.546c0-1.075-.82-1.952-1.848-1.996V2.548ZM4.92 7.544c0-.414.323-.75.723-.75h8.036c.399 0 .723.336.723.75 0 .413-.324.749-.723.749H5.643a.737.737 0 0 1-.723-.75Z"
                clipRule="evenodd"
            />
        </Svg>
    );
};
export default CalendarFilled;
