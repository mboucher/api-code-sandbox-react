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

import { generateIMSToken } from "./ims-client";
import { FIREFLY_API_KEY, FIREFLY_BASE_URL } from './secrets';
import { displayError } from './display-utils';


/**
 * Function that dynamically builds the header needed to execute Firefly API calls
 * @returns {Object} an HTTP header object which includes a generated access token.
 */
const buildHeader = async () => {
    const accessToken = await generateIMSToken('firefly');
    const header = {
      "Authorization": `Bearer ${accessToken}`,
      "x-api-key": FIREFLY_API_KEY,
      "Content-Type":"application/json"
    };
    return header;
  }

/**
 * Convenience function that can be used to generate random seed values.
 * @returns Random seed number between 1 & 999999.
 */
export const getRandomSeedValue = () => {
    const min = 1;
    const max = 999999;
    return Math.random() * (max - min) + min;
  }


/**
 * Global function used to execute HTTP requests to Firefly API. Uses the built-in Fetch javascript library
 * @param {String} endpoint - The API endpoint (e.g. /v2/images/generate for the Text to Image API) 
 * @param {Object} body - The content that will be sent to the API. This can be JSON, or a binary file
 * @param {String} mode - Default = 'reference'. The mode flag is used to mutate the request headers and body based on API requirements.
 *        supported modes: 'reference', 'file', 'base64'
 */
export const httpRequest = async (endpoint, body, mode='reference') => {
    try {
      const header = await buildHeader();
      const requestInfo = {
        method: "POST",
        headers: header
      };

      // Configure the HTTP request based on the API requirements.
      // See: https://firefly-api-beta.redoc.ly/openapi/openapi/operation/v1/images/generations
      let formData = null;
      switch(mode){
        case 'file': 
            console.log('uploading');
          formData = new FormData();
          formData.append('image', body);
          requestInfo.headers['Content-Type'] = body.type;
          requestInfo.body = body;
          break;
        case 'reference':
          requestInfo.body = JSON.stringify(body);
          break;
        case 'base64':
          requestInfo.headers['Accept'] = 'application/json+base64';
          requestInfo.headers['x-accept-mimetype'] = 'image/png';
          requestInfo.body = JSON.stringify(body);
          break;
      };

      // Make the call
      const res = await fetch(`${FIREFLY_BASE_URL}${endpoint}`, requestInfo);
      
      // Handle the response 
      const payload = await res.json();
      return payload;
    } catch (e) {
      displayError(`API REQUEST ERROR: Unable to execute API call, ${e}`);
    }
}

/**
 * Global convenience function used to upload transient assets to Firefly backend.
 * @param {File} file to upload
 * @returns {Array} An array of image references.
 */
export const fileUpload = async (file) => {;
    const payload = await httpRequest('/v2/storage/image',file, 'file');
    const results = payload.images[0].id;
    return results;
}