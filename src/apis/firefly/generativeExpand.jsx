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


const GenerativeExpand = () => {

    const [prompt, setPrompt] = React.useState(null);
    const [images, setImages] = React.useState(null);
    const [id, setId] = React.useState(null);
    const [isGenerating, setIsGenerating] = React.useState(false); 

    const executeAPICall = async () => {
        if(id === null || prompt === null) {
            displayError('You must provide a reference image and prompt!');
        } else {
            try {
                const body = {
                    "prompt": prompt,
                    "n": 2,
                    "seeds":[
                        1,
                        2
                    ],
                    "image": {
                        "id": id
                    },
                    "size": {
                        "width": 1792,
                        "height": 1024
                    }
                  };
                
                setIsGenerating(true);
                const result = await httpRequest('/v1/images/expand', body, 'reference');
                setImages(result.images);
                
            } catch (e) {
                displayError(`Error while generating expand: ${e}`);
            } finally {
                setIsGenerating(false);
            }
        } 
    }

    return (
        <Flex direction={'column'} gap={10}>
            <Heading level={1}>Generative Expand</Heading>
            <Flex direction={'row'} gap={40}>
                <View width={300}>
                    <Flex direction={'column'} gap={20}>
                        <FileUploader onUpload={setId} label="Upload File"/>
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

export default GenerativeExpand;