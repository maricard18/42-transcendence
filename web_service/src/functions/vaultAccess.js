export var vaultClient = require("node-vault")({
    apiVersion: 'v1',
    endpoint: 'https://' + window.location.hostname + ':8200',
    requestOptions: {
        strictSSL: false
    }
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

export function decodeData(data) {
    return Buffer.from(data, 'base64').toString('utf8');
}

export async function transitEncrypt(data) {
	try {
		await vaultConnect();

		const response = await vaultClient.write(
			'transit/encrypt/transcendence',
			{plaintext: encodeData(data)}
		);

		return response.data.ciphertext;
	} catch (error) {
		return null;
	}
}

export async function transitDecrypt(data) {
	try {
		await vaultConnect();

		const response = await vaultClient.write(
			'transit/decrypt/transcendence',
			{ciphertext: data}
		);

		return decodeData(response.data.plaintext);
	} catch (error) {
		return null;
	}
}
