import fs from 'fs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// We are in node, loading three/examples might be tricky without a full DOM.
// We can just calculate the bounding box directly from the accessor min/max in JSON.
