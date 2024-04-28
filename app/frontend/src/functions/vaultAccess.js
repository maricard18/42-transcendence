
export var vaultClient = require("node-vault")({
    apiVersion: 'v1',
    endpoint: process.env.VAULT_ADDR
});

export async function vaultConnect () {
    if (vaultClient.token === undefined) {
        const vaultResponse = await vaultClient.approleLogin({ role_id: process.env.VAULT_ROLE_ID, secret_id: process.env.VAULT_SECRET_ID });
        vaultClient.token = vaultResponse.auth.client_token;
    }
}

export function encodeData(data) {
    return Buffer.from(data).toString('base64');
}

export async function transitEncrypt(data) {
    await vaultConnect();
    const response = await vaultClient.write('transit/encrypt/transcendence', { plaintext: encodeData(data) });
    return response.data.ciphertext;
}
