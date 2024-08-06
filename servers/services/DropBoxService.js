const { Dropbox } = require('dropbox');
const path = require('path')

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch });

const uploadFile = async (filePath, fileContent) => {
    try {
        // Convert the Windows-style path to a Unix-style path
        const dropboxPath = `/routes/uploads/${path.basename(filePath)}`;

        const response = await dbx.filesUpload({
            path: dropboxPath,
            contents: fileContent,
        });

        const { path_lower } = response.result;


        // Create a shared link for the uploaded file
        const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
            path: path_lower,
        });


        // Ensure `sharedLinkResponse.result.url` is defined before calling `replace`
        const sharedLinkUrl = sharedLinkResponse.result.url;
        if (!sharedLinkUrl) {
            throw new Error('Shared link response is missing URL');
        }

        return {
            ...response,
            link: sharedLinkUrl.replace('?dl=0', '?raw=1'), // Modify the link to get a direct download link
        };
    } catch (error) {
        console.error('Error uploading file to Dropbox:', error);
        throw error;
    }
};

module.exports = {
    uploadFile
};
 