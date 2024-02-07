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
    Text,
    Link
} from '@adobe/react-spectrum';
import { getSignedURL, listObjects } from "~/utils/aws-client";
import { initSDK } from "~/utils/ps-api-client";
import psApiLib from '@adobe/aio-lib-photoshop-api';
import { displayError} from "~/utils/display-utils";
import { getFileType, FILETYPE, getUUID } from "../../utils/file-utils";

const ApplyPhotoshopActions = () => {
    const [isBusy, setIsBusy] = React.useState(false);
    const [fileList, setFileList] = React.useState([]);
    const [actionList, setActionList] = React.useState([]);
    const [inputFileName, setInputFileName] = React.useState(null);
    const [inputActionFileName, setInputActionFileName] = React.useState(null);
    const [imageSrc, setImageSrc] = React.useState(null);
    const [inputImageURL, setInputImageURL] = React.useState(null);


    const applyActions = async () => {
        const sdk = await initSDK();
        if(inputFileName === null || inputActionFileName === null) {
            displayError('Input file and preset file must be provided');
        } else {
            try {
                setIsBusy(true);
                const outputID = getUUID();
                const input = {
                    href: inputImageURL,
                    storage: psApiLib.Storage.EXTERNAL,
                  }
                  const options = {
                    actions: [
                      {
                        href: await getSignedURL('getObject',`inputs/${inputActionFileName}`),
                        storage: psApiLib.Storage.EXTERNAL,
                      }
                    ]
                  }
                  const output = {
                    href: await getSignedURL('putObject', `output/${outputID}.png`),
                    storage: psApiLib.Storage.EXTERNAL,
                    type: psApiLib.MimeType.PNG
                  }
                  await sdk.applyPhotoshopActions(input, output, options);
                  const imageURL = await getSignedURL('getObject', `output/${outputID}.png`);
                  setImageSrc(imageURL);
                  setIsBusy(false);
            } catch (e) {
                setIsBusy(false);
                console.log(e);
                displayError(`Create Mask Error: ${e}`);
            }
        }
    }

    const getFileList = async () => {
        const files = await listObjects('inputs');
        const images = [];
        const actions = [];
        files.map((file, index) => {
            if (!file.Key.endsWith('/')){
                const fileName = file.Key.split('/')[1];
                if(getFileType(fileName) === FILETYPE.action) {
                    actions.push({id: index, name: fileName});
                }  else if(getFileType(fileName) === FILETYPE.image) {
                    images.push({id:index, name: fileName});
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
            
            <Flex direction={'column'}>
                <Heading level={1}>Apply Photoshop Actions</Heading>
                <Text>
                    Executes Photoshop Actions on the selected image. To know more about this feature refer <Link href="https://developer.adobe.com/photoshop/photoshop-api-docs/features/#photoshop-actions">Photoshop Actions</Link>
                </Text>
                <Heading level={3}>Instructions:</Heading>
                <Text>Select an input image to apply the actions to. In this example, we are supplying the Photoshop actions in a separate file. </Text>
                <Text>You can supply additional Photoshop action files using the <Link href="/uploadtoS3">Upload Asset to S3 page</Link>.</Text>
            </Flex>
            <Flex direction={'row'} gap={10} alignItems={'end'}>
                <ComboBox label='Select an input image' defaultItems={fileList} isRequired onInputChange={handleInputImageSelection}>
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
                <ComboBox label='Select an action file' defaultItems={actionList} isRequired onInputChange={setInputActionFileName}>
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
                <Button variant='cta' onPress={() => applyActions()}>
                    {isBusy ? <ProgressCircle size='S' isIndeterminate/> : null}
                    <Text> Apply Actions</Text>
                </Button>
            </Flex>
            <Flex direction={'row'} gap={20} alignItems={'end'}>
                <View>
                    <Flex direction={'column'} gap={10}>
                        {inputImageURL !== null && 
                        <>
                            <Heading>Selected Input Image</Heading>
                            <Flex width="100%" maxHeigt="400">
                                <Image src={inputImageURL} objectFit="cover"/>
                            </Flex>
                        </>
                        }
                    </Flex>
                </View>
                <View>
                    {imageSrc !== null &&
                        <>
                            <Heading>Result from Photoshop API</Heading>
                            <Flex width="100%" maxHeigt="400">
                                <Image src={imageSrc} objectFit="cover"/>
                            </Flex>
                        </>
                    }
                </View>
            </Flex>
            
        </Flex>
    );
}
export default ApplyPhotoshopActions;
