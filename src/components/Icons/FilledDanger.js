import { useTheme } from 'native-base';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const FilledDanger = ({ color = '#DA3B01', width = '24', height = '24' }) => {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none">
            <Path
                fill={currentColor}
                d="M21.76 15.92 15.36 4.4C14.5 2.85 13.31 2 12 2s-2.5.85-3.36 2.4l-6.4 11.52c-.81 1.47-.9 2.88-.25 3.99.65 1.11 1.93 1.72 3.61 1.72h12.8c1.68 0 2.96-.61 3.61-1.72.65-1.11.56-2.53-.25-3.99ZM11.25 9c0-.41.34-.75.75-.75s.75.34.75.75v5c0 .41-.34.75-.75.75s-.75-.34-.75-.75V9Zm1.46 8.71-.15.12c-.06.04-.12.07-.18.09-.06.03-.12.05-.19.06-.06.01-.13.02-.19.02s-.13-.01-.2-.02a.636.636 0 0 1-.18-.06.757.757 0 0 1-.18-.09l-.15-.12c-.18-.19-.29-.45-.29-.71 0-.26.11-.52.29-.71l.15-.12c.06-.04.12-.07.18-.09.06-.03.12-.05.18-.06.13-.03.27-.03.39 0 .07.01.13.03.19.06.06.02.12.05.18.09l.15.12c.18.19.29.45.29.71 0 .26-.11.52-.29.71Z"
            />
        </Svg>
    );
};
export default FilledDanger;
