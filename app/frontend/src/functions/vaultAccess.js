
export var vaultClient = require("node-vault")({
    apiVersion: 'v1',
    endpoint: 'http://127.0.0.1:8200' // change to environment variable
});

export async function connectToVault () {
    if (vaultClient.token === undefined) {
        const roleId   = 'e963469c-0f50-ac2d-b542-f19e78407b82'; // change to environment variable
        const secretId = '679f2964-eaf6-857c-e1a9-29b6c5e5b39e'; // change to environment variable
        const vaultResponse = await vaultClient.approleLogin({ role_id: roleId, secret_id: secretId });
        vaultClient.token = vaultResponse.auth.client_token;
    }
}

export function convertFormDataToJSON(data) {
    const formDataObject = {};
    data.forEach((value, key) => {
        formDataObject[key] = value;
    });
    return JSON.stringify(formDataObject);
}

export function encodeData(data) {
    return Buffer.from(data).toString('base64');
}

export async function vaultEncryptData(data) {
    await connectToVault();
    data = convertFormDataToJSON(data);
    return await vaultClient.write('transit/encrypt/transcendence', { plaintext: encodeData(data) }); // change to environment variable
}
