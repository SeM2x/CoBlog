'use server';

import { SignJWT } from 'jose';
import { getUserBlogs, getUserCoAuthoredBlogs } from '../actions/blogs';

export default async function generateTipTapToken(
  userId: string,
  secretToken: string
) {
  const secret = new TextEncoder().encode(secretToken);
  const blogs = (await getUserBlogs()).data || [];
  const coblogs = (await getUserCoAuthoredBlogs()).data || [];

  const allowedDocumentNames = [...blogs, ...coblogs].map((blog) => blog._id);
  const data = {
    sub: userId,
    allowedDocumentNames,
  };

  const jwt = await new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' }) // Set algorithm and type
    .setIssuedAt() // Add issued at timestamp
    .setExpirationTime('24h') // Set expiration time (e.g., 2 hours)
    .sign(secret); // Sign the JWT with the secret key
  return jwt;
}
