/* ************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
**************************************************************************/
import React from 'react';
import {
    Flex,
    View,
    Heading, 
    Link,
    MenuTrigger,
    ActionButton,
    Menu,
    Item
} from '@adobe/react-spectrum';
import { AdobeIcon } from './adobeIcon';

const NavBar = () => {

    const handleNavSelection = (key) => {
        document.location.href = `/${key}`;
    }

    return (
        <Flex direction="row" height='auto' gap="size-100" >
            <View alignSelf="center" paddingStart="size-400" width='40px' height='300'>
            <Link isQuiet>
                <a  href='/'>
                    <AdobeIcon />
                </a>
            </Link>
            </View>
            <View alignSelf="center" width='200px' paddingStart='size-150'>
                <Heading level={2} id='app-heading'>CC API Kitchen Sink</Heading>
            </View>
            <View alignSelf="center" paddingStart='size-150'>
            <MenuTrigger>
                <ActionButton isQuiet>
                    Photoshop APIs
                </ActionButton>
                <Menu onAction={(key) => handleNavSelection(key)}>
                    <Item key="uploadtoS3">Upload Asset to S3</Item>
                    <Item key="removeBackground">Remove Background</Item>
                    <Item key="createMask">Create Mask</Item>
                    <Item key="editPhoto">Edit Photo</Item>
                    <Item key="createRendition">Create Renditions</Item>
                    <Item key="createPSDDocument">Create PSD Document</Item>
                    <Item key="replaceSmartObject">Replace Smart Object</Item>
                    <Item key="getDocumentManifest">Get Document Manifest</Item>
                    <Item key="modifyDocument">Modify Document</Item>
                    <Item key="applyPhotoshopActions">Apply Photoshop Actions</Item>
                    <Item key="applyPhotoshopActionsJSON">Apply Photoshop Actions JSON</Item>
                </Menu>
            </MenuTrigger>
            <MenuTrigger>
                <ActionButton isQuiet>
                    Lightroom APIs
                </ActionButton>
                <Menu onAction={(key) => handleNavSelection(key)}>
                    <Item key="uploadtoS3">Upload Asset to S3</Item>
                    <Item key="autoTone">Auto Tone</Item>
                    <Item key="straighten">Straighten</Item>
                    <Item key="applyPreset">Apply Preset</Item>
                    <Item key="applyPresetXMP">Apply Preset XMP</Item>
                </Menu>
            </MenuTrigger>
            <MenuTrigger>
                <ActionButton isQuiet>
                    Firefly APIs
                </ActionButton>
                <Menu onAction={(key) => handleNavSelection(key)}>
                    <Item key="textToimage">Text To Image v1</Item>
                    <Item key="generativeMatch">Generative Match</Item>
                    <Item key="generativeExpand">Generative Expand</Item>
                    <Item key="generativeFill">Generative Fill</Item>
                </Menu>
            </MenuTrigger>
            <MenuTrigger>
                <ActionButton isQuiet>
                    Express SDK
                </ActionButton>
                <Menu onAction={(key) => handleNavSelection(key)}>
                    <Item key="fullEditor">Full Editor</Item>
                    <Item key="quickActions">Quick Actions</Item>
                </Menu>
            </MenuTrigger>
            </View>
        </Flex>
    );
};

export default NavBar;