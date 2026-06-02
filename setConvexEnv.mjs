import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const JWT_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCveev0Sc2DyxEc
g4xphtgbRQVsYWybKEumtWWRlnl1F/+ATNCAuUMJgQ4azWgF/GdQF5pQR/vquyhD
S3F2/8yze6RICBuUrs6ZYDgaKmyyIJguxxsIzjbDdVVDNxP+K1gN6NNt0087Hwsh
UO/Wot7aoh/wkagXH2vPKQkEVM9PhAEEbaonWb3WprjSesivp9b2lToNoTJOJdUH
8CpH7oWN1yyk8cT7T+qEwJQjCN9JOHNI0uGVTCyoLYTfYu84AA37WgxmN2DV0F1c
bopLk1nkAteRrMjsBkApUCyh+sQnNvSc0W0W3A4h/9cLnk3HUY3ffUxlaKg9zmAy
POpJ6DoFAgMBAAECggEAA8PPWWtvD+/T/O+guJpz7vugPEYO10B9viSzwYJ1UqlF
7cPGXskayakU22Pp8KtiBWisO3gOImgnk8WaRp3luh1wOXPc26DM9xTNv1gxdJwK
pEj1GsEmWE/mfL96VKsrZ0HikTE3yL7V4C/lJXJTI7plppdex1SrlkNEINDiWHYI
2IWoSbhojtyQCm5QAZOCpPe9cn1wITIaKmqrlbWPO/CEWmP2KyD+O+G39xfM1jyO
sUDUaYXnbQ08/YY4p6MlcD5lqVK/klGZUmxX/3ODtz2j6szchKlPBaBKCGc38jIa
9huj/JIoItHKy5sHx/VJ0Mh4r/ajSUmPp4S1rl+cNQKBgQD0CXg0pI9kiN3Jy/cZ
GmVSlbH2G+sRenmU3xYC81SIQgD8bdqwlQ1BBEI/WO9Og/oyuaImRsiD9MUjfomS
1YWDpGtYs1NlFNohYID0BoLWkLbzA/sYuHq1rziBampABJ9sfcUIRw9ZMOyWnXdi
gPrja25rtlJjLJs4eiAGm+g1hwKBgQC4FA1x5utaRCJDYdhtWlG1oV53YrEj4y/W
EHcm4IVDzh4HjRuhcN8b660b0WekgejRMRxSF19q6Ka9Pd/xdXg4cQ7X1ql6x9lk
awwJP8rk72aWNOh95bwbrGgKaSk+Tz+grl0SGL13h8FK5bKXd6oxWT4g1RQuYjmj
m7nKdYH3EwKBgFDd1nRzV4T0CbK2IRKzeYHtUwR/6dxn3mQjrLKbmZZxcMw1RvOe
4L57v8woF1zIRR+L/hx69jUr5ivF4abDlLOzx1KkUe08BLBsvy6d/btGRymuVwWx
FBCimLHh5oWCQqX740/D5GUk3jFmysncfcbgsb2FtDVi8ai8Z2JpRYB/AoGAPTsu
Xb0afKQ9YXyiqX1pwKk06zGBCxb/So2flOcKbUua4ZgmoMUS8g6rPp2hhC9SaoOT
kBsGOmG5VSnH3GHe46d38IQPTDA+OBEDp+/4Zb7cuQpQa9CHig0Hbq8ccQWbfK+D
dgmUvLYDrg5KIehETLYK3JEEbYlu8uVSH+6GlNECgYEAmdztH/bxO2sKCdt27mhY
fc4atxB/4sf1HNSVOzvqRHO7S4ZY08+12hHdZTDmdYAg87UoBxHCjMs04oPPvs4c
HVfy3hGZAGR8QXjeTnxaAfTuMewMyGwwMwV9HhDJ8TQfhm3e6uu7Mdg6TOlWnehg
TorEtvP4xCfAf4lQ978qku8=
-----END PRIVATE KEY-----`;

const JWKS = '{"keys":[{"use":"sig","kty":"RSA","n":"r3nr9EnNg8sRHIOMaYbYG0UFbGFsmyhLprVlkZZ5dRf_gEzQgLlDCYEOGs1oBfxnUBeaUEf76rsoQ0txdv_Ms3ukSAgblK7OmWA4GipssiCYLscbCM42w3VVQzcT_itYDejTbdNPOx8LIVDv1qLe2qIf8JGoFx9rzykJBFTPT4QBBG2qJ1m91qa40nrIr6fW9pU6DaEyTiXVB_AqR-6FjdcspPHE-0_qhMCUIwjfSThzSNLhlUwsqC2E32LvOAAN-1oMZjdg1dBdXG6KS5NZ5ALXkazI7AZAKVAsofrEJzb0nNFtFtwOIf_XC55Nx1GN331MZWioPc5gMjzqSeg6BQ","e":"AQAB"}]}';

// Write a temporary .env file and use npx convex env push
const tmpFile = join(process.cwd(), ".env.convex.tmp");
const singleLineKey = JWT_PRIVATE_KEY.trim().replace(/\n/g, "\\n");
const envContent = `JWT_PRIVATE_KEY=${singleLineKey}\nJWKS=${JWKS}\n`;
writeFileSync(tmpFile, envContent, "utf8");

console.log("Temp env file written. Now importing into Convex...");
try {
  execSync(`npx convex env set JWT_PRIVATE_KEY --input ${tmpFile}`, { stdio: "inherit" });
} catch {}

// Try setting using env var passthrough
process.env.JWT_PRIVATE_KEY = JWT_PRIVATE_KEY;
process.env.JWKS = JWKS;

// Use convex CLI's --input-file or env passthrough trick
try {
  execSync("npx convex env set JWT_PRIVATE_KEY", {
    stdio: "inherit",
    env: { ...process.env },
  });
  execSync("npx convex env set JWKS", {
    stdio: "inherit",
    env: { ...process.env },
  });
} catch (e) {
  console.error(e.message);
}

unlinkSync(tmpFile);
