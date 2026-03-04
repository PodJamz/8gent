'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { GalleryImage, AudioReactiveData } from './types';
import { lerp } from './utils';

interface CubeGalleryProps {
  images: GalleryImage[];
  className?: string;
  size?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
  onImageClick?: (image: GalleryImage, index: number) => void;
  audioData?: AudioReactiveData;
}

// Face configurations for the cube
const FACE_CONFIGS = [
  { rotation: [0, 0, 0], normal: [0, 0, 1], name: 'front' },
  { rotation: [0, Math.PI, 0], normal: [0, 0, -1], name: 'back' },
  { rotation: [0, Math.PI / 2, 0], normal: [1, 0, 0], name: 'right' },
  { rotation: [0, -Math.PI / 2, 0], normal: [-1, 0, 0], name: 'left' },
  { rotation: [-Math.PI / 2, 0, 0], normal: [0, 1, 0], name: 'top' },
  { rotation: [Math.PI / 2, 0, 0], normal: [0, -1, 0], name: 'bottom' },
] as const;

interface CubeFaceProps {
  image: GalleryImage;
  faceConfig: (typeof FACE_CONFIGS)[number];
  size: number;
  index: number;
  isHovered: boolean;
  isActive: boolean;
  onHover: (index: number | null) => void;
  onClick: () => void;
  audioData?: AudioReactiveData;
}

function CubeFace({
  image,
  faceConfig,
  size,
  index,
  isHovered,
  isActive,
  onHover,
  onClick,
  audioData,
}: CubeFaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(image.src);
  const [offset, setOffset] = useState(0);

  // Position face at the surface of the cube
  const position = useMemo(() => {
    const [nx, ny, nz] = faceConfig.normal;
    const dist = size / 2 + offset;
    return new THREE.Vector3(nx * dist, ny * dist, nz * dist);
  }, [faceConfig.normal, size, offset]);

  useFrame((state, delta) => {
    // Pop out effect on hover + audio
    let targetOffset = isHovered ? 0.3 : isActive ? 0.15 : 0;

    if (audioData?.enabled) {
      const freqValues = [audioData.bass, audioData.lowMid, audioData.mid, audioData.highMid, audioData.treble, audioData.energy];
      const freqResponse = freqValues[index % 6] || 0;
      targetOffset += freqResponse * 0.2;

      if (audioData.isBeat) {
        targetOffset += audioData.beatIntensity * 0.15;
      }
    }

    setOffset((prev) => lerp(prev, targetOffset, delta * 8));

    // Audio reactive emissive
    if (meshRef.current && audioData?.enabled) {
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        const hue = (state.clock.elapsedTime * 0.1 + index * 0.1) % 1;
        meshRef.current.material.emissive.setHSL(hue, 0.8, 0.3);
        meshRef.current.material.emissiveIntensity = audioData.energy * 0.4;
      }
    }

    // Glow pulse
    if (glowRef.current && audioData?.enabled) {
      if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
        glowRef.current.material.opacity = 0.3 + audioData.beatIntensity * 0.5;
      }
    }
  });

  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const faceSize = size * 0.9;
  const width = aspect > 1 ? faceSize : faceSize * aspect;
  const height = aspect > 1 ? faceSize / aspect : faceSize;

  return (
    <group position={position} rotation={faceConfig.rotation as [number, number, number]}>
      {/* Main image */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => onHover(index)}
        onPointerLeave={() => onHover(null)}
        onClick={onClick}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={isHovered ? 1 : 0.9}
          emissive={isActive ? '#4f46e5' : '#000000'}
          emissiveIntensity={isActive ? 0.15 : 0}
        />
      </mesh>

      {/* Border glow on hover or audio */}
      {(isHovered || audioData?.enabled) && (
        <mesh ref={glowRef} position={[0, 0, -0.01]}>
          <planeGeometry args={[width + 0.1, height + 0.1]} />
          <meshBasicMaterial
            color={audioData?.enabled ? `hsl(${260 + (audioData.mid || 0) * 60}, 80%, 50%)` : '#4f46e5'}
            transparent
            opacity={isHovered ? 0.5 : 0.3}
          />
        </mesh>
      )}

      {/* Label on hover */}
      {isHovered && image.alt && (
        <Html center position={[0, -height / 2 - 0.3, 0.1]}>
          <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg">
            {image.alt}
          </div>
        </Html>
      )}
    </group>
  );
}

