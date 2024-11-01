import React from 'react';
import { FlaggedIcon } from '../../../components/Icons';
import { useFlagAndUnFlag } from '../../../hooks/useFlagAndUnFlag';
import IconWrapper from './IconWrapper';
import Info from './Info';
import Wrapper from './Wrapper';

export default function Index({ data }) {
    const { goToPlotInfo } = useFlagAndUnFlag();
    const _onPress = () => {
        goToPlotInfo(data);
    };
    return (
        <Wrapper onPress={_onPress} data={data}>
            <IconWrapper bgColor="rgba(250, 189, 58,.2)">
                <FlaggedIcon color="rgb(250, 189, 58)" />
            </IconWrapper>
            <Info data={data} />
        </Wrapper>
    );
}
