import { Path, Svg } from 'react-native-svg';
import React from 'react';
import { useTheme } from 'native-base';

export default function MedalStar({ color = 'white', width = '16', height = '16' }) {
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
                d="M14.1668 12.3225L13.0668 12.5825C12.8202 12.6425 12.6268 12.8292 12.5735 13.0759L12.3402 14.0559C12.2135 14.5892 11.5335 14.7559 11.1802 14.3359L9.18683 12.0425C9.02683 11.8559 9.11349 11.5625 9.35349 11.5025C10.5335 11.2159 11.5935 10.5559 12.3735 9.61585C12.5002 9.46252 12.7268 9.44252 12.8668 9.58252L14.3468 11.0625C14.8535 11.5692 14.6735 12.2025 14.1668 12.3225Z"
                fill={currentColor}
            />
            <Path
                d="M1.80011 12.3225L2.90011 12.5825C3.14678 12.6425 3.34011 12.8292 3.39344 13.0759L3.62678 14.0559C3.75344 14.5892 4.43344 14.7559 4.78678 14.3359L6.78011 12.0425C6.94011 11.8559 6.85344 11.5625 6.61344 11.5025C5.43344 11.2159 4.37344 10.5559 3.59344 9.61585C3.46678 9.46252 3.24011 9.44252 3.10011 9.58252L1.62011 11.0625C1.11344 11.5692 1.29344 12.2025 1.80011 12.3225Z"
                fill={currentColor}
            />
            <Path
                d="M7.99967 1.33984C5.41967 1.33984 3.33301 3.42651 3.33301 6.00651C3.33301 6.97318 3.61967 7.85984 4.11301 8.59984C4.83301 9.66651 5.97301 10.4198 7.29967 10.6132C7.52634 10.6532 7.75967 10.6732 7.99967 10.6732C8.23967 10.6732 8.47301 10.6532 8.69967 10.6132C10.0263 10.4198 11.1663 9.66651 11.8863 8.59984C12.3797 7.85984 12.6663 6.97318 12.6663 6.00651C12.6663 3.42651 10.5797 1.33984 7.99967 1.33984ZM10.0397 5.85984L9.48634 6.41318C9.39301 6.50651 9.33967 6.68651 9.37301 6.81984L9.53301 7.50651C9.65967 8.04651 9.37301 8.25984 8.89301 7.97318L8.22634 7.57984C8.10634 7.50651 7.90634 7.50651 7.78634 7.57984L7.11967 7.97318C6.63967 8.25318 6.35301 8.04651 6.47967 7.50651L6.63967 6.81984C6.66634 6.69318 6.61967 6.50651 6.52634 6.41318L5.95967 5.85984C5.63301 5.53318 5.73967 5.20651 6.19301 5.13318L6.90634 5.01318C7.02634 4.99318 7.16634 4.88651 7.21967 4.77984L7.61301 3.99318C7.82634 3.56651 8.17301 3.56651 8.38634 3.99318L8.77967 4.77984C8.83301 4.88651 8.97301 4.99318 9.09967 5.01318L9.81301 5.13318C10.2597 5.20651 10.3663 5.53318 10.0397 5.85984Z"
                fill={currentColor}
            />
        </Svg>
    );
}
