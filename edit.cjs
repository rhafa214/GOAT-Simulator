const fs = require('fs');
let content = fs.readFileSync('src/components/3d/AvatarGLTFModel.tsx', 'utf8');

content = content.replace(/const blobUrl = useValidatedGLBUrl\(url\);.*?const { scene, materials, animations } = useGLTF\(blobUrl\);/s, 
`const validatedUrl = useValidatedGLBUrl(url);

  console.log('AvatarGLTFModel - Received URL:', url);
  console.log('AvatarGLTFModel - Final URL for useGLTF:', validatedUrl);

  const { scene, materials, animations } = useGLTF(validatedUrl);`);

fs.writeFileSync('src/components/3d/AvatarGLTFModel.tsx', content);
