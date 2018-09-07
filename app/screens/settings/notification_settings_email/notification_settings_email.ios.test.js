// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import {emptyFunction} from 'app/utils/general';

import SectionItem from 'app/screens/settings/section_item';

import NotificationSettingsEmailIos from './notification_settings_email.ios.js';

jest.mock('app/utils/theme', () => {
    const original = require.requireActual('app/utils/theme');
    return {
        ...original,
        changeOpacity: jest.fn(),
    };
});

describe('NotificationSettingsEmailIos', () => {
    const baseProps = {
        currentUser: {id: 'current_user_id'},
        emailInterval: '30',
        enableEmailBatching: false,
        navigator: {setOnNavigatorEvent: emptyFunction},
        actions: {
            updateMe: jest.fn(),
            savePreferences: jest.fn(),
        },
        sendEmailNotifications: true,
        siteName: 'Mattermost',
        theme: {
            centerChannelBg: '#aaa',
            centerChannelColor: '#aaa',
        },
    };

    test('should match snapshot, renderEmailSection', () => {
        const wrapper = shallow(
            <NotificationSettingsEmailIos {...baseProps}/>
        );

        expect(wrapper.instance().renderEmailSection()).toMatchSnapshot();
    });

    test('should call saveEmailNotifyProps on onNavigatorEvent', () => {
        const wrapper = shallow(
            <NotificationSettingsEmailIos {...baseProps}/>
        );

        const instance = wrapper.instance();
        instance.saveEmailNotifyProps = jest.fn();
        instance.onNavigatorEvent({type: 'ScreenChangedEvent', id: 'willDisappear'});

        expect(instance.saveEmailNotifyProps).toHaveBeenCalledTimes(1);
    });

    test('should call actions.updateMe and actions.savePreferences on saveEmailNotifyProps', () => {
        const savePreferences = jest.fn();
        const updateMe = jest.fn();
        const props = {...baseProps, actions: {savePreferences, updateMe}};
        const wrapper = shallow(
            <NotificationSettingsEmailIos {...props}/>
        );

        wrapper.setState({email: 'true', newInterval: 30});
        wrapper.instance().saveEmailNotifyProps();

        expect(updateMe).toHaveBeenCalledTimes(1);
        expect(updateMe.mock.calls[0][0].notify_props.email).toBe('true');

        expect(savePreferences).toHaveBeenCalledTimes(1);
        expect(savePreferences).toBeCalledWith('current_user_id', [{category: 'notifications', name: 'email_interval', user_id: 'current_user_id', value: 30}]);
    });

    test('should match state on setEmailNotifications', () => {
        const wrapper = shallow(
            <NotificationSettingsEmailIos {...baseProps}/>
        );

        wrapper.setState({email: 'false', interval: '0'});
        wrapper.instance().setEmailNotifications('30');
        expect(wrapper.state({email: 'true', interval: '30'}));

        wrapper.instance().setEmailNotifications('0');
        expect(wrapper.state({email: 'false', interval: '0'}));

        wrapper.instance().setEmailNotifications('3600');
        expect(wrapper.state({email: 'true', interval: '3600'}));
    });

    test('should match state on action of SectionItem', () => {
        const wrapper = shallow(
            <NotificationSettingsEmailIos
                {...baseProps}
                sendEmailNotifications={false}
                enableEmailBatching={false}
            />
        );

        expect(wrapper.find(SectionItem).exists()).toBe(false);

        wrapper.setProps({sendEmailNotifications: true});
        expect(wrapper.find(SectionItem).exists()).toBe(true);
        expect(wrapper.find(SectionItem).length).toBe(2);

        wrapper.setProps({enableEmailBatching: true});
        expect(wrapper.find(SectionItem).exists()).toBe(true);
        expect(wrapper.find(SectionItem).length).toBe(4);

        wrapper.setState({email: 'false', interval: '0'});

        wrapper.find(SectionItem).first().prop('action')('30');
        expect(wrapper.state({email: 'true', interval: '30'}));

        wrapper.find(SectionItem).first().prop('action')('0');
        expect(wrapper.state({email: 'true', interval: '0'}));

        wrapper.find(SectionItem).last().prop('action')('3600');
        expect(wrapper.state({email: 'true', interval: '3600'}));
    });

    test('should call props.actions.savePreferences on saveUserNotifyProps', () => {
        const props = {...baseProps, actions: {savePreferences: jest.fn(), updateMe: jest.fn()}};
        const wrapper = shallow(
            <NotificationSettingsEmailIos {...props}/>
        );

        wrapper.setState({email: 'true', newInterval: '3600'});
        wrapper.instance().saveEmailNotifyProps();
        expect(props.actions.savePreferences).toHaveBeenCalledTimes(1);
        expect(props.actions.savePreferences).toBeCalledWith(
            'current_user_id',
            [{category: 'notifications', name: 'email_interval', user_id: 'current_user_id', value: '3600'}],
        );
    });
});
