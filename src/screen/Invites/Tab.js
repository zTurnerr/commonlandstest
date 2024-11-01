import { Box, ScrollView } from 'native-base';
import React from 'react';

export default function Index({ items = [], renderItem }) {
    return (
        <ScrollView>
            <Box px="12px">
                {items?.map((item) => {
                    if (renderItem) {
                        return renderItem(item);
                    }
                })}
            </Box>
        </ScrollView>
    );
}
