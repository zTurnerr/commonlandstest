import React from 'react';
import { HStack, Text } from 'native-base';
import { Claimrank } from '../Icons';
import { getTrustScoreBgCode } from '../../util/trustcore';

const ClaimrankTag = ({ type, _container = {} }) => {
    return (
        <HStack
            p="5px"
            px="10px"
            borderRadius={'17px'}
            bg={'strength.' + getTrustScoreBgCode(type)}
            alignItems={'center'}
            mr="10px"
            h="34px"
            {..._container}
        >
            <Claimrank color="white" />
            <Text fontWeight={600} color="white">
                {type}
            </Text>
        </HStack>
    );
};

export default ClaimrankTag;
