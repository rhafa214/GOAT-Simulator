const shader = `
varying vec3 vWorldPosition;

// in vertex shader:
// vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

// in fragment shader:
// if (vWorldPosition.y > 0.8 && vWorldPosition.y < 1.3) {
//    gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0); // Black shirt
// }
`;
