import CryptoJS from 'crypto-js'

function getCryptKey (password: string) {
  if (!password) {
    throw new Error('No password.')
  }

  return CryptoJS.MD5(password).toString().substr(0, 16)
}

export function encrypt (content: any, password: string) {
  let key: any = getCryptKey(password)
  let iv: any = key
  const passwordHash = CryptoJS.MD5(key).toString()

  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)

  const encrypted = CryptoJS.AES.encrypt(content, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  return { content: encrypted.toString(), passwordHash }
}

export function decrypt (content: any, password: string) {
  let key: any = getCryptKey(password)
  let iv: any = key
  const passwordHash = CryptoJS.MD5(key).toString()

  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)

  const decrypted = CryptoJS.AES.decrypt(content.trim(), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  const result = CryptoJS.enc.Utf8.stringify(decrypted)
  if (!result) {
    throw new Error('Decrypt failed.')
  }

  return { content: result, passwordHash }
}

export function license (expires: string, info: any) {
  info ??= {}
  expires ??= '9999-12-31'
  info.expires = info.activateExpires = new Date(expires).getTime()
  const license = 'yank-note-license' + JSON.stringify(info)
  const password = CryptoJS.MD5('').toString()
  const { content } = encrypt(license, password)
  let licenseStr = CryptoJS.enc.Utf8.parse(password + content).toString(CryptoJS.enc.Hex)
  licenseStr = licenseStr.split('').reverse().join('')
  return licenseStr
}
