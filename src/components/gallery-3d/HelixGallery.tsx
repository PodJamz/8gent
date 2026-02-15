'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html, ScrollControls, useScroll, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { GalleryImage, AudioReactiveData } from './types';
import { helixPoint, lerp, damp } from './utils';

interface HelixGalleryProps {
  images: GalleryImage[];
  className?: string;
  radius?: number;
  height?: number;
  turns?: number;
  itemSize?: number;
  scrollPages?: number;
  onImageClick?: (image: GalleryImage, index: number) => void;
  audioData?: AudioReactiveData;
}

interface HelixItemProps {
  image: GalleryImage;
  position: THREE.Vector3;
  index: number;
  totalItems: number;
  scrollProgress: number;
  itemSize: number;
  onHover: (index: number | null) => void;
  onClick: () => void;
  isHovered: boolean;
  audioData?: AudioReactiveData;
}

function HelixItem({
  image,
  position,
  index,
  totalItems,
  scrollProgress,
  itemSize,
  onHover,
  onClick,
  isHovered,
  audioData,
}: HelixItemProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(image.src);
  const [scale, setScale] = useState(1);

  // Calculate distance from "active" position based on scroll
  const activePosition = scrollProgress * totalItems;
  const distance = Math.abs(index - activePosition);
  const isActive = distance < 1;

  // Face outward from helix center
  const rotation = useMemo(() => {
    return new THREE.Euler(0, Math.atan2(position.x, position.z) + Math.PI, 0);
  }, [position]);

  useFrame((state, delta) => {
    let targetScale = isHovered ? 1.3 : isActive ? 1.15 : 1 - distance * 0.05;

    // Audio reactive scaling
    if (audioData?.enabled) {
      const freqIndex = index % 5;
      const freqValues = [audioData.bass, audioData.lowMid, audioData.mid, audioData.highMid, audioData.treble];
      const freqResponse = freqValues[freqIndex] || 0;

      targetScale *= 1 + freqResponse * 0.25;

      if (audioData.isBeat && isActive) {
        targetScale *= 1 + audioData.beatIntensity * 0.3;
      }
    }

    setScale((prev) => damp(prev, Math.max(0.5, targetScale), 6, delta));

    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale);
      // Audio reactive float
      const floatOffset = audioData?.enabled
        ? Math.sin(state.clock.elapsedTime * 2 + index) * 0.1 * (1 + audioData.energy)
        : Math.sin(Date.now() * 0.001 + index) * 0.05;
      meshRef.current.position.y = position.y + floatOffset;

      // Audio reactive emissive
      if (audioData?.enabled && meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        const intensity = isActive ? audioData.energy * 0.5 : audioData.energy * 0.2;
        meshRef.current.material.emissiveIntensity = intensity;
      }
    }

    // Glow ring pulse
    if (glowRef.current && audioData?.enabled) {
      const glowScale = 1.1 + audioData.beatIntensity * 0.3;
      glowRef.current.scale.setScalar(glowScale);
      if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
        glowRef.current.material.opacity = 0.4 + audioData.beatIntensity * 0.4;
      }
    }
  });

  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const width = aspect > 1 ? itemSize : itemSize * aspect;
  const height = aspect > 1 ? itemSize / aspect : itemSize;

  // Calculate opacity based on distance
  const opacity = Math.max(0.3, 1 - distance * 0.15);

  return (
    <group position={position} rotation={rotation}>
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
          opacity={opacity}
          emissive={isActive ? '#4f46e5' : '#000000'}
          emissiveIntensity={isActive ? 0.2 : 0}
        />
      </mesh>

      {/* Glow ring for active item or audio reactive */}
      {(isActive || audioData?.enabled) && (
        <mesh ref={glowRef} position={[0, 0, -0.02]} scale={1.1}>
          <ringGeometry args={[Math.max(width, height) * 0.55, Math.max(width, height) * 0.6, 32]} />
          <meshBasicMaterial
            color={audioData?.enabled ? `hsl(${260 + (audioData.mid || 0) * 60}, 80%, 50%)` : '#4f46e5'}
            transparent
            opacity={isActive ? 0.6 : 0.3}
          />
        </mesh>
      )}

      {/* Label on hover */}
      {isHovered && image.alt && (
        <Html center position={[0, -height / 2 - 0.3, 0.1]}>
          <div className="bg-indigo-600/90 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg">
            {image.alt}
          </div>
        </Html>
      )}
    </group>
  );
}

interface HelixSceneProps {
  images: GalleryImage[];
  radius: number;
  height: number;
  turns: number;
  itemSize: number;
  onImageClick?: (image: GalleryImage, index: number) => void;
  audioData?: AudioReactiveData;
}

