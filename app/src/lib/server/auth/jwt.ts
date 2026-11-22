import { SignJWT, jwtVerify } from "jose";
import { JWT_SECRET } from "$env/static/private";

const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function generateToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey);
}

export async function verifyToken(token){
  try{
    const {payload} = await jwtVerify(token, secretKey)
    return payload
  }catch(err){
    return null
  }
}
