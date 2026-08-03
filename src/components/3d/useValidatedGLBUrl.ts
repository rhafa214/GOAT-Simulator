import { useEffect } from 'react';

const cache = new Map<string, string>();
const errorCache = new Map<string, Error>();
const promiseCache = new Map<string, Promise<string>>();

async function fetchAndValidateGLB(url: string): Promise<string> {
  const response = await fetch(url);
  
  console.log(`GLB Validation - URL: ${url}`);
  console.log(`GLB Validation - Status: ${response.status}`);
  
  const contentType = response.headers.get('content-type');
  const contentLength = response.headers.get('content-length');
  
  console.log(`GLB Validation - Content-Type: ${contentType}`);
  console.log(`GLB Validation - Content-Length: ${contentLength}`);

  if (response.status !== 200) {
    throw new Error(`Failed to fetch GLB: Status ${response.status}`);
  }
  
  if (contentType && contentType.includes('text/html')) {
    throw new Error('Corrupted GLB file. Received HTML instead of binary data. Please re-export from Tripo/Blender as a valid binary GLB.');
  }
  
  const buffer = await response.arrayBuffer();
  
  if (buffer.byteLength < 20) {
    throw new Error('Corrupted GLB file. File is too small. Please re-export from Tripo/Blender as a valid binary GLB.');
  }
  
  const magicBytes = new Uint8Array(buffer, 0, 4);
  const magicString = String.fromCharCode(...magicBytes);
  
  console.log(`GLB Validation - Magic Bytes: ${magicString}`);
  
  if (magicString !== 'glTF') {
    throw new Error('Corrupted GLB file. Invalid magic header. Please re-export from Tripo/Blender as a valid binary GLB.');
  }
  
  const blob = new Blob([buffer], { type: 'model/gltf-binary' });
  return URL.createObjectURL(blob);
}

export function useValidatedGLBUrl(url: string): string {
  if (errorCache.has(url)) {
    throw errorCache.get(url);
  }
  if (cache.has(url)) {
    return cache.get(url)!;
  }
  if (!promiseCache.has(url)) {
    const promise = fetchAndValidateGLB(url).then(
      (blobUrl) => {
        cache.set(url, blobUrl);
        promiseCache.delete(url);
        return blobUrl;
      },
      (err) => {
        errorCache.set(url, err);
        promiseCache.delete(url);
        throw err;
      }
    );
    promiseCache.set(url, promise);
  }
  throw promiseCache.get(url);
}
