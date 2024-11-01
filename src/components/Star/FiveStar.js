import { useTheme } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FiveStar = ({ onChooseStar = () => {}, currentStar = 5, size = 30, disabled = false }) => {
    const theme = useTheme();
    const numberFullStar = Math.floor(currentStar);
    const isHalf = currentStar - numberFullStar >= 0.5;

    const getType = (index) => {
        if (index + 1 <= numberFullStar) {
            return 'star';
        }
        if (index + 1 === numberFullStar + 1 && isHalf) {
            return 'star-half-full';
        }
        return 'star';
    };

    return Array.from({ length: 5 }).map((_, index) => (
        <TouchableOpacity
            key={index}
            onPress={() => {
                onChooseStar(index + 1);
            }}
            disabled={disabled}
        >
            <MaterialCommunityIcons
                // name="star-half-full"
                name={getType(index)}
                size={size}
                color={
                    index + 1 <= Math.round(currentStar)
                        ? theme.colors.yellow[700]
                        : theme.colors.gray[2200]
                }
            />
        </TouchableOpacity>
    ));
};

export default FiveStar;
