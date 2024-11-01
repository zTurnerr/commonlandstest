import React, { useState } from 'react';
import { Actionsheet, Box, Text, HStack, CloseIcon, CheckIcon } from 'native-base';
import useTranslate from '../../../i18n/useTranslate';
import { TouchableOpacity } from 'react-native';

export const SORT_KEY = {
    mostRecent: 'mostRecent',
    oldest: 'oldest',
    lowRated: 'lowRated',
    topRated: 'topRated',
};

export const useSortContractSheet = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState(SORT_KEY.mostRecent);

    const Component = () => {
        return (
            <SortContractSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                setSelectedSort={setSelectedSort}
                selectedSort={selectedSort}
            />
        );
    };

    const close = () => {
        setIsOpen(false);
    };

    const open = () => {
        setIsOpen(true);
    };

    return {
        Component,
        close,
        open,
        selectedSort,
    };
};

const SortContractSheet = ({ isOpen, onClose, setSelectedSort, selectedSort }) => {
    const t = useTranslate();
    return (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content bg="white" alignItems="flex-start">
                <Box w="full" bg="white">
                    <HStack
                        px="20px"
                        pr="30px"
                        mb="20px"
                        justifyContent={'space-between'}
                        alignItems={'center'}
                    >
                        <Text w="full" textAlign={'left'} fontSize={'16px'} fontWeight={600}>
                            {t('sort.sortBy')}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Box>
                                <CloseIcon color="black" />
                            </Box>
                        </TouchableOpacity>
                    </HStack>
                    <Box px="20px" pb="15px">
                        {Object.keys(SORT_KEY).map((key) => (
                            <TouchableOpacity
                                key={key}
                                onPress={() => setSelectedSort(SORT_KEY[key])}
                            >
                                <HStack
                                    borderRadius={'8px'}
                                    bg={selectedSort === SORT_KEY[key] ? 'primary.200' : 'white'}
                                    alignItems={'center'}
                                    px="10px"
                                    py="15px"
                                    justifyContent={'space-between'}
                                >
                                    <Text
                                        color={
                                            selectedSort === SORT_KEY[key] ? 'primary.600' : 'black'
                                        }
                                        fontWeight={500}
                                    >
                                        {t(`sort.${SORT_KEY[key]}`)}
                                    </Text>
                                    {selectedSort === SORT_KEY[key] && (
                                        <CheckIcon color="primary.600" />
                                    )}
                                </HStack>
                            </TouchableOpacity>
                        ))}
                    </Box>
                </Box>
            </Actionsheet.Content>
        </Actionsheet>
    );
};

export default SortContractSheet;
