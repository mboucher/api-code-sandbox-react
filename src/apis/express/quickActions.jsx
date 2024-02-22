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
import { QuickActions, toBase64 } from '../../utils/express-utils';
import DragAndDrop from '../../components/DragAndDrop';
import { 
    REACT_APP_EXPRESS_CLIENT_ID, 
    REACT_APP_EXPRESS_APP_NAME,
    REACT_APP_EXPRESS_SDK_CDN
} from '../../utils/secrets';

const ExpressQuickActions = () => {
    const [ccEverywhere, setCCEverywhere] = React.useState(null);
    const [result, setResult] = React.useState(null);
    const [quickAction, setQuickAction] = React.useState(null);
    const [base64, setBase64] = React.useState(null);

     // Initialize EmbedSDK on view load
     useEffect(() => {
        const params = {
            clientId: REACT_APP_EXPRESS_CLIENT_ID, 
            appName: REACT_APP_EXPRESS_APP_NAME
        };
    
        const script = document.createElement('script');
        script.src = REACT_APP_EXPRESS_SDK_CDN;
        script.onload = async() => {
            if(!window.CCEverywhere) {
                return;
            }
            const sdk = await window.CCEverywhere.initialize(params);
            setCCEverywhere(sdk);
        }
        document.body.appendChild(script);
    },[]);

    const handleFileDrop = async (file) => {
        const contents = await toBase64(file);
        setBase64(contents);
    };
    
    const exportOptions = [
        /* This native button renders label "Open in Adobe Express" */
        {
            target: 'Editor',
            id: 'edit-in-express',
            buttonType: 'native',
            optionType: 'button'
        },
        /* This native button renders label "Save" */
        {
            target: 'Host',
            id: 'save-action',
            label: 'Save',
            closeTargetOnExport: true,
            optionType: 'button',
            buttonType: 'custom'
        }
    ];

    const handleClick = async () => {   
        ccEverywhere.openQuickAction({
            id: quickAction,
            inputParams: {
                asset: {
                    data: base64, 
                    dataType: 'base64', 
                    type: 'image'
                }, 
                exportOptions: exportOptions
            },
            callbacks:{
                onError: (err)=>{console.log(err)},
                onPublish: (publishParams) => {
                    if(publishParams.exportButtonId == 'save-action') {
                        const localData = {asset: publishParams.asset[0].data}
                        setResult(localData.asset);
                    }
                }
            }
        });
    }

    return (
        <Flex direction={'column'} gap={10}>
            <View>
                <Heading level={1}>Adobe Express Embed SDK</Heading>
            </View>
            <Flex direction={'row'} gap={40}>
                <View>
                    <Flex direction={'column'} gap={20}>
                        <Heading level={3}>Quick Actions</Heading>
                        <ComboBox label='Select a quick action' defaultItems={QuickActions} onSelectionChange={setQuickAction} isRequired>
                            {item => <Item>{item.name}</Item>}
                        </ComboBox>
                        {(quickAction!== null) ?
                            <DragAndDrop onImageDrop={handleFileDrop}/>
                        : 
                            null
                        }
                        <Button variant='cta' onPress={() => handleClick()} isDisabled={quickAction === null ? true : false}>Perform Quick Action</Button>
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

export default ExpressQuickActions;