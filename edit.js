const fs = require('fs');

// Edit useValidatedGLBUrl.ts
let useValidatedGLBUrlContent = fs.readFileSync('src/components/3d/useValidatedGLBUrl.ts', 'utf8');
useValidatedGLBUrlContent = useValidatedGLBUrlContent.replace(
  /  const blob = new Blob.*?return url;/s,
  '  return url;'
);
fs.writeFileSync('src/components/3d/useValidatedGLBUrl.ts', useValidatedGLBUrlContent);

// Edit AvatarGLTFModel.tsx
let avatarGLTFModelContent = fs.readFileSync('src/components/3d/AvatarGLTFModel.tsx', 'utf8');

// Replace the hook usage and logs
avatarGLTFModelContent = avatarGLTFModelContent.replace(
  /  \/\/ Validate and fetch the GLB securely before passing to GLTFLoader\n  const blobUrl = useValidatedGLBUrl\(url\);\n  \/\/ Load the GLTF. \n  \/\/ It throws a promise which is caught by the parent <Suspense>.\n  const { scene, materials, animations } = useGLTF\(blobUrl\);/g,
  `  // Validate and fetch the GLB securely before passing to GLTFLoader
  const validatedUrl = useValidatedGLBUrl(url);

  console.log('AvatarGLTFModel - Received URL:', url);
  console.log('AvatarGLTFModel - Validated URL for useGLTF:', validatedUrl);
  if (url === validatedUrl) {
    console.log('AvatarGLTFModel - URLs match exactly.');
  }

  // Load the GLTF. 
  // Clear cache if needed for diagnostics, but typically we want it cached.
  // useGLTF.clear(validatedUrl);

  const { scene, materials, animations } = useGLTF(validatedUrl);`
);

fs.writeFileSync('src/components/3d/AvatarGLTFModel.tsx', avatarGLTFModelContent);
