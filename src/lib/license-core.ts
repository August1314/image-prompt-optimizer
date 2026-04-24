import { createPublicKey, createSign, createVerify } from 'crypto'
import type { LicenseStatus } from './desktop-types'

export interface LicenseDocument {
  licenseId: string
  issuedTo: string
  plan: string
  issuedAt: string
  expiresAt?: string
  perpetual?: boolean
  signature: string
}

export interface UnsignedLicenseDocument {
  licenseId: string
  issuedTo: string
  plan: string
  issuedAt: string
  expiresAt?: string
  perpetual?: boolean
}

export const DEV_LICENSE_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxWHJ51URfX2UpOPb2nM5
X2UzUTcqXEEVhL5Olxl0o49uT/53j1PdHn2UAJor6dt64WxbwzFdUQ0cfEyuVk1P
ePdhgr79NZZpylr/PJLbwAyNmYKNGhwZVYTIcGRAnKWvTRY5Xi90pjEjH0K8A325
YjmPkCTwgtRb6R2zwRYABDbPYpdow7SYXluPcEAIsEoIWfU76EWEGycOOSZLfP9l
Ab3XfETb1w+8mTvcjJ2OZc0Knpfqq34wO7anJeEaKbLwbLmNrF5lP0f89u9D0LHA
j3BLsy+7GppR6MNd7X9MUioSMnZQIPXCTp+elCzsJzksUdlkoQOI4InnfzhG762M
vQIDAQAB
-----END PUBLIC KEY-----`

export const DEV_LICENSE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFYcnnVRF9fZSk
49vaczlfZTNRNypcQRWEvk6XGXSjj25P/nePU90efZQAmivp23rhbFvDMV1RDRx8
TK5WTU9492GCvv01lmnKWv88ktvADI2Zgo0aHBlVhMhwZECcpa9NFjleL3SmMSMf
QrwDfbliOY+QJPCC1FvpHbPBFgAENs9il2jDtJheW49wQAiwSghZ9TvoRYQbJw45
Jkt8/2UBvdd8RNvXD7yZO9yMnY5lzQqel+qrfjA7tqcl4RopsvBsuY2sXmU/R/z2
70PQscCPcEuzL7samlHow13tf0xSKhIydlAg9cJOn56ULOwnOSxR2WShA4jgied/
OEbvrYy9AgMBAAECggEADAAYhuyInjES5v2FgeAMhmzANHlepXI9jS8G1y/wg/s1
8T4e5cNrB64J4Al/jv3NmEP+xjzLmCBscXA2D0AvC0M7Ffhnq6jj8K4co4GoQ6Jf
v4wM6R/5OFZU22R0+zElmdG2li/bbzlAked8R9gOe9bVECX2y3V+ywsHwT8FrDvP
cBbBIMqzwPEwYvQkqoP0wAPfUIyX0E2FURVI7Rt6kmUU4mMKrjiy7o6OP5AcX+5R
MZoT4TznZ36koZvHA00RZvdsJjwQKndglnpwTPLSh15KbO3ZLjFt/5gz+WQZD8Wk
LCAqmwIQ7PIlbnahOaol14utwtuq2Dz2DAUDiqFXUQKBgQDzH64rAr3N2Y3B4z5a
HLqT4JhinBSmuw1P3UgyrJPlFDQqCX+yXdLSy5bTJDDwd4F+v6eKHR5bkfc8JGgP
dSkqlRbmyWAizDT9hDDwT4oRpkJuHPJvfayy4DKpuLJ3G7GpEeYqPVFXK0ZF0HaY
Fcgp9bOMBuZ6s5HWmSA15N5jiQKBgQDP1e64d2Cz3JqTTMmuZ9TDNokxCN0oO2zP
UFxIAw3goXUJIjTrMw2+pMh7id/63UG9il6xnjnBCqHSwG02U0KSaKgS0Jq2UhRg
Ly8Y6q0QyCqy0KgBf8jDG5HrlTN5P61SwFxQ/TPLWaKAhw6omdFqE9WUVcoQl1BC
8zJnm8MulQKBgFfA3JWrtKSjXNZZ1nyiF/oePAKDwbR4mZJ1FYUs42jxBO8TZKMV
2G27jGIDkyKIkBYWyTtBzV5R7kIoBeNmb4huLcj5cJi+ynWjDCMBIp3CPAIQsrTp
ULdz0vWNs+Tn+xVCX6hpX32uIfw7BUNZwVjb1YW6S+CIBiDGPmkVheu5AoGBAIwJ
e6XzWccW91gUvzeyYlt+XYYakNlQ4Qn2/ZbP6APZBkC3OazYY4R3B1amGbKwbmFF
4HQRRpzZixuz6GJYS1zXA5hZ0kTSnUQJxtQlG6NZG9wMV4dbEGzWIMX5bAtgamp9
jjZLxSBZLvMnDStxKPcukhQ2kcYIDl5t+yJwg1zZAoGAeBPOo2798pXFhiE01Izt
ydhvwiC/UjFTUIeXd8dyWu/AWlY/qCoKs/rfcpGehey9Jnjj4irtA713MvaGVmY4
ryqUXuW5B0rEodrII6AfPbgAhJSGTshxNnOm6jcfaZKVvlKILqpvXDbj2b4DDiXi
OVwdzMjvdkxKGOREVbKm46A=
-----END PRIVATE KEY-----`

