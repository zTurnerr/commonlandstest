import { useTheme } from 'native-base';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const TwoImage = ({ color = '#5EC4AC', width = '16', height = '16', ...other }) => {
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
                d="M4.827 2.133c-.736 0-1.333.597-1.333 1.333v6.667c0 .736.597 1.333 1.333 1.333h8.907c.736 0 1.333-.597 1.333-1.333V3.466c0-.736-.597-1.333-1.333-1.333H4.827Zm2.506 2.533a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm6 5.333H5.179a.333.333 0 0 1-.228-.576l1.667-1.56a.333.333 0 0 1 .436-.017l1.197.959c.137.11.336.094.454-.036l1.983-2.166a.333.333 0 0 1 .494.002l2.4 2.658c.055.062.086.141.086.224v.18c0 .183-.15.332-.333.332Z"
                clipRule="evenodd"
            />
            <Path
                fill={currentColor}
                d="M2.267 6A.667.667 0 0 0 .934 6v7.2c0 .368.298.666.666.666h8.534a.667.667 0 1 0 0-1.333H2.267V5.999Z"
            />
        </Svg>
    );
};
export default TwoImage;
