import React from 'react';
import { Bell } from '../../../components/Icons';
import IconWrapper from './IconWrapper';
import Info from './Info';
import Wrapper from './Wrapper';

export default function Index({ data, onPress = () => {} }) {
    return (
        <Wrapper data={data} onPress={onPress}>
            <IconWrapper>
                <Bell color="#5EC4AC" />
            </IconWrapper>
            <Info data={data} />
        </Wrapper>
    );
}
