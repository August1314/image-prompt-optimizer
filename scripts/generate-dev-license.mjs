import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createSign } from 'node:crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DEV_LICENSE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
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

function canonicalizeLicense(input) {
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

function signDevLicense(input) {
  const signer = createSign('RSA-SHA256')
  signer.update(canonicalizeLicense(input))
  signer.end()
  return {
    ...input,
    signature: signer.sign(DEV_LICENSE_PRIVATE_KEY, 'base64'),
  }
}

const outputPath = process.argv[2] || path.join(__dirname, '..', 'private', 'dev-license.lic')
const issuedTo = process.argv[3] || 'Local Desktop Tester'

const document = signDevLicense({
  licenseId: `dev-${Date.now()}`,
  issuedTo,
  plan: 'desktop-buyout',
  issuedAt: new Date().toISOString(),
  perpetual: true,
})

await fs.mkdir(path.dirname(outputPath), { recursive: true })
await fs.writeFile(outputPath, JSON.stringify(document, null, 2), 'utf8')

console.log(`Dev license written to ${outputPath}`)
