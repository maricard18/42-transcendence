
export var vaultClient = require("node-vault")({
    apiVersion: 'v1',
    endpoint: 'http://127.0.0.1:8200' // TODO change to environment variable
});

export async function connectToVault () {
    if (vaultClient.token === undefined) {
        const token = 'YXzVXxaRqzT!W3tB-SR?{qL{o)mkBw9D-EdK@R1a}Wb]88Vdme'; // TODO change to environment variable
        vaultClient.token = token;

        // Login with AppRole
        // const roleId   = 'role-id';
        // const secretId = 'secret-id';
        // const vaultResponse = await vaultClient.approleLogin({ role_id: roleId, secret_id: secretId });
        // vaultClient.token = vaultResponse.auth.client_token;
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
