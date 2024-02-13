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
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import {
    Grid,
    Flex,
    View,
} from '@adobe/react-spectrum';
import { ToastContainer } from '@react-spectrum/toast';
import NavBar from './nav-bar';
import './styles.css';
import LandingPage from './landing';
// Photoshop API Pages
import RemoveBackgroundView from './apis/photoshop/removeBackground';
import UploadAssetS3 from './apis/photoshop/uploadAsset';
import CreateMask from './apis/photoshop/createMask';
import CreateRendition from './apis/photoshop/createRendition';
import CreatePSDDocument from './apis/photoshop/createPSDDocument';
import ReplaceSmartObject from './apis/photoshop/replaceSmartObject';
import GetDocumentManifest from './apis/photoshop/getDocumentManifest';
import ModifyDocument from './apis/photoshop/modifyDocument';
import ApplyPhotoshopActions from './apis/photoshop/applyPhotoshopActions';
import ApplyPhotoshopActionsJSON from './apis/photoshop/applyPhotoshopActionsJson';
// Lightroom API Pages
import ApplyPreset from './apis/lightroom/applyPreset';
import ApplyPresetXMP from './apis/lightroom/applyPresetXMP';
import AutoTone from './apis/lightroom/autoTone';
import StraightenImage from './apis/lightroom/straighten';
import EditPhoto from './apis/lightroom/editPhoto';

// Firefly API Pages
import TextToImage from './apis/firefly/textToImage';
import GenerativeMatch from './apis/firefly/generativeMatch';
import GenerativeExpand from './apis/firefly/generativeExpand';
import GenerativeFill from './apis/firefly/generativeFill';

// Adobe Express Embed SDK
import FullExpressEditor from './apis/express/fullEditor';
import QuickActions from './apis/express/quickActions';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <Provider theme={defaultTheme} colorScheme="light">
         <div className="applicationContentWrapper">
            <ToastContainer/>
            <Grid
                areas={['header header', 'content content']}
                columns={['1fr']}
                rows={['size-800', 'auto']}
                gap='size-10'height='100%'>
                    <View gridArea='header' paddingTop='size-10' borderBottomColor='gray-200' borderBottomWidth='thick' backgroundColor='static-white'>
                        <NavBar />
                    </View>
                    <View gridArea='content' backgroundColor='gray-200' min-height='100%'>
                        <Flex direction='column' height='100%' width='100%'>
                            <View height='100%' margin={40}>
                                <BrowserRouter>
                                    <Routes>
                                        <Route path='/' element={<LandingPage/>}/>
                                        <Route path='removeBackground' element={<RemoveBackgroundView/>}/>
                                        <Route path='uploadtoS3' element={<UploadAssetS3/>}/>
                                        <Route path='createMask' element={<CreateMask/>}/>
                                        <Route path='autoTone' element={<AutoTone/>}/>
                                        <Route path='straighten' element={<StraightenImage/>}/>
                                        <Route path='applyPreset' element={<ApplyPreset/>}/>
                                        <Route path='applyPresetXMP' element={<ApplyPresetXMP/>}/>
                                        <Route path='editPhoto' element={<EditPhoto/>}/>
                                        <Route path='createRendition' element={<CreateRendition/>}/>
                                        <Route path='createPSDDocument' element={<CreatePSDDocument/>}/>
                                        <Route path='replaceSmartObject' element={<ReplaceSmartObject/>}/>
                                        <Route path='getDocumentManifest' element={<GetDocumentManifest/>}/>
                                        <Route path='modifyDocument' element={<ModifyDocument/>}/>
                                        <Route path='applyPhotoshopActions' element={<ApplyPhotoshopActions/>}/>
                                        <Route path='applyPhotoshopActionsJSON' element={<ApplyPhotoshopActionsJSON/>}/>
                                        <Route path='textToImage' element={<TextToImage/>}/>
                                        <Route path='generativeMatch' element={<GenerativeMatch/>}/>
                                        <Route path='generativeExpand' element={<GenerativeExpand/>}/>
                                        <Route path='generativeFill' element={<GenerativeFill/>}/>
                                        <Route path='fullEditor' element={<FullExpressEditor/>}/>
                                        <Route path='quickActions' element={<QuickActions/>}/>
                                    </Routes>
                                </BrowserRouter>
                            </View>
                        </Flex>
                     </View>
            </Grid>
        </div>
    </Provider>
);