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
  Link,
  Text,
  ProgressCircle
} from '@adobe/react-spectrum';
import { getSignedURL, listObjects } from "~/utils/aws-client";
import { initSDK } from "~/utils/ps-api-client";
import psApiLib from '@adobe/aio-lib-photoshop-api';
import { displayError} from "~/utils/display-utils";
import { getFileType, FILETYPE, getUUID } from "../../utils/file-utils";

const ModifyDocument = () => {
    const [isBusy, setIsBusy] = React.useState(false);
    const [fileList, setFileList] = React.useState([]);
    const [inputFileName, setInputFileName] = React.useState(null);
    const [imageSrc, setImageSrc] = React.useState(null);
    const [inputImageURL, setInputImageURL] = React.useState(null);


    const modifyDoc = async () => {
        const sdk = await initSDK();
        if(inputFileName === null) {
            displayError('Input file must be provided');
        } else {
            try {
              setIsBusy(true);
              const fileID = getUUID();
                const input = {
                    href: inputImageURL,
                    storage: psApiLib.Storage.EXTERNAL,
                  }
                  const output = {
                    href: await getSignedURL('putObject', `output/${fileID}.psd`),
                    storage: psApiLib.Storage.EXTERNAL,
                    type: psApiLib.MimeType.PSD
                  }

                  const options = {
                    layers: [
                      {
                        edit: {},
                        name: "Hello",
                        text: {
                          content: "Good Bye"
                        }
                      },
                      {
                        add: {
                          insertTop: true
                        },
                        type: "adjustmentLayer",
                        adjustments: {
                          hueSaturation: {
                            colorize: true,
                            channels: [
                              {
                                channel: "master",
                                hue: 0,
                                saturation: -100,
                                lightness: 0
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                  await sdk.modifyDocument(input, output, options);
                  const imageURL = await getSignedURL('getObject', `output/${fileID}.psd`);
                  setImageSrc(imageURL);
                  setIsBusy(false);
            } catch (e) {
                setIsBusy(false);
                console.log(e);
                displayError(`Modify Document Error: ${e}`);
            }
        }
    }

    const getFileList = async () => {
        const files = await listObjects('inputs');
        const documents = [];
        files.map((file, index) => {
          if(!file.Key.endsWith('/')) {
            const filename = file.Key.split('/')[1];
            if(getFileType(filename) === FILETYPE.document) {
              documents.push({id:index, name: filename})
            }
          }
        });
        setFileList(documents);
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
                <Heading level={1}>Modify Document</Heading>
                <Text>
                Apply psd edits.To know more about this feature refer <Link href="https://developer.adobe.com/photoshop/photoshop-api-docs/features/#document-level-edits">Document Edits.</Link>
                </Text>
                <Heading level={3}>Instructions:</Heading>
                <Text>In this example, we are making changes to layers in the selected PSD file.</Text>
                <Text>You can supply additional Photoshop action files using the <Link href="/uploadtoS3">Upload Asset to S3 page</Link>.</Text>
            </Flex>
            <Flex direction={'row'} gap={10} alignItems={'end'}>
                <ComboBox label='Select an input image' defaultItems={fileList} isRequired onInputChange={handleInputImageSelection}>
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
                <Button variant='cta' onPress={() => modifyDoc()}>
                  <Text>Modify</Text>
                  {isBusy ? <ProgressCircle size='S' isIndeterminate/> : null}
                </Button>
            </Flex>
            <Flex direction={'row'} gap={20} alignItems={'end'}>
                <View>
                    {imageSrc !== null &&
                        <>
                            <Heading>Result from Photoshop API</Heading>
                            <Link href={imageSrc}>Download Modified Document</Link>
                        </>
                    }
                </View>
            </Flex>
            
        </Flex>
    );
}
export default ModifyDocument;
