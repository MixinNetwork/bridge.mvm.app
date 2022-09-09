import forge from 'node-forge';
import { v4 as uuid } from 'uuid';

export function unix(): number {
	return Math.floor(new Date().getTime() / 1000);
}

function toBuffer(content: string | Object, encoding: BufferEncoding = 'utf8') {
	let msg = typeof content === 'object' ? JSON.stringify(content) : content;
	return Buffer.from(msg, encoding);
}

function base64url(buffer: Buffer) {
	return buffer.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function getEd25519Sign(payload: Object, privateKey: Buffer) {
	const header = toBuffer({ alg: 'EdDSA', typ: 'JWT' }).toString('base64');

	payload = base64url(toBuffer(payload));
	const result = [header, payload];
	const sign = base64url(
		Buffer.from(
			forge.pki.ed25519.sign({
				encoding: 'utf8',
				message: result.join('.'),
				privateKey
			})
		)
	);

	result.push(sign);

	return result.join('.');
}

export function signAuthenticationToken(
	clientId: string,
	sessionId: string,
	privateKey: string,
	method: string,
	uri: string,
	data: Record<string, unknown> | string,
	scp = 'FULL',
	expire = unix() + 30 * 60
): string {
	if (typeof data === 'object') {
		data = JSON.stringify(data);
	} else if (typeof data !== 'string') {
		data = '';
	}

	const _md = forge.md.sha256.create();

	_md.update(forge.util.encodeUtf8(method.toUpperCase() + uri + data));
	const _privateKey = toBuffer(privateKey, 'base64');
	const jwtPayload = {
		exp: expire,
		iat: unix(),
		jti: uuid(),
		scp: scp || 'FULL',
		sid: sessionId,
		sig: _md.digest().toHex(),
		uid: clientId
	};

	return getEd25519Sign(jwtPayload, _privateKey);
}
