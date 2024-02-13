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

import React, { useEffect } from 'react';
import { 
    Flex, 
    Button, 
    View, 
    Image, 
    Heading,
    ComboBox,
    Item 
} from '@adobe/react-spectrum';
import { initExpress, TemplateTypes } from '~/utils/express-utils';

const FullExpressEditor = () => {
    const [ccEverywhere, setCCEverywhere] = React.useState(null);
    const [result, setResult] = React.useState(null);
    const [templateType, setTemplateType] = React.useState(null);
    const [projectId, setProjectId] = React.useState(null);

    
    // Initialize EmbedSDK on view load
    useEffect(() => {
        const initialize = async () => {
           const sdk = await initExpress();
           setCCEverywhere(sdk);
        }
        initialize(); 
    },[]);

    const createDesignCallbacks = {
        onCancel: () => {},
        onPublish: (publishParams) => {
            const localData = { project: publishParams.asset[0].projectId, image: publishParams.asset[0].data };
            setResult(localData.image);
            setProjectId(localData.project);
        },
        onError: (err) => {
            console.error('Error received is', err.toString());
        },
    

    }

    const handleClick = () => {
        ccEverywhere.createDesign(
            {
                callbacks: createDesignCallbacks,
                outputParams: {
                    outputType: "base64"
                },
                inputParams: { 
                    templateType: templateType
                }
            }
        );

    }

    return (
        <Flex direction={'column'} gap={10}>
            <View>
                <Heading level={1}>Adobe Express Embed SDK</Heading>
            </View>
            
            <Flex direction={'row'} gap={40}>
                <View>
                    <Flex direction={'column'} gap={20}>
                        <Heading level={3}>Full Editor</Heading>
                        <ComboBox label='Template Type' defaultItems={TemplateTypes} onSelectionChange={setTemplateType} isRequired>
                            {item => <Item>{item.name}</Item>}
                        </ComboBox>
                        <Button variant='cta' onPress={() => handleClick()} isDisabled={templateType === null ? true : false}>Open Express Editor</Button>
                    </Flex>
                    
                </View>
                <View maxWidth={600}>
                    <Flex direction={'column'}>
                        {(result) ?
                            <>
                                <Heading level={3}>Output Result</Heading>
                                 <Image src={`${result}`}/>
                            </>
                           
                        : null}
                    </Flex>
                    
                </View>
            </Flex>
        </Flex>
    );


}

export default FullExpressEditor;
