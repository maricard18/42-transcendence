export var vaultClient = require("node-vault")({
    apiVersion: 'v1'
});

export async function vaultConnect() {
    if (vaultClient.token === undefined) {
        let vaultRoleId = process.env.VAULT_ROLE_ID || '';
        let vaultSecretId = process.env.VAULT_SECRET_ID || '';

        vaultRoleId = vaultRoleId.replace('\n', '');
        vaultSecretId = vaultSecretId.replace('\n', '')
        const vaultResponse = await vaultClient.approleLogin({
            role_id: vaultRoleId,
            secret_id: vaultSecretId
        });
        vaultClient.token = vaultResponse.auth.client_token;
    }
}

export function encodeData(data) {
    return Buffer.from(data).toString('base64');
}

export async function transitEncrypt(data) {
    await vaultConnect();
    const response = await vaultClient.write('transit/encrypt/transcendence', {plaintext: encodeData(data)});
    return response.data.ciphertext;
}