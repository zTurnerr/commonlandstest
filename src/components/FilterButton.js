import { useNavigation } from '@react-navigation/core';
import { Box, Flex, Image } from 'native-base';
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import useShallowEqualSelector from '../redux/customHook/useShallowEqualSelector';
import { initFilter } from '../redux/reducer/map';
import { ModalContext } from '../screen/Main';
import Images from '../themes/Images';
import { compareArray } from '../util/Constants';
import useGetDistanceFromHeader from '../hooks/useGetDistanceFromHeader';

const FilterButton = (props) => {
    let { isLogged, filter } = useShallowEqualSelector((state) => ({
        user: state.user,
        isLogged: state.user.isLogged,
        filter: state.map.filter,
    }));
    const navigate = useNavigation();
    const modalContext = useContext(ModalContext);
    const { textSearch } = props || {};

    const onActiveFilter = () => {
        const filterStatus = filter?.status === initFilter?.status;
        const filterClaimchain = compareArray(filter?.showClaimchain, initFilter?.showClaimchain);
        const filterUnconnect = filter?.showUnConnect === initFilter?.showUnConnect;
        if (filterStatus && filterClaimchain && filterUnconnect) {
            return false;
        } else {
            return true;
        }
    };
    const { distance } = useGetDistanceFromHeader();

    return (
        <Flex
            direction="row"
            justifyContent="center"
            alignItems="center"
            position="absolute"
            right="18px"
            zIndex="2"
            top={`${20 + distance}px`}
            {...props}
        >
            <TouchableOpacity
                onPress={() => {
                    if (!isLogged) {
                        return modalContext.onOpenModal();
                    }
                    navigate.navigate('FilterPage', { textSearch });
                }}
            >
                {onActiveFilter() && (
                    <Box
                        backgroundColor={'yellow.500'}
                        w={'10px'}
                        height={'10px'}
                        // borderBottomRadius={'8px'}
                        borderRadius={'16px'}
                        position={'absolute'}
                        top={'-4px'}
                        right={'-6px'}
                    ></Box>
                )}
                <Image source={Images.icFilter} alt="icon" w={'24px'} h={'24px'} />
            </TouchableOpacity>
        </Flex>
    );
};

export default FilterButton;
