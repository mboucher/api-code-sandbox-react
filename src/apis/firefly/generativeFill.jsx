/*************************************************************************
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
import {Flex, TextArea, Heading, View, Button, Text, ProgressCircle } from '@adobe/react-spectrum';
import { httpRequest, getRandomSeedValue } from '../../utils/firefly-api-client';
import { displayError } from '../../utils/display-utils';
import RenderResults from '../../components/renderResults';
import FileUploader from '../../components/fileUploader';


const GenerativeFill = () => {

    const [prompt, setPrompt] = React.useState(null);
    const [mask, setMask] = React.useState(null);
    const [images, setImages] = React.useState(null);
    const [imageId, setImageId] = React.useState(null);
    const [maskId, setMaskId] = React.useState(null);
    const [isGenerating, setIsGenerating] = React.useState(false); 

    const executeAPICall = async () => {
        if(imageId === null || maskId === null || prompt === null) {
            displayError('You must provide a reference image, a mask and prompt!');
        } else {
            try {
                const body = {
                    "prompt": prompt,
                    "n": 2,
                    "seeds":[
                        getRandomSeedValue(),
                        getRandomSeedValue()
                    ],
                    "size": {
                    "width": 1792,
                    "height": 1024
                    },
                    "image": {
                        "id": imageId
                    },
                    "mask":{
                        "id": maskId
                    }
                  };
                
                setIsGenerating(true);
                const result = await httpRequest('/v1/images/fill', body, 'reference');
                if(result.images) {
                    setImages(result.images);
                }

                if(result.error_code) {
                    displayError(`Error while generating image: ${result.message}`);
                }
                
                
            } catch (e) {
                displayError(`Error while generating image: ${e}`);
            } finally {
                setIsGenerating(false);
            }
        } 
    }

    return (
        <Flex direction={'column'} gap={10}>
            <Heading level={1}>Generative Match</Heading>
            <Flex direction={'row'} gap={40}>
                <View width={300}>
                    <Flex direction={'column'} gap={20}>
                        <FileUploader onUpload={setImageId} label={'Upload Image'}/>
                        <FileUploader onUpload={setMaskId} label={'Upload Mask'}/>
                        <TextArea width={'100%'} label='Prompt' onChange={setPrompt}></TextArea>
                        <Button variant='cta' onPress={() => executeAPICall()}>{isGenerating ? <ProgressCircle isIndeterminate size='S'/> : <Text>Generate</Text>}</Button>
                    </Flex>
                </View>
                <View width={'100%'}>
                    <Flex direction={'column'} gap={10}>
                        <View>
                            <Flex direction={'row'} gap={20}>
                                <View>
                                    {images !== null ?
                                        <RenderResults images={images} inline={false}/>
                                    : null}
                                </View>      
                            </Flex>
                        </View>
                    </Flex>
                </View>
            </Flex>
        </Flex>
    );
}

export default GenerativeFill;