import { Box, FlatList } from 'native-base';
import React from 'react';
import RowApproveReject from '../../components/RowInfo/RowApproveReject';
import RowApproveNeighbor from './RowApproveNeighbor';

const PaperApprove = ({ onViewReason, data }) => {
    return (
        <Box flex={1} bgColor={'white'} px={'20px'}>
            <FlatList
                data={data}
                renderItem={({ item, index }) => (
                    <>
                        {item?.rowUser?.length > 0 ? (
                            <RowApproveNeighbor item={item} onViewReason={onViewReason} />
                        ) : (
                            <RowApproveReject
                                info={item}
                                borderBottom={index !== data.length - 1}
                            />
                        )}
                    </>
                )}
            />
        </Box>
    );
};

export default PaperApprove;
