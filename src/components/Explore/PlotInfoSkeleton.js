import { Box, Skeleton } from 'native-base';
import React from 'react';

/**
 * @description Plot info skeleton
 */
export default function PlotInfoSkeleton() {
    return (
        <Box w="full" h="full" borderRadius="12px" overflow="hidden" bgColor="#FFFFFF50">
            <Skeleton w="full" h="100px" mb="8px" bgColor="primary.200" />
            <Box px="12px">
                <Box flexDir="row" alignItems="center" mb="4px">
                    <Skeleton flex={1} borderRadius="sm"></Skeleton>
                    <Skeleton height="16px" ml="4px" w="24px"></Skeleton>
                </Box>

                <Box flexDir="row" alignItems="center" mb="4px">
                    <Skeleton h="16px" borderRadius="sm" />
                </Box>

                <Box flexDir="row" alignItems="center" mb="4px">
                    <Skeleton h="16px" borderRadius="sm" />
                </Box>

                <Box flexDirection="row" alignItems="center" mb="4px">
                    <Skeleton w="64px" h="34px" borderRadius="30px" />
                    <Skeleton w="64px" h="34px" borderRadius="30px" ml="4px" />
                </Box>
            </Box>
        </Box>
    );
}
