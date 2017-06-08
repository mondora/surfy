import request = require("request");

import {SPELL_CHECK_API_KEY, SPELL_CHECK_API_URL} from "../config";

export function getCorrectedText (text: string): Promise<string> {
    return new Promise(
        (resolve, reject) => {
            if (text) {
                const requestData = {
                    url: SPELL_CHECK_API_URL,
                    headers: {
                        "Ocp-Apim-Subscription-Key": SPELL_CHECK_API_KEY
                    },
                    form: {
                        text: text
                    },
                    json: true
                };
                request.post(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else if (response.statusCode !== 200) {
                        reject(body);
                    } else {
                        let previousOffset = 0;
                        let result = "";
                        for (const element of body.flaggedTokens){
                            // Append the text from the previous offset to the current misspelled word offset
                            result += text.substring(previousOffset, element.offset);
                            // Append the corrected word instead of the misspelled word
                            result += element.suggestions[0].suggestion;
                            // Increment the offset by the length of the misspelled word
                            previousOffset = element.offset + element.token.length;
                        }
                        // Append the text after the last misspelled word.
                        if (previousOffset < text.length) {
                            result += text.substring(previousOffset);
                        }
                        resolve(result);
                    }
                });
            } else {
                resolve(text);
            }
        }
    );
}
