import { Box, Text } from 'native-base';

import React from 'react';
import PlotStatus from '../../../components/PlotStatus';

export default function Index({ data }) {
    return (
        <Box bg="white" flexDir="row" borderBottomColor="divider" borderBottomWidth="1px" p="12px">
            <Box flex={1} mr="12px">
                <Text fontWeight="bold">{data.name}</Text>
                <Text>{data.placeName}</Text>
            </Box>
            <PlotStatus status={data?.isOnHold ? 7 : data.status} px="12px" />
        </Box>
    );
}
