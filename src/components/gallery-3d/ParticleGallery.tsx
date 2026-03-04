'use client';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { GalleryImage, AudioReactiveData } from './types';
import { lerp } from './utils';

interface ParticleGalleryProps {
  images: GalleryImage[];
  className?: string;
  particleCount?: number;
  spread?: number;
  imageSize?: number;
  floatIntensity?: number;
  onImageClick?: (image: GalleryImage, index: number) => void;
  audioData?: AudioReactiveData;
}

interface FloatingImageProps {
  image: GalleryImage;
  initialPosition: THREE.Vector3;
  index: number;
  size: number;
  floatIntensity: number;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (index: number | null) => void;
  onClick: () => void;
}

function FloatingImage({
  image,
  initialPosition,
  index,
  size,
  floatIntensity,
  isHovered,
  isSelected,
  onHover,
  onClick,
}: FloatingImageProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(image.src);
  const [position, setPosition] = useState(initialPosition.clone());
  const offset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Organic floating motion using noise-like behavior
    const floatX = Math.sin(time * 0.5 + offset.current) * floatIntensity;
    const floatY = Math.cos(time * 0.3 + offset.current * 2) * floatIntensity;
    const floatZ = Math.sin(time * 0.4 + offset.current * 1.5) * floatIntensity * 0.5;

    meshRef.current.position.x = lerp(
      meshRef.current.position.x,
      initialPosition.x + floatX,
      0.02
    );
    meshRef.current.position.y = lerp(
      meshRef.current.position.y,
      initialPosition.y + floatY,
      0.02
    );
    meshRef.current.position.z = lerp(
      meshRef.current.position.z,
      initialPosition.z + floatZ,
      0.02
    );

    // Gentle rotation
    meshRef.current.rotation.x = Math.sin(time * 0.2 + index) * 0.1;
    meshRef.current.rotation.y = Math.cos(time * 0.15 + index) * 0.1;

    // Scale animation on hover/select
    const targetScale = isSelected ? 1.8 : isHovered ? 1.3 : 1;
    meshRef.current.scale.setScalar(
      lerp(meshRef.current.scale.x, targetScale, 0.1)
    );
  });

  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const width = aspect > 1 ? size : size * aspect;
  const height = aspect > 1 ? size / aspect : size;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={initialPosition}
        onPointerEnter={() => onHover(index)}
        onPointerLeave={() => onHover(null)}
        onClick={onClick}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={isHovered || isSelected ? 1 : 0.85}
          side={THREE.DoubleSide}
          emissive={isSelected ? '#4f46e5' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Particle trail effect when hovered */}
      {isHovered && <ParticleTrail position={position} />}

      {/* Info tooltip */}
      {isHovered && image.alt && (
        <Html
          center
          position={[
            initialPosition.x,
            initialPosition.y - height / 2 - 0.3,
            initialPosition.z,
          ]}
        >
          <div className="bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm">
            {image.alt}
          </div>
        </Html>
      )}
    </group>
  );
}

function ParticleTrail({ position }: { position: THREE.Vector3 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const count = 30;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x + (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 1] = position.y + (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 0.5;
    }

    return [positions];
  }, [position]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4f46e5"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Background ambient particles with audio reactivity
function AmbientParticles({ count, spread, audioData }: { count: number; spread: number; audioData?: AudioReactiveData }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 2;

      // Purple to cyan gradient
      const t = Math.random();
      colors[i * 3] = lerp(0.31, 0.02, t);
      colors[i * 3 + 1] = lerp(0.27, 0.71, t);
      colors[i * 3 + 2] = lerp(0.9, 0.83, t);
    }

    return [positions, colors];
  }, [count, spread]);

  useFrame((state) => {
    if (pointsRef.current) {
      let rotSpeed = state.clock.elapsedTime * 0.02;
      let xTilt = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;

      if (audioData?.enabled) {
        rotSpeed *= 1 + audioData.energy * 3;
        xTilt *= 1 + audioData.bass * 2;

        if (pointsRef.current.material instanceof THREE.PointsMaterial) {
          pointsRef.current.material.size = 0.03 + audioData.beatIntensity * 0.05;
          pointsRef.current.material.opacity = 0.4 + audioData.energy * 0.4;
        }
      }

      pointsRef.current.rotation.y = rotSpeed;
      pointsRef.current.rotation.x = xTilt;
    }
  });

  return (
    <points ref={pointsRef}>
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
        size={0.03}
        transparent
        opacity={0.4}
        vertexColors
        sizeAttenuation
      />
    </points>
  );
}

