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
import {Button, Heading, Flex, View, ComboBox, Item, TextField, Image, Link} from '@adobe/react-spectrum';
import { getSignedURL, listObjects } from "~/utils/aws-client";
import { initSDK } from "~/utils/ps-api-client";
import psApiLib from '@adobe/aio-lib-photoshop-api';
import { displayError} from "~/utils/display-utils";

const CreatePSDDocument = () => {
    const [fileList, setFileList] = React.useState([]);
    const [inputFileName, setInputFileName] = React.useState(null);
    const [outputFileName, setOuputFileName] = React.useState(null);
    const [imageSrc, setImageSrc] = React.useState(null);
    const [inputImageURL, setInputImageURL] = React.useState(null);


    const createPSD = async () => {
        const sdk = await initSDK();
        if(inputFileName === null || outputFileName === null) {
            displayError('Input file, preset file and output filename must be provided');
        } else {
            try {
                
                const output = {
                    href: await getSignedURL('putObject', `output/${outputFileName}.psd`),
                    storage: psApiLib.Storage.EXTERNAL,
                    type: psApiLib.MimeType.PSD
                }

                const options = {
                    document: {
                      width: 960,
                      height: 586,
                      resolution: 72,
                      fill: psApiLib.BackgroundFill.TRANSPARENT,
                      mode: psApiLib.Colorspace.RGB
                    },
                    layers: [
                      {
                        add: {},
                        bounds: {
                          top: 0,
                          left: 0,
                          width: 200,
                          height: 100
                        },
                        type: psApiLib.LayerType.TEXT_LAYER,
                        text: {
                          content: "Hello",
                          characterStyles: [
                            {
                              fontSize: 72
                            }
                          ]
                        }
                      },
                      {
                        add: {
                          insertTop: true
                        },
                        type: psApiLib.LayerType.ADJUSTMENT_LAYER,
                        adjustments: {
                          brightnessContrast: {
                            brightness: -50
                          }
                        }
                      },
                      {
                        input: {
                          href: inputImageURL,
                          storage: psApiLib.Storage.EXTERNAL,
                        },
                        type: psApiLib.LayerType.LAYER,
                        name: 'New Layer 1'
                      }
                    ]
                  }
                  
                  await sdk.createDocument(output, options);
                  const imageURL = await getSignedURL('getObject', `output/${outputFileName}.psd`);
                  setImageSrc(imageURL);
            } catch (e) {
                console.log(e);
                displayError(`Create Document Error: ${e}`);
            }
        }
    }

    const getFileList = async () => {
        const files = await listObjects('inputs');
        const images = [];
        files.map((file, index) => {
            const filename = file.Key.split('/')[1];
            if(!filename.toLowerCase().endsWith('xmp')) {
                images.push({id:index, name: filename})
            }
        });
        setFileList(images);
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
            <Heading level={1}>Create PSD Document</Heading>
            <Flex direction={'row'} gap={10} alignItems={'end'}>
                <ComboBox label='Select an input image' defaultItems={fileList} isRequired onInputChange={handleInputImageSelection}>
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
                <TextField label='Output Image File Name' name='outputFileName' isRequired onChange={setOuputFileName}/>
                <Button variant='cta' onPress={() => createPSD()}>Create PSD</Button>
            </Flex>
            <Flex direction={'row'} gap={20} alignItems={'start'}>
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
                            <Link href={imageSrc}>Download PSD File</Link>
                        </>
                    }
                </View>
            </Flex>
            
        </Flex>
    );
}
export default CreatePSDDocument;
