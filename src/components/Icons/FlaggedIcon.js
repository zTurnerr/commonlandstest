import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Index({ color, ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width="22" height="22" viewBox="0 0 22 22" fill="none" {...other}>
            <Path
                fill={currentColor}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.94417 2.65629C3.94417 2.16729 4.34058 1.77087 4.82959 1.77087H18.5938C18.9035 1.77087 19.1907 1.9327 19.3511 2.1976C19.5116 2.46251 19.5219 2.79199 19.3785 3.06646L17.4196 6.8139L19.3785 10.5613C19.5219 10.8358 19.5116 11.1653 19.3511 11.4302C19.1907 11.6951 18.9035 11.8569 18.5938 11.8569H5.715V17.7084H7.00288C7.49188 17.7084 7.8883 18.1048 7.8883 18.5938C7.8883 19.0828 7.49188 19.4792 7.00288 19.4792H2.65629C2.16729 19.4792 1.77087 19.0828 1.77087 18.5938C1.77087 18.1048 2.16729 17.7084 2.65629 17.7084H3.94417V2.65629Z"
            />
        </Svg>
    );
}
