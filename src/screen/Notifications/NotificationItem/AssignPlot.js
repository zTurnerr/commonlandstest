import { Bell } from '../../../components/Icons';
import IconWrapper from './IconWrapper';
import Info from './Info';
import React, { useEffect, useState } from 'react';
import Wrapper from './Wrapper';
import { useNavigation } from '@react-navigation/native';
import { getPlotWaitAssign } from '../../../rest_client/apiClient';
import { SCREEN_HEIGHT, SCREEN_WIDTH, showMessage } from '../../../util/Constants';
import { Text } from 'native-base';
export default function AssignPlot({ data }) {
    const navigation = useNavigation();
    const [lines, setLines] = useState('');
    const [error, setError] = useState('');
    const goToPlotInfo = async (data) => {
        let info = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
        try {
            setError('');
            await getPlotWaitAssign(info.requestId, navigation);
        } catch (error) {
            setError(error);
            return;
        }
        return navigation.push('PlotInfo', {
            requestAssignPlotId: info.requestId,
        });
    };

    const showError = () => {
        showMessage({
            text: error,
            marginBottom: SCREEN_HEIGHT - 30 - lines * 15,
        });
    };

    const handleTextLayout = (event) => {
        const maxWidth = SCREEN_WIDTH - 50;
        const { width } = event.nativeEvent.layout;
        const lines = Math.ceil(width / maxWidth);
        setLines(lines > 0 ? lines : 1);
    };

    useEffect(() => {
        if (lines > 0 && error.length > 0) {
            showError();
        }
    }, [error, lines]);

    return (
        <Wrapper
            data={data}
            onPress={() => {
                goToPlotInfo(data);
            }}
        >
            <Text position={'absolute'} opacity={0} onLayout={handleTextLayout}>
                {error}
            </Text>
            <IconWrapper>
                <Bell color="#5EC4AC" />
            </IconWrapper>
            <Info data={data} />
        </Wrapper>
    );
}
