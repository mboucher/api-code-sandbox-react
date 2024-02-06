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

import React, { useEffect } from "react";
import {
    Button, 
    Heading, 
    Flex, 
    View, 
    ComboBox, 
    Item, 
    TextField,
    Image,
    ProgressCircle,
    Text
} from '@adobe/react-spectrum';
import { getSignedURL, listObjects } from "~/utils/aws-client";
import { initSDK } from "~/utils/ps-api-client";
import psApiLib from '@adobe/aio-lib-photoshop-api';
import { displayError} from "~/utils/display-utils";
import { getFileType, FILETYPE } from "../../utils/file-utils";

const ApplyPhotoshopActionsJSON = () => {
    const [isBusy, setIsBusy] = React.useState(false);
    const [fileList, setFileList] = React.useState([]);
    const [actionList, setActionList] = React.useState([]);
    const [inputFileName, setInputFileName] = React.useState(null);
    const [inputAdditionalFileName, setInputAdditionalFileName] = React.useState(null);
    const [outputFileName, setOuputFileName] = React.useState(null);
    const [imageSrc, setImageSrc] = React.useState(null);
    const [inputImageURL, setInputImageURL] = React.useState(null);


    const applyActions = async () => {
        const sdk = await initSDK();
        if(inputFileName === null || outputFileName === null || inputAdditionalFileName === null) {
            displayError('Input file, preset file and output filename must be provided');
        } else {
            try {
                setIsBusy(true);
                const input = {
                    href: inputImageURL,
                    storage: psApiLib.Storage.EXTERNAL,
                  }
                const options = {
                actionJSON: [
                    {
                    '_obj': 'traceContour',
                    'edge': {
                        '_enum': 'contourEdge',
                        '_value': 'upper'
                    },
                    'level': 148
                    },
                    {
                    '_obj': 'placeEvent',
                    'freeTransformCenterState': {
                        '_enum': 'quadCenterState',
                        '_value': 'QCSAverage'
                    },
                    'height': {
                        '_unit': 'percentUnit',
                        '_value': 51.83142658062201
                    },
                    'null': {
                        '_kind': 'local',
                        '_path': 'ACTION_JSON_OPTIONS_ADDITIONAL_IMAGES_0'
                    },
                    'offset': {
                        '_obj': 'offset',
                        'horizontal': {
                        '_unit': 'pixelsUnit',
                        '_value': 298.34811239846806
                        },
                        'vertical': {
                        '_unit': 'pixelsUnit',
                        '_value': 127.16503382715794
                        }
                    },
                    'replaceLayer': {
                        '_obj': 'placeEvent',
                        'to': {
                        '_id': 5,
                        '_ref': 'layer'
                        }
                    },
                    'width': {
                        '_unit': 'percentUnit',
                        '_value': 51.83142658062201
                    }
                    },
                    {
                    '_obj': 'set',
                    '_target': [{
                        '_enum': 'ordinal',
                        '_ref': 'layer'
                    }],
                    'to': {
                        '_obj': 'layer',
                        'name': 'Overlay'
                    }
                    }
                ],
                additionalImages: [
                    {
                    href:  await getSignedURL('getObject',`inputs/${inputAdditionalFileName}`),
                    storage: 'external'
                    }
                ]
                }
                  const output = {
                    href: await getSignedURL('putObject', `output/${outputFileName}`),
                    storage: psApiLib.Storage.EXTERNAL,
                    type: psApiLib.MimeType.PNG
                  }
                  await sdk.applyPhotoshopActionsJson(input, output, options);
                  const imageURL = await getSignedURL('getObject', `output/${outputFileName}`);
                  setImageSrc(imageURL);
                  setIsBusy(false);
            } catch (e) {
                setIsBusy(false);
                console.log(e);
                displayError(`Photoshop Actions Error: ${e}`);
            }
        }
    }

    const getFileList = async () => {
        const files = await listObjects('inputs');
        const images = [];
        const actions = [];
        files.map((file, index) => {
            if(!file.Key.endsWith('/')) {
                const filename = file.Key.split('/')[1];
                if(getFileType(filename) === FILETYPE.action) {
                    actions.push({id:index, name: filename});
                } else if(getFileType(filename) === FILETYPE.image ) {
                    images.push({id:index, name: filename})
                }
            } 
        });
        setFileList(images);
        setActionList(actions);
    }

    useEffect(() => {
        getFileList();
    },[]);

    const handleInputImageSelection = async (selection) => {
        setInputFileName(selection);
        const signedURL = await getSignedURL('getObject',`inputs/${selection}`);
        setInputImageURL(signedURL);
    }

    return(
        <Flex direction={'column'} gap={10}>
            <Heading level={1}>Apply Photoshop Actions</Heading>
            <Flex direction={'row'} gap={10} alignItems={'end'}>
                <ComboBox label='Select an input image' defaultItems={fileList} isRequired onInputChange={handleInputImageSelection}>
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
                <ComboBox label='Select an additional file' defaultItems={fileList} isRequired onInputChange={setInputAdditionalFileName}>
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
                <TextField label='Output Image File Name' name='outputFileName' isRequired onChange={setOuputFileName}/>
                <Button variant='cta' onPress={() => applyActions()}>
                    {isBusy ? <ProgressCircle size='S' isIndeterminate/> : null}
                    <Text>Apply Actions</Text>
                </Button>
            </Flex>
            <Flex direction={'row'} gap={20} alignItems={'end'}>
                <View>
                    <Flex direction={'column'} gap={10}>
                        
                        {inputImageURL !== null && 
                        <>
                            <Heading>Selected Input Image</Heading>
                            <Image src={inputImageURL}/>
                        </>
                        }
                    </Flex>
                    
                </View>
                <View>
                    {imageSrc !== null &&
                        <>
                            <Heading>Result from Photoshop API</Heading>
                            <Image src={imageSrc}/>
                        </>
                    }
                </View>
            </Flex>
            
        </Flex>
    );
}
export default ApplyPhotoshopActionsJSON;