interface CubeSceneProps {
  images: GalleryImage[];
  size: number;
  autoRotate: boolean;
  rotationSpeed: number;
  onImageClick?: (image: GalleryImage, index: number) => void;
  audioData?: AudioReactiveData;
}

function CubeScene({
  images,
  size,
  autoRotate,
  rotationSpeed,
  onImageClick,
  audioData,
}: CubeSceneProps) {
  const cubeRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Auto-rotation with audio modulation
  useFrame((state, delta) => {
    if (cubeRef.current && autoRotate && hoveredIndex === null) {
      let speed = rotationSpeed;

      if (audioData?.enabled) {
        speed *= 1 + audioData.energy * 2;
        // Add chaos on beat
        if (audioData.isBeat) {
          targetRotation.current.x += (Math.random() - 0.5) * 0.1 * audioData.beatIntensity;
        }
      }

      targetRotation.current.y += speed * delta;
    }

    if (cubeRef.current) {
      cubeRef.current.rotation.x = lerp(
        cubeRef.current.rotation.x,
        targetRotation.current.x,
        delta * 3
      );
      cubeRef.current.rotation.y = lerp(
        cubeRef.current.rotation.y,
        targetRotation.current.y,
        delta * 3
      );
    }

    // Audio reactive core
    if (coreRef.current && audioData?.enabled) {
      const pulseScale = size * 0.2 * (1 + audioData.bass * 0.8);
      coreRef.current.scale.setScalar(pulseScale / (size * 0.2));

      if (coreRef.current.material instanceof THREE.MeshBasicMaterial) {
        const hue = (state.clock.elapsedTime * 0.1 + audioData.mid) % 1;
        coreRef.current.material.color.setHSL(hue, 0.8, 0.5);
        coreRef.current.material.opacity = 0.2 + audioData.energy * 0.5;
      }
    }
  });

  // Handle navigation buttons
  const rotateTo = (face: string) => {
    const faceIndex = FACE_CONFIGS.findIndex((f) => f.name === face);
    if (faceIndex === -1) return;

    const config = FACE_CONFIGS[faceIndex];
    const [nx, ny, nz] = config.normal;

    // Calculate rotation to face camera
    targetRotation.current.x = ny !== 0 ? (ny > 0 ? Math.PI / 2 : -Math.PI / 2) : 0;
    targetRotation.current.y = nz !== 0 ? (nz > 0 ? 0 : Math.PI) : (nx > 0 ? -Math.PI / 2 : Math.PI / 2);
  };

  return (
    <>
      {/* Lighting with audio reactivity */}
      <ambientLight intensity={audioData?.enabled ? 0.4 + audioData.energy * 0.3 : 0.5} />
      <pointLight
        position={[10, 10, 10]}
        intensity={audioData?.enabled ? 0.8 + audioData.treble * 0.5 : 1}
        color={audioData?.enabled ? `hsl(${240 + audioData.mid * 60}, 80%, 70%)` : '#ffffff'}
      />
      <pointLight
        position={[-10, -10, -10]}
        intensity={audioData?.enabled ? 0.4 + audioData.bass * 0.4 : 0.5}
        color="#4f46e5"
      />
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={1}
        intensity={audioData?.enabled ? 0.6 + audioData.mid * 0.4 : 0.8}
        castShadow
      />

      {/* Cube structure */}
      <group ref={cubeRef}>
        {/* Wireframe cube */}
        <mesh>
          <boxGeometry args={[size, size, size]} />
          <meshBasicMaterial
            color={audioData?.enabled ? `hsl(${260 + audioData.mid * 40}, 60%, 40%)` : '#334155'}
            wireframe
            transparent
            opacity={audioData?.enabled ? 0.3 + audioData.energy * 0.3 : 0.3}
          />
        </mesh>

        {/* Face images */}
        {FACE_CONFIGS.map((config, i) => {
          const image = images[i % images.length];
          return (
            <CubeFace
              key={config.name}
              image={image}
              faceConfig={config}
              size={size}
              index={i}
              isHovered={hoveredIndex === i}
              isActive={activeIndex === i}
              onHover={setHoveredIndex}
              onClick={() => {
                setActiveIndex(activeIndex === i ? null : i);
                onImageClick?.(image, i);
              }}
              audioData={audioData}
            />
          );
        })}

        {/* Inner glow */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[size * 0.2, 32, 32]} />
          <meshBasicMaterial color="#4f46e5" transparent opacity={0.1} />
        </mesh>
      </group>

      {/* Corner particles */}
      <CornerParticles size={size} audioData={audioData} />

      {/* Orbit controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={size * 1.5}
        maxDistance={size * 5}
        autoRotate={autoRotate && hoveredIndex === null}
        autoRotateSpeed={audioData?.enabled ? rotationSpeed * 2 * (1 + audioData.energy) : rotationSpeed * 2}
      />

      {/* Navigation UI */}
      <Html position={[0, -size - 1, 0]} center>
        <div className="flex gap-2">
          {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face) => (
            <button
              key={face}
              onClick={() => rotateTo(face)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg backdrop-blur-sm transition-colors capitalize"
            >
              {face}
            </button>
          ))}
        </div>
      </Html>
    </>
  );
}

