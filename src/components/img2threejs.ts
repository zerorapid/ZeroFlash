/**
 * img2threejs Procedural 3D Object Generator (Code-Only Three.js)
 * Conforming to Prompt 3 in MASTER_REFERENCE_MANUAL.md
 * Generates lightweight, procedural THREE.Group instances without external .gltf asset downloads.
 */

export interface ProceduralConfig {
  color?: string;
  metalness?: number;
  roughness?: number;
  wireframe?: boolean;
  scale?: number;
}

/**
 * Procedural Luxury Embossed 3D Card / Slab with Chamfered Geometry & Shader Sheen
 */
export function createProcedural3DCard(THREE: any, config: ProceduralConfig = {}) {
  const group = new THREE.Group();
  const baseColor = config.color ? new THREE.Color(config.color) : new THREE.Color(0x1d1d1f);

  // Main Card Body (Rounded Box or Extruded Shape)
  const shape = new THREE.Shape();
  const w = 3.375; // Standard ISO card ratio
  const h = 2.125;
  const r = 0.18; // Corner radius
  const x = -w / 2;
  const y = -h / 2;

  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  const extrudeSettings = {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();

  // Premium Physical Material
  const material = new THREE.MeshPhysicalMaterial({
    color: baseColor,
    metalness: config.metalness ?? 0.85,
    roughness: config.roughness ?? 0.18,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9,
    wireframe: !!config.wireframe,
  });

  const cardMesh = new THREE.Mesh(geometry, material);
  group.add(cardMesh);

  // Holographic Metallic Chip / Badge
  const chipGeo = new THREE.PlaneGeometry(0.5, 0.4);
  const chipMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xf5a623), // Gold
    metalness: 0.95,
    roughness: 0.1,
  });
  const chipMesh = new THREE.Mesh(chipGeo, chipMat);
  chipMesh.position.set(-1.0, 0.2, 0.05 + 0.01);
  group.add(chipMesh);

  if (config.scale) {
    group.scale.setScalar(config.scale);
  }

  return group;
}

/**
 * Procedural Iridescent Liquid Orb with Fresnel Rim Light
 */
export function createProceduralLiquidOrb(THREE: any, config: ProceduralConfig = {}) {
  const group = new THREE.Group();
  const baseColor = config.color ? new THREE.Color(config.color) : new THREE.Color(0xff385c);

  // High-Density Sphere
  const geometry = new THREE.SphereGeometry(1.2, 48, 48);
  const material = new THREE.MeshPhysicalMaterial({
    color: baseColor,
    metalness: config.metalness ?? 0.1,
    roughness: config.roughness ?? 0.12,
    transmission: 0.6, // Glass transparency
    ior: 1.5, // Refraction index
    thickness: 0.8,
    wireframe: !!config.wireframe,
  });

  const orbMesh = new THREE.Mesh(geometry, material);
  group.add(orbMesh);

  // Outer Orbital Energy Rings
  const ringGeo = new THREE.TorusGeometry(1.6, 0.015, 16, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x0071e3),
    wireframe: true,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 3;
  group.add(ring);

  if (config.scale) {
    group.scale.setScalar(config.scale);
  }

  return group;
}
