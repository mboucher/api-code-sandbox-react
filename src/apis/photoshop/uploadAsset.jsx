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
    Heading, 
    Text, 
    Content, 
    View, 
    Flex,
    TableView,
    TableHeader,
    TableBody,
    Column,
    Row,
    Button,
    Cell
} from '@adobe/react-spectrum';
import {FileTrigger} from 'react-aria-components';
import { listObjects, putObject } from "../../utils/aws-client";

const UploadAssetS3 = () => {

    let [selectedFileName, setSelectedFileName] = React.useState(null);
    let [filledSrc, setFilledSrc] = React.useState(null);
    let [fileList, setFileList] = React.useState([]);
    let [showTable, setShowtable] = React.useState(false);

    const handleFileSelection = (selection) => {
        const files = Array.from(selection);
        files.map(file => {
            setSelectedFileName(file.name);
            setFilledSrc(file);
        })
    }

    const handleUpload = async () => {
        await putObject('inputs',filledSrc);
        setSelectedFileName(null);
        setFilledSrc(null)
        fetchFileList();
    }

    const fetchFileList = async () => {
        const results = await listObjects('inputs');
        const updatedArray = [];
        results.map((file, index) => {
            if(!file.Key.endsWith('/')){
                const fileName = file.Key.split('/')[1];
                updatedArray.push({id: index, Key: fileName, LastModified: `${file.LastModified}`, Size: file.Size});
            }
           
        })
        setFileList(updatedArray);
    }

    useEffect(()=> {
        fetchFileList();
    },[]);

    useEffect(() => {
        setShowtable(true);
    },[fileList])


    const columns = [
        {name: 'File Name', uid: 'Key'},
        {name: 'Last Modified', uid: 'LastModified'},
        {name: 'Size', id:'Size'}
    ];


    return(
        <Flex direction={'column'} gap={20}>
            <View>
                <Heading level={1}>Upload Asset to AWS S3</Heading>
                <Content>
                    <Heading level={3}>Insctructions</Heading>
                    <Text>This is a list of the files availables in AWS S3. These files can be used in the Photoshop API calls. You are welcome to upload new files to test with. Simply click on the "Select a file" button to add to this folder. </Text>
                </Content>
            </View>
            <View>
                <Flex direction={'row'} gap={10} alignItems={'center'}>
                    <View>
                        <FileTrigger onSelect={(e)=> handleFileSelection(e)}>
                            <Button>Select a file</Button>
                        </FileTrigger>
                    </View>
                    <View>
                        <Text>{selectedFileName}</Text>
                    </View>
                    <View>
                        <Button variant="cta" isHidden={selectedFileName === null ? true : false} onPress={() => handleUpload()}>Upload</Button>
                    </View>
                </Flex>
            </View>
            <View>
                { showTable === true && 
                <>
                    <Heading>Avilable Files</Heading>
                    <TableView width={'100%'}>
                        <TableHeader columns={columns}>
                            {(column) => (
                                <Column key={column.uid}>{column.name}</Column>
                            )}
                        </TableHeader>
                        <TableBody items={fileList}>
                            {(item) => (
                                <Row>
                                    {(columnKey) => <Cell>{item[columnKey]}</Cell>}
                                </Row>
                            )}
                        </TableBody>
                    </TableView>
                </>
                
                }
            </View>
        </Flex>
        
    );
}
export default UploadAssetS3;
