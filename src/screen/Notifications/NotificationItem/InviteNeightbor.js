import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Bell } from '../../../components/Icons';
import IconWrapper from './IconWrapper';
import Info from './Info';
import Wrapper from './Wrapper';

export default function InviteNeightbor({ data }) {
    const navigation = useNavigation();
    const goToPlotInfo = (data) => {
        let info = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
        return navigation.push('PlotInfo', {
            plotID: info.inviteePlotID,
            manageNeighbors: true,
        });
    };
    return (
        <Wrapper
            data={data}
            onPress={() => {
                goToPlotInfo(data);
            }}
        >
            <IconWrapper>
                <Bell color="#5EC4AC" />
            </IconWrapper>
            <Info data={data} />
        </Wrapper>
    );
}
