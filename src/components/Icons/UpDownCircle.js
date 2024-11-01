import { useTheme } from 'native-base';
import React, { memo } from 'react';
import { Path, Rect, Svg } from 'react-native-svg';

export default memo(function UpDownCircle({ color = '#000', width = '20', height = '20' }) {
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
            <Rect width={width} height={height} fill="#fff" rx={10} />
            <Rect
                width={width - 1}
                height={height - 1}
                x={0.5}
                y={0.5}
                stroke={currentColor}
                strokeOpacity={0.1}
                rx={9.5}
            />
            <Path
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.5 12.5 10 15l-2.5-2.5M7.5 8.333l2.5-2.5 2.5 2.5"
            />
        </Svg>
    );
});
