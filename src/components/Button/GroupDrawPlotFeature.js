import { Blend2 } from 'iconsax-react-native';
import { Box, IconButton, useTheme } from 'native-base';
import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalEnableSnap from '../ModalEnableSnap';
import ModalSnapping from '../../screen/CreatePlot/ModalSnappingSystem';
import useGetDistanceFromHeader from '../../hooks/useGetDistanceFromHeader';

const GroupDrawPlotFeature = ({
    isEnableSnap,
    handleClickSnap,
    onToggleSnap,
    onCloseModalSnap,
    isShowButton = true,
    isOpenModalSnap,
}) => {
    const { colors } = useTheme();
    const [isOpenSnapSystem, setisOpenSnapSystem] = useState(false);

    const onOpenLearnMore = () => {
        setisOpenSnapSystem(true);
        onCloseModalSnap();
    };

    const { distance } = useGetDistanceFromHeader();

    return (
        <>
            {isShowButton && (
                <Box position={'absolute'} right={'15px'} top={`${160 + distance}px`}>
                    <Box position={'relative'} my={'10px'}>
                        <IconButton
                            icon={
                                <Blend2
                                    color={isEnableSnap ? colors.primary[600] : 'black'}
                                    size={24}
                                />
                            }
                            _pressed={{ opacity: 0.5 }}
                            size={'40px'}
                            borderRadius={'full'}
                            bgColor={'white'}
                            onPress={handleClickSnap}
                        />
                        {isEnableSnap && (
                            <Box
                                position={'absolute'}
                                top={'0'}
                                right={'0'}
                                bgColor={'primary.600'}
                                w={'12px'}
                                h={'12px'}
                                borderRadius={'full'}
                            ></Box>
                        )}
                    </Box>
                    <IconButton
                        icon={
                            <MaterialCommunityIcons
                                name="vector-square"
                                color={'white'}
                                size={24}
                            />
                        }
                        size="40px"
                        bgColor={'primary.600'}
                        borderRadius="full"
                        color="black"
                    />
                </Box>
            )}
            <ModalEnableSnap
                checked={isEnableSnap}
                handleToggle={onToggleSnap}
                onClose={onCloseModalSnap}
                onOpenLearnMore={onOpenLearnMore}
                isVisible={isOpenModalSnap}
            />
            <ModalSnapping isOpen={isOpenSnapSystem} onClose={() => setisOpenSnapSystem(false)} />
        </>
    );
};

export default GroupDrawPlotFeature;
