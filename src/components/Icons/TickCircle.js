/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'native-base';
export default function Index({ color, size = '20', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...other}>
            <Path
                d="M9.99996 1.66675C5.40829 1.66675 1.66663 5.40841 1.66663 10.0001C1.66663 14.5917 5.40829 18.3334 9.99996 18.3334C14.5916 18.3334 18.3333 14.5917 18.3333 10.0001C18.3333 5.40841 14.5916 1.66675 9.99996 1.66675ZM13.9833 8.08342L9.25829 12.8084C9.14163 12.9251 8.98329 12.9917 8.81663 12.9917C8.64996 12.9917 8.49163 12.9251 8.37496 12.8084L6.01663 10.4501C5.77496 10.2084 5.77496 9.80841 6.01663 9.56675C6.25829 9.32508 6.65829 9.32508 6.89996 9.56675L8.81663 11.4834L13.1 7.20008C13.3416 6.95842 13.7416 6.95842 13.9833 7.20008C14.225 7.44175 14.225 7.83342 13.9833 8.08342Z"
                fill={currentColor}
            />
        </Svg>
    );
}