// Decorative corner particles with audio reactivity
function CornerParticles({ size, audioData }: { size: number; audioData?: AudioReactiveData }) {
  const particlesRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Cluster around corners
      const corner = Math.floor(Math.random() * 8);
      const cx = ((corner & 1) - 0.5) * size;
      const cy = (((corner >> 1) & 1) - 0.5) * size;
      const cz = (((corner >> 2) & 1) - 0.5) * size;

      positions[i * 3] = cx + (Math.random() - 0.5) * size * 0.3;
      positions[i * 3 + 1] = cy + (Math.random() - 0.5) * size * 0.3;
      positions[i * 3 + 2] = cz + (Math.random() - 0.5) * size * 0.3;

      // Indigo/cyan colors
      const t = Math.random();
      colors[i * 3] = lerp(0.31, 0.02, t);
      colors[i * 3 + 1] = lerp(0.27, 0.71, t);
      colors[i * 3 + 2] = lerp(0.9, 0.83, t);
    }

    return [positions, colors];
  }, [size]);

  useFrame((state) => {
    if (particlesRef.current) {
      let rotSpeed = state.clock.elapsedTime * 0.05;

      if (audioData?.enabled) {
        rotSpeed *= 1 + audioData.energy * 2;

        if (particlesRef.current.material instanceof THREE.PointsMaterial) {
          particlesRef.current.material.size = 0.05 + audioData.beatIntensity * 0.08;
          particlesRef.current.material.opacity = 0.6 + audioData.energy * 0.3;
        }
      }

      particlesRef.current.rotation.y = rotSpeed;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        transparent
        opacity={0.6}
        vertexColors
        sizeAttenuation
      />
    </points>
  );
}

function FallbackGallery({ images }: { images: GalleryImage[] }) {
  const [currentFace, setCurrentFace] = useState(0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950 p-8">
      <div className="relative w-64 h-64 perspective-1000">
        <img
          src={images[currentFace % images.length].src}
          alt={images[currentFace % images.length].alt || ''}
          className="w-full h-full object-cover rounded-xl shadow-2xl"
        />
      </div>
      <div className="flex gap-2 mt-6">
        {Array.from({ length: Math.min(6, images.length) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentFace(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentFace ? 'bg-indigo-500 scale-125' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
      <p className="text-slate-400 mt-4 text-sm">WebGL not supported</p>
    </div>
  );
}

export default function CubeGallery({
  images,
  className = 'w-full h-[600px]',
  size = 3,
  autoRotate = true,
  rotationSpeed = 0.3,
  onImageClick,
  audioData,
}: CubeGalleryProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      if (!canvas.getContext('webgl') && !canvas.getContext('experimental-webgl')) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return (
      <div className={className}>
        <FallbackGallery images={images} />
      </div>
    );
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, size * 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
      >
        <CubeScene
          images={images}
          size={size}
          autoRotate={autoRotate}
          rotationSpeed={rotationSpeed}
          onImageClick={onImageClick}
          audioData={audioData}
        />
      </Canvas>
    </div>
  );
}
