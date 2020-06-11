import * as UUID from 'uuid'
import crypto from 'crypto'
import stringify from 'json-stable-stringify'

export type Data = string | Buffer
export type Algorithm = 'sha224' | 'sha256' | 'sha384' | 'sha512'
export type Encoding = 'hex' | 'base64'

/** Create a SHA384 digest from a string or Buffer.
 * @param data String or Buffer to be hashed.
 */
export function hash(data: Data): Buffer

/** Create a hash digest from a string or Buffer.
 * @param data String or Buffer to be hashed.
 * @param algorithm Hashing algorithm.
 */
export function hash(data: Data, algorithm: Algorithm): Buffer

/** Create a hash digest from a string or Buffer.
 * @param data String or Buffer to be hashed.
 * @param algorithm Hashing algorithm - default is sha256.
 * @param encoding Output encoding-  default is base64.
 */
export function hash(
  data: Data,
  algorithm: Algorithm,
  encoding: Encoding
): string

/** Implementation of the above. */
export function hash(
  data: Data,
  algorithm: Algorithm = 'sha256',
  encoding: Encoding = 'base64'
): Data {
  return crypto.createHash(algorithm).update(data).digest(encoding)
}

/** Create a UUID from a string or Buffer.
 * @param data String or Buffer to be hashed.
 * @param algorithm Hashing algorithm - default is sha256.
 */
export function uuid(data: Data, algorithm: Algorithm = 'sha256'): Data {
  const json = stringify(data)
  const digest = hash(json, algorithm)
  return UUID.v4({random: Array.from(digest.slice(0, 16))})
}
