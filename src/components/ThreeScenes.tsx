import React, { useEffect, useRef, useState } from "react";
import {
  Rotate3d,
  Minimize2,
  Cpu,
  Zap,
  Globe,
  Activity,
  Box,
  Radio,
  Sliders,
  Sparkles,
} from "lucide-react";
import { ensureThree } from "./threeUtils";

// =========================================================================
// 1. GLOBAL 3D BACKGROUND (Apple Studio Ambient Floating Glass & Silver Nodes)
// =========================================================================
export function Global3DBackground({ wireframeMode = false }: { wireframeMode?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number;
    let renderer: any = null;
    let scene: any = null;
    let camera: any = null;
    let particlesMesh: any = null;
    let floatingMeshes: any[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0006;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0006;
    };

    const handleScroll = () => {
      scrollY = window.scrollY * 0.0006;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    ensureThree().then((THREE) => {
      if (!THREE || !containerRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 2000);
      camera.position.z = 550;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);

      // Create Apple Studio Spatial Nodes (Silver, Titanium, Pearl, Coral Accent)
      const particleCount = 850;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorPalette = [
        new THREE.Color("#8E8E93"), // Apple Gray
        new THREE.Color("#0071E3"), // Apple Blue
        new THREE.Color("#FF385C"), // Airbnb Coral
        new THREE.Color("#D1D5DB"), // Pearl Silver
      ];

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 1600;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1600;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1200;

        const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      // Circular soft studio particle texture
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        grad.addColorStop(0.3, "rgba(142, 142, 147, 0.6)");
        grad.addColorStop(0.8, "rgba(209, 213, 219, 0.2)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
      }
      const pTexture = new THREE.CanvasTexture(canvas);

      const pMaterial = new THREE.PointsMaterial({
        size: 4.5,
        map: pTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      });

      particlesMesh = new THREE.Points(geometry, pMaterial);
      scene.add(particlesMesh);

      // 5 Floating Studio Polyhedra (Clean architectural wireframes)
      const polyGeometries = [
        new THREE.IcosahedronGeometry(55, 1),
        new THREE.OctahedronGeometry(45, 0),
        new THREE.DodecahedronGeometry(50, 0),
        new THREE.TorusGeometry(40, 10, 16, 50),
      ];

      for (let i = 0; i < 5; i++) {
        const geom = polyGeometries[i % polyGeometries.length];
        const mat = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0x8e8e93 : 0x0071e3,
          wireframe: true,
          transparent: true,
          opacity: 0.12,
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(
          (Math.random() - 0.5) * 1100,
          (Math.random() - 0.5) * 900,
          (Math.random() - 0.5) * 500
        );
        mesh.userData = {
          rx: (Math.random() - 0.5) * 0.008,
          ry: (Math.random() - 0.5) * 0.012,
          rz: (Math.random() - 0.5) * 0.008,
          baseY: mesh.position.y,
          speed: 0.001 + Math.random() * 0.0015,
        };
        scene.add(mesh);
        floatingMeshes.push(mesh);
      }

      const handleResize = () => {
        if (!camera || !renderer) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      // Animation Loop
      let time = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        time += 0.008;

        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        camera.position.x = targetX * 350;
        camera.position.y = -targetY * 350 - scrollY * 180;
        camera.position.z = 550 + Math.sin(time * 0.5) * 15 - scrollY * 120;
        camera.lookAt(0, -scrollY * 180, 0);

        if (particlesMesh) {
          particlesMesh.rotation.y = time * 0.02;
          particlesMesh.rotation.x = time * 0.01;
        }

        floatingMeshes.forEach((mesh, idx) => {
          mesh.rotation.x += mesh.userData.rx;
          mesh.rotation.y += mesh.userData.ry;
          mesh.rotation.z += mesh.userData.rz;
          mesh.position.y = mesh.userData.baseY + Math.sin(time + idx * 2) * 25;
        });

        renderer.render(scene, camera);
      };

      animate();
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      if (renderer && renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [wireframeMode]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: wireframeMode ? 0.7 : 0.45 }}
    />
  );
}

// =========================================================================
// 2. HERO 3D QUANTUM CORE (Apple Keynote Frosted Glass & Titanium Sculpture)
// =========================================================================
export type CoreGeometryType = "knot" | "icosahedron" | "dodeca" | "ring";

export function Hero3DQuantumCore() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [activeShape, setActiveShape] = useState<CoreGeometryType>("knot");
  const [wireframe, setWireframe] = useState(false);
  const [dispersal, setDispersal] = useState(0);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [telemetry, setTelemetry] = useState({
    fps: 60,
    vertices: 18420,
    faces: 9210,
    quantumFreq: "4.82 THz",
  });

  const shapeRef = useRef(activeShape);
  shapeRef.current = activeShape;
  const wireframeRef = useRef(wireframe);
  wireframeRef.current = wireframe;
  const dispersalRef = useRef(dispersal);
  dispersalRef.current = dispersal;
  const speedRef = useRef(rotationSpeed);
  speedRef.current = rotationSpeed;

  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const manualRotRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animId: number;
    let renderer: any = null;
    let scene: any = null;
    let camera: any = null;
    let innerMesh: any = null;
    let outerCage: any = null;
    let ringGroup: any = null;
    let pointLight1: any = null;
    let pointLight2: any = null;

    ensureThree().then((THREE) => {
      if (!THREE || !canvasContainerRef.current) return;

      const width = canvasContainerRef.current.clientWidth || 520;
      const height = canvasContainerRef.current.clientHeight || 460;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 8.2;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      canvasContainerRef.current.appendChild(renderer.domElement);

      // Apple Studio Lighting Setup (Warm Key + Cool Soft Fill + Rim Light)
      const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
      scene.add(ambientLight);

      // Key Light: Pure daylight
      pointLight1 = new THREE.PointLight(0xffffff, 3.5, 30);
      pointLight1.position.set(5, 7, 5);
      scene.add(pointLight1);

      // Fill Light: Soft Apple Blue / Sky reflection
      pointLight2 = new THREE.PointLight(0x0071e3, 2.5, 30);
      pointLight2.position.set(-6, -4, 4);
      scene.add(pointLight2);

      // Accent Rim: Warm Airbnb Coral
      const rimLight = new THREE.PointLight(0xff385c, 2.0, 20);
      rimLight.position.set(0, -6, -4);
      scene.add(rimLight);

      // Geometry Builder Helper
      const createGeometry = (type: CoreGeometryType) => {
        switch (type) {
          case "knot":
            return new THREE.TorusKnotGeometry(1.6, 0.44, 128, 32, 2, 3);
          case "icosahedron":
            return new THREE.IcosahedronGeometry(2.1, 2);
          case "dodeca":
            return new THREE.DodecahedronGeometry(2.0, 1);
          case "ring":
            return new THREE.TorusGeometry(2.0, 0.38, 32, 100);
        }
      };

      // Outer Delicate Titanium Wireframe Cage
      const cageGeo = new THREE.IcosahedronGeometry(2.9, 1);
      const cageMat = new THREE.MeshBasicMaterial({
        color: 0x8e8e93,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      outerCage = new THREE.Mesh(cageGeo, cageMat);
      scene.add(outerCage);

      // Inner Core Mesh: Frosted Glass & Titanium Physical Material (Apple Look)
      const coreGeo = createGeometry(shapeRef.current);
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x0071e3,
        emissiveIntensity: 0.08,
        roughness: 0.12,
        metalness: 0.25,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        reflectivity: 0.85,
        wireframe: wireframeRef.current,
      });
      innerMesh = new THREE.Mesh(coreGeo, coreMat);
      scene.add(innerMesh);

      // Orbiting Apple Vision Gimbal Rings
      ringGroup = new THREE.Group();

      const ring1Geo = new THREE.TorusGeometry(3.6, 0.02, 16, 100);
      const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x0071e3, transparent: true, opacity: 0.4 });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      ringGroup.add(ring1);

      const ring2Geo = new THREE.TorusGeometry(4.1, 0.02, 16, 100);
      const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xff385c, transparent: true, opacity: 0.4 });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = Math.PI / 2.5;
      ringGroup.add(ring2);

      // Satellite Orbs on Rings
      const orbGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const orbMat1 = new THREE.MeshBasicMaterial({ color: 0x0071e3 });
      const orbMat2 = new THREE.MeshBasicMaterial({ color: 0xff385c });

      const satellite1 = new THREE.Mesh(orbGeo, orbMat1);
      satellite1.position.set(3.6, 0, 0);
      ringGroup.add(satellite1);

      const satellite2 = new THREE.Mesh(orbGeo, orbMat2);
      satellite2.position.set(0, 4.1, 0);
      ringGroup.add(satellite2);

      scene.add(ringGroup);

      // Mouse drag controls
      const dom = renderer.domElement;
      const onMouseDown = (e: MouseEvent) => {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.clientX, y: e.clientY };
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const deltaX = e.clientX - prevMouseRef.current.x;
        const deltaY = e.clientY - prevMouseRef.current.y;
        manualRotRef.current.y += deltaX * 0.008;
        manualRotRef.current.x += deltaY * 0.008;
        prevMouseRef.current = { x: e.clientX, y: e.clientY };
      };
      const onMouseUp = () => {
        isDraggingRef.current = false;
      };

      dom.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      // Touch controls
      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          isDraggingRef.current = true;
          prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      };
      const onTouchMove = (e: TouchEvent) => {
        if (!isDraggingRef.current || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - prevMouseRef.current.x;
        const deltaY = e.touches[0].clientY - prevMouseRef.current.y;
        manualRotRef.current.y += deltaX * 0.008;
        manualRotRef.current.x += deltaY * 0.008;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      };
      const onTouchEnd = () => {
        isDraggingRef.current = false;
      };

      dom.addEventListener("touchstart", onTouchStart);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", onTouchEnd);

      // Resize listener
      const handleResize = () => {
        if (!canvasContainerRef.current || !renderer || !camera) return;
        const w = canvasContainerRef.current.clientWidth;
        const h = canvasContainerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      // Animation & Render Loop
      let time = 0;
      let lastTime = performance.now();
      let frames = 0;
      let currentShape = shapeRef.current;

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const now = performance.now();
        frames++;

        if (now - lastTime >= 1000) {
          setTelemetry((prev) => ({
            ...prev,
            fps: Math.round((frames * 1000) / (now - lastTime)),
            quantumFreq: `${(4.8 + Math.random() * 0.1).toFixed(2)} THz`,
          }));
          frames = 0;
          lastTime = now;
        }

        const delta = 0.014 * speedRef.current;
        time += delta;

        // Shape swap
        if (currentShape !== shapeRef.current) {
          currentShape = shapeRef.current;
          innerMesh.geometry.dispose();
          innerMesh.geometry = createGeometry(currentShape);
          const vertCount = innerMesh.geometry.attributes.position.count;
          setTelemetry((prev) => ({
            ...prev,
            vertices: vertCount,
            faces: Math.round(vertCount / 2),
          }));
        }

        // Wireframe check
        if (innerMesh.material.wireframe !== wireframeRef.current) {
          innerMesh.material.wireframe = wireframeRef.current;
        }

        // Dispersal / Disperse Outer Cage
        const disp = dispersalRef.current / 100;
        outerCage.scale.set(1 + disp * 0.5, 1 + disp * 0.5, 1 + disp * 0.5);
        outerCage.material.opacity = 0.3 + disp * 0.3;

        // Smooth Rotation
        innerMesh.rotation.x = manualRotRef.current.x + time * 0.35;
        innerMesh.rotation.y = manualRotRef.current.y + time * 0.5;
        innerMesh.rotation.z = time * 0.15;

        outerCage.rotation.x = -manualRotRef.current.x * 0.4 - time * 0.2;
        outerCage.rotation.y = -manualRotRef.current.y * 0.4 - time * 0.3;

        ringGroup.rotation.y = time * 0.25 + manualRotRef.current.y * 0.25;
        ringGroup.rotation.x = Math.sin(time * 0.35) * 0.2 + manualRotRef.current.x * 0.25;

        // Soft orbiting key lights
        pointLight1.position.x = Math.cos(time * 0.6) * 6;
        pointLight1.position.z = Math.sin(time * 0.6) * 6;

        pointLight2.position.x = Math.cos(-time * 0.5) * 6;
        pointLight2.position.z = Math.sin(-time * 0.5) * 6;

        renderer.render(scene, camera);
      };

      animate();
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", () => {});
      if (renderer && renderer.domElement && canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-3xl border border-black/[0.06] bg-white/80 p-6 backdrop-blur-2xl shadow-apple-card transition-all hover:shadow-apple-hover">
      {/* Apple Studio Header */}
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0071E3] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0071E3]"></span>
          </span>
          <span className="font-semibold tracking-tight text-[#1D1D1F] text-xs">
            Apple Studio 3D Engine // Real-Time WebGL
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#86868B] font-mono">
          <span className="px-2 py-0.5 rounded-full bg-[#F5F5F7] border border-black/[0.04] text-[#1D1D1F] font-semibold">
            {telemetry.fps} FPS
          </span>
          <span>{telemetry.quantumFreq}</span>
        </div>
      </div>

      {/* Main Interactive 3D Canvas */}
      <div
        ref={canvasContainerRef}
        className="relative h-[360px] sm:h-[410px] w-full cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center"
      >
        {/* Subtle ground reflection vignette */}
        <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-transparent to-white/40" />

        {/* Floating Apple/Airbnb Hint Pill */}
        <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/90 px-3 py-1 text-[11px] text-[#1D1D1F] shadow-apple-sm backdrop-blur-md">
          <Rotate3d className="h-3.5 w-3.5 text-[#0071E3] animate-spin" style={{ animationDuration: "8s" }} />
          <span className="font-medium">360° Tactile Orbit</span>
        </div>

        {/* Top-Right Metric Pill */}
        <div className="pointer-events-none absolute top-3 right-4 font-mono text-[10px] text-[#86868B] text-right space-y-0.5">
          <div>VERTS: {telemetry.vertices.toLocaleString()}</div>
          <div>ACES FILMIC • PBR</div>
        </div>
      </div>

      {/* Apple Segmented Controls */}
      <div className="mt-4 pt-3 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Geometry Switcher (Airbnb/Apple Segmented Pill) */}
        <div className="flex items-center gap-1 bg-[#F5F5F7] p-1 rounded-full border border-black/[0.04]">
          {(["knot", "icosahedron", "dodeca", "ring"] as CoreGeometryType[]).map((shape) => (
            <button
              key={shape}
              onClick={() => setActiveShape(shape)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                activeShape === shape
                  ? "bg-white text-[#1D1D1F] font-semibold shadow-apple-sm"
                  : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
            >
              {shape.charAt(0).toUpperCase() + shape.slice(1)}
            </button>
          ))}
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          {/* Wireframe Button */}
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all cursor-pointer ${
              wireframe
                ? "border-[#0071E3] bg-[#0071E3]/10 text-[#0071E3]"
                : "border-black/[0.08] bg-white text-[#6E6E73] hover:text-[#1D1D1F] shadow-apple-sm"
            }`}
          >
            <Box className="h-3.5 w-3.5" />
            <span>Wireframe: {wireframe ? "ON" : "OFF"}</span>
          </button>

          {/* Deconstruct Slider */}
          <div className="hidden sm:flex items-center gap-2 bg-[#F5F5F7] px-3 py-1.5 rounded-full border border-black/[0.04]">
            <Sliders className="h-3.5 w-3.5 text-[#86868B]" />
            <span className="text-[11px] text-[#6E6E73] font-medium">Disperse:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={dispersal}
              onChange={(e) => setDispersal(Number(e.target.value))}
              className="w-16 accent-[#0071E3] cursor-pointer"
            />
            <span className="text-[11px] font-mono text-[#1D1D1F] w-6">{dispersal}%</span>
          </div>

          {/* Speed Toggle */}
          <button
            onClick={() => setRotationSpeed((s) => (s === 1 ? 2.5 : s === 2.5 ? 0.2 : 1))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/[0.08] bg-white text-[#1D1D1F] text-[11px] font-medium hover:bg-neutral-50 shadow-apple-sm cursor-pointer"
          >
            <Zap className="h-3 w-3 text-[#FF385C]" />
            <span>{rotationSpeed}x Speed</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 3. AGENT 3D NODE (Apple Vision Pro Glass Totem Viewport for Swarms)
// =========================================================================
interface Agent3DNodeProps {
  agentKey: "aura" | "apex" | "atlas" | "aegis";
  primaryColor: string;
  name: string;
}

export function Agent3DNode({ agentKey, primaryColor, name }: Agent3DNodeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  hoveredRef.current = hovered;

  useEffect(() => {
    let animId: number;
    let renderer: any = null;
    let scene: any = null;
    let camera: any = null;
    let mainMesh: any = null;
    let outerMesh: any = null;

    ensureThree().then((THREE) => {
      if (!THREE || !containerRef.current) return;

      const width = containerRef.current.clientWidth || 130;
      const height = containerRef.current.clientHeight || 130;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
      camera.position.z = 4.2;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);

      const light = new THREE.DirectionalLight(0xffffff, 2.0);
      light.position.set(2, 3, 4);
      scene.add(light);

      const colorHex = parseInt(primaryColor.replace("#", "0x"), 16);
      const pointL = new THREE.PointLight(colorHex, 2.5, 10);
      pointL.position.set(-2, -2, 2);
      scene.add(pointL);

      const amb = new THREE.AmbientLight(0xffffff, 1.8);
      scene.add(amb);

      let geom: any;
      let outerGeom: any;

      if (agentKey === "aura") {
        geom = new THREE.TorusKnotGeometry(1.0, 0.28, 64, 16, 3, 2);
        outerGeom = new THREE.TorusGeometry(1.6, 0.03, 16, 50);
      } else if (agentKey === "apex") {
        geom = new THREE.OctahedronGeometry(1.3, 0);
        outerGeom = new THREE.IcosahedronGeometry(1.7, 1);
      } else if (agentKey === "atlas") {
        geom = new THREE.IcosahedronGeometry(1.2, 2);
        outerGeom = new THREE.TorusGeometry(1.7, 0.02, 16, 60);
      } else {
        geom = new THREE.DodecahedronGeometry(1.2, 0);
        outerGeom = new THREE.OctahedronGeometry(1.8, 1);
      }

      const mat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness: 0.15,
        metalness: 0.2,
        clearcoat: 1.0,
      });
      mainMesh = new THREE.Mesh(geom, mat);
      scene.add(mainMesh);

      const outerMat = new THREE.MeshBasicMaterial({
        color: 0x8e8e93,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      outerMesh = new THREE.Mesh(outerGeom, outerMat);
      scene.add(outerMesh);

      let time = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const speed = hoveredRef.current ? 0.04 : 0.012;
        time += speed;

        mainMesh.rotation.x = time * 0.6;
        mainMesh.rotation.y = time * 0.9;

        outerMesh.rotation.x = -time * 0.4;
        outerMesh.rotation.y = -time * 0.7;

        renderer.render(scene, camera);
      };

      animate();
    });

    return () => {
      cancelAnimationFrame(animId);
      if (renderer && renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [agentKey, primaryColor]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col items-center justify-center group"
    >
      <div
        ref={containerRef}
        className="w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] cursor-pointer transition-transform duration-300 group-hover:scale-105"
      />
      <div className="text-[10px] font-medium tracking-wide text-[#86868B] group-hover:text-[#1D1D1F] transition-colors -mt-1">
        {name} 3D
      </div>
    </div>
  );
}

// =========================================================================
// 4. GLOBAL 3D NETWORK GLOBE (Apple Maps & Airbnb Clean Explorer Sphere)
// =========================================================================
interface HubLocation {
  name: string;
  lat: number;
  lng: number;
  role: string;
  metric: string;
}

const GLOBAL_HUBS: HubLocation[] = [
  { name: "San Francisco", lat: 37.7749, lng: -122.4194, role: "HQ Core Cluster", metric: "0.2ms Arbitrage" },
  { name: "New York", lat: 40.7128, lng: -74.006, role: "Wall St Media Bidding", metric: "$4.2M/mo Routed" },
  { name: "London", lat: 51.5074, lng: -0.1278, role: "EMEA Brand Defense", metric: "100% Brand Safe" },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, role: "APAC Visual Synthesizer", metric: "420 Ads/sec" },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, role: "High-Freq Arbitrage Hub", metric: "99.98% ROAS Opt" },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, role: "Luxury Brand Engine", metric: "AEO Citation Max" },
];

export function Global3DNetworkGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedHub, setSelectedHub] = useState<HubLocation>(GLOBAL_HUBS[0]);
  const [liveTrades, setLiveTrades] = useState([
    { from: "SFO", to: "TYO", amount: "$3,420", latency: "2.8ms", channel: "Meta High-Bid" },
    { from: "NYC", to: "LON", amount: "$8,910", latency: "1.9ms", channel: "Google AEO Arbitrage" },
    { from: "DXB", to: "SIN", amount: "$5,150", latency: "3.4ms", channel: "TikTok Dynamic Creative" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const hubs = ["SFO", "NYC", "LON", "TYO", "SIN", "DXB"];
      const from = hubs[Math.floor(Math.random() * hubs.length)];
      let to = hubs[Math.floor(Math.random() * hubs.length)];
      while (to === from) to = hubs[Math.floor(Math.random() * hubs.length)];

      const channels = ["Meta High-Bid", "Google AEO", "TikTok Gen-V", "Perplexity Citation", "X Vector Bid"];
      const newTrade = {
        from,
        to,
        amount: `$${(Math.random() * 8000 + 1000).toFixed(0)}`,
        latency: `${(Math.random() * 3 + 1).toFixed(1)}ms`,
        channel: channels[Math.floor(Math.random() * channels.length)],
      };

      setLiveTrades((prev) => [newTrade, prev[0], prev[1]]);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let animId: number;
    let renderer: any = null;
    let scene: any = null;
    let camera: any = null;
    let globeGroup: any = null;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    ensureThree().then((THREE) => {
      if (!THREE || !containerRef.current) return;

      const width = containerRef.current.clientWidth || 550;
      const height = containerRef.current.clientHeight || 450;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 6.0;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);

      globeGroup = new THREE.Group();
      scene.add(globeGroup);

      // 1. Dotted Lat/Long Coordinates Sphere (Apple Maps Clean Style)
      const sphereRadius = 2.4;
      const dotGeo = new THREE.BufferGeometry();
      const dotCoords: number[] = [];

      for (let lat = -80; lat <= 80; lat += 8) {
        const phi = (90 - lat) * (Math.PI / 180);
        for (let lng = -180; lng <= 180; lng += 10) {
          const theta = (lng + 180) * (Math.PI / 180);
          const x = -(sphereRadius * Math.sin(phi) * Math.cos(theta));
          const z = sphereRadius * Math.sin(phi) * Math.sin(theta);
          const y = sphereRadius * Math.cos(phi);
          dotCoords.push(x, y, z);
        }
      }

      dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(dotCoords, 3));
      const dotMat = new THREE.PointsMaterial({
        size: 0.045,
        color: 0x64748b, // Clean Slate
        transparent: true,
        opacity: 0.65,
      });
      const dotPoints = new THREE.Points(dotGeo, dotMat);
      globeGroup.add(dotPoints);

      // Inner Frosted Pearl Sphere
      const innerSphereGeo = new THREE.SphereGeometry(sphereRadius * 0.98, 32, 32);
      const innerSphereMat = new THREE.MeshBasicMaterial({
        color: 0xf8fafc,
        transparent: true,
        opacity: 0.85,
      });
      const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
      globeGroup.add(innerSphere);

      // Outer delicate atmosphere halo
      const atmosGeo = new THREE.SphereGeometry(sphereRadius * 1.12, 32, 32);
      const atmosMat = new THREE.MeshBasicMaterial({
        color: 0x0071e3,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      });
      const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
      globeGroup.add(atmosMesh);

      const latLngToVector = (lat: number, lng: number, radius: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        return new THREE.Vector3(
          -(radius * Math.sin(phi) * Math.cos(theta)),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      };

      const hubVectors: { [key: string]: any } = {};
      GLOBAL_HUBS.forEach((hub, idx) => {
        const pos = latLngToVector(hub.lat, hub.lng, sphereRadius);
        hubVectors[hub.name] = pos;

        // Airbnb Coral or Apple Blue node
        const nodeColor = idx % 2 === 0 ? 0xff385c : 0x0071e3;
        const nodeGeo = new THREE.SphereGeometry(0.09, 16, 16);
        const nodeMat = new THREE.MeshBasicMaterial({ color: nodeColor });
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.copy(pos);
        globeGroup.add(nodeMesh);

        // Halo Ring around Node
        const haloGeo = new THREE.RingGeometry(0.12, 0.16, 24);
        const haloMat = new THREE.MeshBasicMaterial({
          color: nodeColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.position.copy(pos);
        haloMesh.lookAt(pos.clone().multiplyScalar(2));
        globeGroup.add(haloMesh);
      });

      // Arc curves connecting hubs
      const connections = [
        ["San Francisco", "New York"],
        ["New York", "London"],
        ["London", "Dubai"],
        ["Dubai", "Singapore"],
        ["Singapore", "Tokyo"],
        ["Tokyo", "San Francisco"],
      ];

      const arcGroup = new THREE.Group();
      globeGroup.add(arcGroup);

      connections.forEach(([fromName, toName], idx) => {
        const p1 = hubVectors[fromName];
        const p2 = hubVectors[toName];
        if (!p1 || !p2) return;

        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        const distance = p1.distanceTo(p2);
        mid.normalize().multiplyScalar(sphereRadius + distance * 0.35);

        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        const points = curve.getPoints(50);
        const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
        const curveMat = new THREE.LineBasicMaterial({
          color: idx % 2 === 0 ? 0xff385c : 0x0071e3,
          transparent: true,
          opacity: 0.55,
        });
        const curveLine = new THREE.Line(curveGeo, curveMat);
        arcGroup.add(curveLine);
      });

      // Mouse drag handlers
      const dom = renderer.domElement;
      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        globeGroup.rotation.y += dx * 0.006;
        globeGroup.rotation.x += dy * 0.006;
        prevX = e.clientX;
        prevY = e.clientY;
      };
      const onMouseUp = () => {
        isDragging = false;
      };

      dom.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      const handleResize = () => {
        if (!containerRef.current || !renderer || !camera) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      let time = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        time += 0.008;

        if (!isDragging) {
          globeGroup.rotation.y += 0.0025;
        }

        renderer.render(scene, camera);
      };

      animate();
    });

    return () => {
      cancelAnimationFrame(animId);
      if (renderer && renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-3xl border border-black/[0.06] bg-white p-7 shadow-apple-card transition-all">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Left: 3D Interactive Apple/Airbnb Globe */}
        <div className="relative w-full lg:w-3/5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs font-medium mb-3 text-[#1D1D1F]">
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#0071E3] animate-spin" style={{ animationDuration: "16s" }} />
              Autonomous Global Arbitrage Fleet
            </span>
            <span className="text-[#86868B] text-xs">Drag 360° to explore</span>
          </div>

          <div
            ref={containerRef}
            className="w-full h-[360px] sm:h-[430px] cursor-grab active:cursor-grabbing relative rounded-2xl overflow-hidden bg-[#F5F5F7] border border-black/[0.04]"
          />

          {/* Hub selection pills (Airbnb filter style) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {GLOBAL_HUBS.map((hub) => (
              <button
                key={hub.name}
                onClick={() => setSelectedHub(hub)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedHub.name === hub.name
                    ? "bg-[#1D1D1F] text-white shadow-apple-sm"
                    : "bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-neutral-200/70"
                }`}
              >
                {hub.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Selected Hub Telemetry & Real-Time Trade Stream */}
        <div className="w-full lg:w-2/5 flex flex-col justify-between h-full space-y-4">
          {/* Active Hub Card */}
          <div className="rounded-2xl border border-black/[0.06] bg-[#F9F9FB] p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#0071E3] uppercase tracking-wider">
                ACTIVE NODE // {selectedHub.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-200">
                Active 24/7
              </span>
            </div>
            <div className="text-xl font-bold text-[#1D1D1F] mb-1">{selectedHub.role}</div>
            <div className="text-xs text-[#6E6E73]">Throughput: {selectedHub.metric}</div>
            <div className="mt-3 flex items-center gap-2 text-xs text-[#86868B]">
              <Activity className="h-3.5 w-3.5 text-[#0071E3]" />
              <span>Latency: 0.18ms • Zero Human In The Loop</span>
            </div>
          </div>

          {/* Live Cross-Border Arbitrage Ticker */}
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 space-y-3 shadow-apple-sm">
            <div className="flex items-center justify-between text-xs text-[#1D1D1F] font-semibold border-b border-black/[0.06] pb-2">
              <span className="flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-[#FF385C] animate-pulse" />
                Live Cross-Market Routing
              </span>
              <span className="text-[11px] text-[#86868B] font-normal">Real-Time</span>
            </div>

            <div className="space-y-2">
              {liveTrades.map((trade, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#F9F9FB] border border-black/[0.03]"
                >
                  <div className="flex items-center gap-2 text-[#1D1D1F]">
                    <span className="font-bold text-[#0071E3]">{trade.from}</span>
                    <span className="text-[#86868B]">→</span>
                    <span className="font-bold text-[#FF385C]">{trade.to}</span>
                    <span className="text-[#86868B] text-[11px] hidden sm:inline">({trade.channel})</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-semibold text-[#1D1D1F]">{trade.amount}</span>
                    <span className="text-[10px] text-emerald-600 font-medium">{trade.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee Banner */}
          <div className="rounded-2xl border border-black/[0.04] bg-[#F5F5F7] p-4 text-xs text-[#6E6E73]">
            <span className="text-[#1D1D1F] font-semibold">Autonomous Sync:</span> All 6 global nodes synchronize
            real-time marketing arbitrage auctions simultaneously every 10 milliseconds across Google, Meta, TikTok, and
            AEO citations.
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 5. ASSET 3D STUDIO VIEWER (Apple Product Turntable Showcase)
// =========================================================================
export function Asset3DStudioViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightingPreset, setLightingPreset] = useState<"studio" | "warm" | "minimal">("studio");
  const [wireframe, setWireframe] = useState(false);
  const wireframeRef = useRef(wireframe);
  wireframeRef.current = wireframe;
  const lightingRef = useRef(lightingPreset);
  lightingRef.current = lightingPreset;

  useEffect(() => {
    let animId: number;
    let renderer: any = null;
    let scene: any = null;
    let camera: any = null;
    let totemMesh: any = null;
    let pedestalMesh: any = null;
    let light1: any = null;
    let light2: any = null;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotX = 0;
    let rotY = 0;

    ensureThree().then((THREE) => {
      if (!THREE || !containerRef.current) return;

      const width = containerRef.current.clientWidth || 480;
      const height = containerRef.current.clientHeight || 350;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      camera.position.set(0, 1.8, 6.5);
      camera.lookAt(0, 0.5, 0);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);

      const ambLight = new THREE.AmbientLight(0xffffff, 2.2);
      scene.add(ambLight);

      light1 = new THREE.PointLight(0xffffff, 4, 20);
      light1.position.set(3, 4, 3);
      scene.add(light1);

      light2 = new THREE.PointLight(0x0071e3, 2.5, 20);
      light2.position.set(-3, -2, -3);
      scene.add(light2);

      const totemGroup = new THREE.Group();
      scene.add(totemGroup);

      // Apple Studio Turntable Pedestal
      const pedGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.3, 32);
      const pedMat = new THREE.MeshStandardMaterial({
        color: 0xf3f4f6,
        roughness: 0.2,
        metalness: 0.3,
      });
      pedestalMesh = new THREE.Mesh(pedGeo, pedMat);
      pedestalMesh.position.y = -1.0;
      totemGroup.add(pedestalMesh);

      // Silver Pedestal Ring
      const ringGeo = new THREE.TorusGeometry(1.62, 0.02, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x0071e3 });
      const pRing = new THREE.Mesh(ringGeo, ringMat);
      pRing.rotation.x = Math.PI / 2;
      pRing.position.y = -0.85;
      totemGroup.add(pRing);

      // Center High-Tech Asset: Luxury Frosted Obelisk
      const crystalGeo = new THREE.CylinderGeometry(0.7, 0.9, 2.4, 6);
      const crystalMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x0071e3,
        emissiveIntensity: 0.1,
        roughness: 0.15,
        metalness: 0.3,
        clearcoat: 1.0,
        wireframe: wireframeRef.current,
      });
      totemMesh = new THREE.Mesh(crystalGeo, crystalMat);
      totemMesh.position.y = 0.5;
      totemGroup.add(totemMesh);

      // Orbiting Titanium Rings
      const diamondRingGeo = new THREE.TorusGeometry(1.2, 0.02, 16, 4);
      const diamondRingMat = new THREE.MeshBasicMaterial({ color: 0x8e8e93, wireframe: true });
      const dRing = new THREE.Mesh(diamondRingGeo, diamondRingMat);
      dRing.position.y = 0.5;
      totemGroup.add(dRing);

      // Drag controls
      const dom = renderer.domElement;
      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        rotY += dx * 0.008;
        rotX += dy * 0.008;
        prevX = e.clientX;
        prevY = e.clientY;
      };
      const onMouseUp = () => {
        isDragging = false;
      };

      dom.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      let time = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        time += 0.012;

        totemMesh.material.wireframe = wireframeRef.current;

        if (lightingRef.current === "studio") {
          light1.color.setHex(0xffffff);
          light2.color.setHex(0x0071e3);
          light1.intensity = 4;
        } else if (lightingRef.current === "warm") {
          light1.color.setHex(0xfff7ed);
          light2.color.setHex(0xff385c);
          light1.intensity = 4.5;
        } else {
          light1.color.setHex(0xe5e7eb);
          light2.color.setHex(0x9ca3af);
          light1.intensity = 2.5;
        }

        totemGroup.rotation.y = rotY + time * 0.35;
        totemGroup.rotation.x = rotX;
        dRing.rotation.z = time * 0.6;

        renderer.render(scene, camera);
      };

      animate();
    });

    return () => {
      cancelAnimationFrame(animId);
      if (renderer && renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-3xl border border-black/[0.06] bg-white p-6 shadow-apple-card">
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 text-xs">
        <span className="font-semibold text-[#1D1D1F] flex items-center gap-2">
          <Box className="h-4 w-4 text-[#0071E3]" />
          Autonomous 3D Ad Asset Studio // Keynote Stage
        </span>
        <span className="text-[#86868B]">360° Inspection</span>
      </div>

      <div
        ref={containerRef}
        className="w-full h-[300px] sm:h-[350px] cursor-grab active:cursor-grabbing relative overflow-hidden flex items-center justify-center bg-[#F9F9FB] rounded-2xl my-3 border border-black/[0.03]"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        {/* Lighting presets (Airbnb pill filter) */}
        <div className="flex items-center gap-1 bg-[#F5F5F7] p-1 rounded-full border border-black/[0.04]">
          <span className="px-2.5 text-[#86868B] font-medium text-[11px]">Light:</span>
          {(["studio", "warm", "minimal"] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => setLightingPreset(preset)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                lightingPreset === preset ? "bg-white text-[#1D1D1F] font-semibold shadow-apple-sm" : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
            >
              {preset.charAt(0).toUpperCase() + preset.slice(1)}
            </button>
          ))}
        </div>

        {/* Wireframe toggle */}
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`px-3.5 py-1.5 rounded-full border text-[11px] font-medium transition-all cursor-pointer ${
            wireframe
              ? "border-[#0071E3] bg-[#0071E3]/10 text-[#0071E3]"
              : "border-black/[0.08] bg-white text-[#6E6E73] shadow-apple-sm"
          }`}
        >
          Wireframe: {wireframe ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// 6. APPLE STUDIO 3D HUD (Floating Vision Pro Glass Pill)
// =========================================================================
export function Cyber3DHUD({
  wireframeGlobal,
  onToggleWireframe,
}: {
  wireframeGlobal: boolean;
  onToggleWireframe: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      aria-label="3D Studio Engine Telemetry HUD"
      className="fixed bottom-6 right-6 z-40 hidden md:block"
    >
      <div className="rounded-full glass-pill border border-black/[0.08] p-2 px-3.5 shadow-apple-floating transition-all">
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            aria-label="Open 3D HUD"
            className="flex items-center gap-2 text-xs font-semibold text-[#1D1D1F] hover:text-[#0071E3]"
          >
            <Cpu className="h-3.5 w-3.5 text-[#0071E3]" />
            <span>Studio 3D</span>
          </button>
        ) : (
          <div className="flex items-center gap-3.5 text-xs">
            <div className="flex items-center gap-2 pr-3 border-r border-black/[0.08]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0071E3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0071E3]"></span>
              </span>
              <span className="font-semibold text-[#1D1D1F]">WebGL 2.0</span>
            </div>

            <button
              onClick={onToggleWireframe}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                wireframeGlobal
                  ? "bg-[#0071E3] text-white shadow-apple-sm"
                  : "bg-neutral-100 text-[#1D1D1F] hover:bg-neutral-200"
              }`}
            >
              <Box className="h-3 w-3" />
              <span>3D Grid: {wireframeGlobal ? "ON" : "OFF"}</span>
            </button>

            <button
              onClick={() => setCollapsed(true)}
              aria-label="Collapse 3D HUD"
              className="text-[#86868B] hover:text-[#1D1D1F] pl-1 cursor-pointer"
            >
              <Minimize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