interface ParticleSceneProps {
  images: GalleryImage[];
  spread: number;
  imageSize: number;
  floatIntensity: number;
  onImageClick?: (image: GalleryImage, index: number) => void;
  audioData?: AudioReactiveData;
}

function ParticleScene({
  images,
  spread,
  imageSize,
  floatIntensity,
  onImageClick,
  audioData,
}: ParticleSceneProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { camera } = useThree();

  // Generate scattered positions for images
  const positions = useMemo(() => {
    return images.map((_, i) => {
      // Use golden ratio for natural distribution
      const phi = Math.acos(-1 + (2 * i) / images.length);
      const theta = Math.sqrt(images.length * Math.PI) * phi;

      const r = spread * (0.5 + Math.random() * 0.5);

      return new THREE.Vector3(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi) * 0.6,
        r * Math.cos(phi)
      );
    });
  }, [images.length, spread]);

  const handleClick = useCallback(
    (index: number) => {
      if (selectedIndex === index) {
        setSelectedIndex(null);
      } else {
        setSelectedIndex(index);
        onImageClick?.(images[index], index);

        // Animate camera towards selected image
        const pos = positions[index];
        const targetCameraPos = pos.clone().multiplyScalar(0.3).add(
          new THREE.Vector3(0, 0, spread * 1.5)
        );
        camera.position.lerp(targetCameraPos, 0.1);
      }
    },
    [selectedIndex, onImageClick, images, positions, camera, spread]
  );

  return (
    <>
      {/* Lighting with audio reactivity */}
      <ambientLight intensity={audioData?.enabled ? 0.3 + audioData.energy * 0.3 : 0.4} />
      <pointLight
        position={[10, 10, 10]}
        intensity={audioData?.enabled ? 0.8 + audioData.treble * 0.5 : 1}
      />
      <pointLight
        position={[-10, -10, -10]}
        intensity={audioData?.enabled ? 0.4 + audioData.bass * 0.4 : 0.5}
        color="#4f46e5"
      />
      <pointLight
        position={[0, 10, 0]}
        intensity={audioData?.enabled ? 0.4 + audioData.mid * 0.4 : 0.5}
        color="#06b6d4"
      />

      {/* Central core glow */}
      <mesh>
        <sphereGeometry args={[spread * 0.1, 32, 32]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0.15} />
      </mesh>

      {/* Floating images */}
      {images.map((image, index) => (
        <FloatingImage
          key={`${image.src}-${index}`}
          image={image}
          initialPosition={positions[index]}
          index={index}
          size={imageSize}
          floatIntensity={floatIntensity}
          isHovered={hoveredIndex === index}
          isSelected={selectedIndex === index}
          onHover={setHoveredIndex}
          onClick={() => handleClick(index)}
        />
      ))}

      {/* Ambient particles */}
      <AmbientParticles count={800} spread={spread * 1.5} audioData={audioData} />

      {/* Orbit controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minDistance={spread * 0.5}
        maxDistance={spread * 4}
        autoRotate={hoveredIndex === null && selectedIndex === null}
        autoRotateSpeed={0.3}
      />

      {/* Fog for depth */}
      <fog attach="fog" args={['#0f172a', spread, spread * 4]} />
    </>
  );
}

function FallbackGallery({ images }: { images: GalleryImage[] }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 overflow-y-auto">
      <div className="flex flex-wrap justify-center gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="transform hover:scale-110 transition-transform duration-300"
            style={{
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <img
              src={img.src}
              alt={img.alt || ''}
              className="w-32 h-32 object-cover rounded-lg shadow-xl"
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

export default function ParticleGallery({
  images,
  className = 'w-full h-[600px]',
  particleCount = 500,
  spread = 8,
  imageSize = 1.5,
  floatIntensity = 0.5,
  onImageClick,
  audioData,
}: ParticleGalleryProps) {
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
        camera={{ position: [0, 0, spread * 2], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
      >
        <ParticleScene
          images={images}
          spread={spread}
          imageSize={imageSize}
          floatIntensity={audioData?.enabled ? floatIntensity * (1 + audioData.energy) : floatIntensity}
          onImageClick={onImageClick}
          audioData={audioData}
        />
      </Canvas>
    </div>
  );
}