export const PRODUCTION_LICENSE_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA9KoDnt1z36TapNx/q1ou
NYc1HGwWUPPc/mKLg0BXdT0R0XvupJYDcWjymeWIarRjDWZoUDEzJWfmiopSMGXn
5xHNkZlwdbRRD0G8TQK/XBLFe4qxTOuR8FOhzIu84RrWFBJEzb8MAX94XFVyGb/H
kVcJBewADgmFnc6Q4qCyM4v5eKYJUFfiQb17EEeQDFJoUTuXUKfVBe5jjifJPRYk
0m2/dNztroOl8GjTjZ7BMu6JH0W9UXx6Sv9SBZZCIt7ocAuUy2hTXKy8O+hmxzTr
Ss/hqGaH8366Xxx/xLnfNjUnHzdx8/h1GbC1JO/Yy6aXUAK5KC+IlHh9PLs0fIzz
VQIDAQAB
-----END PUBLIC KEY-----`

export function canonicalizeLicense(input: UnsignedLicenseDocument) {
  return JSON.stringify(
    {
      licenseId: input.licenseId,
      issuedTo: input.issuedTo,
      plan: input.plan,
      issuedAt: input.issuedAt,
      expiresAt: input.expiresAt ?? null,
      perpetual: Boolean(input.perpetual),
    },
    null,
    0,
  )
}

export function parseLicenseDocument(raw: string): LicenseDocument {
  return JSON.parse(raw) as LicenseDocument
}

export function signLicenseDocument(input: UnsignedLicenseDocument, privateKeyPem: string): LicenseDocument {
  const signer = createSign('RSA-SHA256')
  signer.update(canonicalizeLicense(input))
  signer.end()
  return {
    ...input,
    signature: signer.sign(privateKeyPem, 'base64'),
  }
}

export function signDevLicense(input: UnsignedLicenseDocument): LicenseDocument {
  return signLicenseDocument(input, DEV_LICENSE_PRIVATE_KEY)
}

export function verifyLicenseDocument(document: LicenseDocument, publicKeyPem: string): LicenseStatus {
  const requiredFields = ['licenseId', 'issuedTo', 'plan', 'issuedAt', 'signature'] as const
  for (const field of requiredFields) {
    if (!document[field]) {
      return {
        licensed: false,
        error: `License file is missing required field: ${field}.`,
      }
    }
  }

  const verifier = createVerify('RSA-SHA256')
  verifier.update(
    canonicalizeLicense({
      licenseId: document.licenseId,
      issuedTo: document.issuedTo,
      plan: document.plan,
      issuedAt: document.issuedAt,
      expiresAt: document.expiresAt,
      perpetual: document.perpetual,
    }),
  )
  verifier.end()

  const verified = verifier.verify(createPublicKey(publicKeyPem), document.signature, 'base64')
  if (!verified) {
    return {
      licensed: false,
      error: 'License signature verification failed.',
    }
  }

  if (!document.perpetual && document.expiresAt) {
    const expiresAt = Date.parse(document.expiresAt)
    if (Number.isNaN(expiresAt)) {
      return {
        licensed: false,
        error: 'License expiration date is invalid.',
      }
    }

    if (expiresAt < Date.now()) {
      return {
        licensed: false,
        error: 'License has expired.',
        issuedTo: document.issuedTo,
        plan: document.plan,
        expiresAt: document.expiresAt,
      }
    }
  }

  return {
    licensed: true,
    issuedTo: document.issuedTo,
    plan: document.plan,
    expiresAt: document.expiresAt,
    perpetual: Boolean(document.perpetual),
  }
}