function HelixSceneInner({
  images,
  radius,
  height,
  turns,
  itemSize,
  onImageClick,
  audioData,
}: HelixSceneProps) {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { camera } = useThree();

  // Calculate helix positions
  const positions = useMemo(() => {
    return images.map((_, index) => {
      const angle = (index / images.length) * Math.PI * 2 * turns;
      return helixPoint(radius, height, angle, turns);
    });
  }, [images.length, radius, height, turns]);

  useFrame((state) => {
    const progress = scroll.offset;
    setScrollProgress(progress);

    // Move camera along with scroll
    const cameraY = (progress - 0.5) * height;
    camera.position.y = damp(camera.position.y, cameraY, 4, 0.016);

    // Rotate group slightly based on scroll + audio
    if (groupRef.current) {
      let rotationY = progress * Math.PI * 0.5;

      if (audioData?.enabled) {
        rotationY += Math.sin(state.clock.elapsedTime * 2) * audioData.energy * 0.2;
        // Wobble on beat
        if (audioData.isBeat) {
          groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 10) * 0.03 * audioData.beatIntensity;
        } else {
          groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, 0, 0.1);
        }
      }

      groupRef.current.rotation.y = rotationY;
    }
  });

  return (
    <>
      {/* Lighting with audio reactivity */}
      <ambientLight intensity={audioData?.enabled ? 0.4 + audioData.energy * 0.3 : 0.5} />
      <pointLight
        position={[10, 10, 10]}
        intensity={audioData?.enabled ? 0.8 + audioData.treble * 0.5 : 1}
        color="#ffffff"
      />
      <pointLight
        position={[-10, -10, -10]}
        intensity={audioData?.enabled ? 0.4 + audioData.bass * 0.4 : 0.5}
        color="#4f46e5"
      />
      <pointLight
        position={[0, height / 2, 0]}
        intensity={audioData?.enabled ? 0.4 + audioData.mid * 0.4 : 0.5}
        color="#06b6d4"
      />
      <pointLight
        position={[0, -height / 2, 0]}
        intensity={audioData?.enabled ? 0.4 + audioData.highMid * 0.4 : 0.5}
        color="#8b5cf6"
      />

      {/* Central helix spine */}
      <group ref={groupRef}>
        {/* DNA-like connecting lines with audio reactivity */}
        {positions.map((pos, i) => {
          if (i === positions.length - 1) return null;
          const nextPos = positions[i + 1];
          const points: [number, number, number][] = [
            [pos.x, pos.y, pos.z],
            [nextPos.x, nextPos.y, nextPos.z],
          ];

          const lineOpacity = audioData?.enabled ? 0.3 + audioData.energy * 0.4 : 0.3;

          return (
            <Line
              key={`line-${i}`}
              points={points}
              color={audioData?.enabled ? `hsl(${260 + (audioData.mid || 0) * 40}, 70%, 50%)` : '#4f46e5'}
              transparent
              opacity={lineOpacity}
              lineWidth={audioData?.enabled ? 1 + audioData.bass * 2 : 1}
            />
          );
        })}

        {/* Gallery items */}
        {images.map((image, index) => (
          <HelixItem
            key={`${image.src}-${index}`}
            image={image}
            position={positions[index]}
            index={index}
            totalItems={images.length}
            scrollProgress={scrollProgress}
            itemSize={itemSize}
            onHover={setHoveredIndex}
            onClick={() => onImageClick?.(image, index)}
            isHovered={hoveredIndex === index}
            audioData={audioData}
          />
        ))}
      </group>

      {/* Background particles */}
      <Points count={500} radius={radius * 3} audioData={audioData} />

      {/* Fog for depth */}
      <fog attach="fog" args={['#0f172a', radius * 2, radius * 8]} />
    </>
  );
}

// Floating particles for ambiance with audio reactivity
function Points({ count, radius, audioData }: { count: number; radius: number; audioData?: AudioReactiveData }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.5 + Math.random() * 0.5);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // Purple/cyan gradient colors
      const t = Math.random();
      colors[i * 3] = lerp(0.31, 0.02, t);
      colors[i * 3 + 1] = lerp(0.27, 0.71, t);
      colors[i * 3 + 2] = lerp(0.9, 0.83, t);
    }

    return [positions, colors];
  }, [count, radius]);

  useFrame((state) => {
    if (pointsRef.current) {
      let rotSpeed = state.clock.elapsedTime * 0.02;
      let xTilt = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;

      if (audioData?.enabled) {
        rotSpeed *= 1 + audioData.energy * 2;
        xTilt *= 1 + audioData.bass * 2;
      }

      pointsRef.current.rotation.y = rotSpeed;
      pointsRef.current.rotation.x = xTilt;

      // Audio reactive particle size
      if (pointsRef.current.material instanceof THREE.PointsMaterial && audioData?.enabled) {
        pointsRef.current.material.size = 0.05 + audioData.beatIntensity * 0.05;
        pointsRef.current.material.opacity = 0.6 + audioData.energy * 0.3;
      }
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
  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 p-8">
      <div className="max-w-md mx-auto space-y-6">
        {images.map((img, i) => (
          <div
            key={i}
            className="transform hover:scale-105 transition-transform"
            style={{ transform: `translateX(${Math.sin(i * 0.5) * 20}px)` }}
          >
            <img
              src={img.src}
              alt={img.alt || ''}
              className="w-full h-48 object-cover rounded-xl shadow-xl"
            />
            {img.alt && <p className="text-white/70 text-sm mt-2 text-center">{img.alt}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HelixGallery({
  images,
  className = 'w-full h-[700px]',
  radius = 3,
  height = 15,
  turns = 2,
  itemSize = 1.5,
  scrollPages = 3,
  onImageClick,
  audioData,
}: HelixGalleryProps) {
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
        camera={{ position: [0, 0, radius * 3], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
      >
        <ScrollControls pages={scrollPages} damping={0.25}>
          <HelixSceneInner
            images={images}
            radius={radius}
            height={height}
            turns={turns}
            itemSize={itemSize}
            onImageClick={onImageClick}
            audioData={audioData}
          />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
