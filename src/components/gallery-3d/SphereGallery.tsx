'use client';

import { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { GalleryImage, AudioReactiveData } from './types';
import { fibonacciSphere, damp } from './utils';

interface SphereGalleryProps {
  images: GalleryImage[];
  className?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  radius?: number;
  itemSize?: number;
  onImageClick?: (image: GalleryImage, index: number) => void;
  audioData?: AudioReactiveData;
}

interface ImageCardProps {
  image: GalleryImage;
  position: THREE.Vector3;
  index: number;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (index: number | null) => void;
  onClick: (index: number) => void;
  cardSize: number;
  audioData?: AudioReactiveData;
}

function ImageCard({
  image,
  position,
  index,
  isHovered,
  isSelected,
  onHover,
  onClick,
  cardSize,
  audioData,
}: ImageCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(image.src);
  const [scale, setScale] = useState(1);

  // Calculate rotation to face center
  const rotation = useMemo(() => {
    const lookAt = new THREE.Matrix4();
    lookAt.lookAt(position, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
    const euler = new THREE.Euler();
    euler.setFromRotationMatrix(lookAt);
    return euler;
  }, [position]);

  useFrame((state, delta) => {
    // Base target scale
    let targetScale = isHovered ? 1.3 : isSelected ? 1.5 : 1;

    // Audio-reactive scale pulse
    if (audioData?.enabled) {
      // Different items respond to different frequencies based on their index
      const freqIndex = index % 5;
      const freqValues = [
        audioData.bass,
        audioData.lowMid,
        audioData.mid,
        audioData.highMid,
        audioData.treble,
      ];
      const freqResponse = freqValues[freqIndex] || 0;

      // Pulse on beat
      if (audioData.isBeat) {
        targetScale *= 1 + audioData.beatIntensity * 0.4;
      }

      // Continuous frequency response
      targetScale *= 1 + freqResponse * 0.2;
    }

    setScale((prev) => damp(prev, targetScale, 8, delta));

    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale);

      // Audio-reactive emissive glow
      if (audioData?.enabled && meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        const intensity = audioData.energy * 0.5;
        meshRef.current.material.emissive.setRGB(
          0.31 * intensity,
          0.27 * intensity,
          0.9 * intensity
        );
        meshRef.current.material.emissiveIntensity = intensity;
      }
    }

    // Pulse glow effect on beat
    if (glowRef.current && audioData?.enabled) {
      const glowScale = 1.1 + audioData.beatIntensity * 0.3;
      glowRef.current.scale.setScalar(glowScale);
      if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
        glowRef.current.material.opacity = 0.2 + audioData.beatIntensity * 0.4;
      }
    }
  });

  // Calculate aspect ratio
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const width = aspect > 1 ? cardSize : cardSize * aspect;
  const height = aspect > 1 ? cardSize / aspect : cardSize;

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => onHover(index)}
        onPointerLeave={() => onHover(null)}
        onClick={() => onClick(index)}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={isHovered || isSelected ? 1 : 0.85}
          side={THREE.DoubleSide}
          emissive="#4f46e5"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Audio-reactive glow ring */}
      {audioData?.enabled && (
        <mesh ref={glowRef} scale={1.1} position={[0, 0, -0.01]}>
          <ringGeometry args={[Math.max(width, height) * 0.52, Math.max(width, height) * 0.58, 32]} />
          <meshBasicMaterial
            color="#4f46e5"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Glow effect on hover */}
      {isHovered && !audioData?.enabled && (
        <mesh scale={1.1}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial
            color="#4f46e5"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Info tooltip on hover */}
      {isHovered && image.alt && (
        <Html center position={[0, -height / 2 - 0.3, 0.1]}>
          <div className="bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm">
            {image.alt}
          </div>
        </Html>
      )}
    </group>
  );
}

interface SphereSceneProps {
  images: GalleryImage[];
  autoRotate: boolean;
  rotationSpeed: number;
  radius: number;
  itemSize: number;
  onImageClick?: (image: GalleryImage, index: number) => void;
  audioData?: AudioReactiveData;
}

function SphereScene({
  images,
  autoRotate,
  rotationSpeed,
  radius,
  itemSize,
  onImageClick,
  audioData,
}: SphereSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { camera } = useThree();

  // Calculate positions using Fibonacci sphere distribution
  const positions = useMemo(
    () => fibonacciSphere(images.length, radius),
    [images.length, radius]
  );

  // Auto-rotation with audio modulation
  useFrame((state, delta) => {
    if (groupRef.current && autoRotate && hoveredIndex === null) {
      // Base rotation
      let speed = rotationSpeed;

      // Audio-reactive rotation speed
      if (audioData?.enabled) {
        speed *= 1 + audioData.energy * 2;
        // Add wobble on beat
        if (audioData.isBeat) {
          groupRef.current.rotation.x += Math.sin(state.clock.elapsedTime * 10) * 0.02 * audioData.beatIntensity;
        }
      }

      groupRef.current.rotation.y += speed * delta;
    }

    // Audio-reactive central core
    if (coreRef.current && audioData?.enabled) {
      const pulseScale = radius * 0.15 * (1 + audioData.bass * 0.8 + audioData.beatIntensity * 0.5);
      coreRef.current.scale.setScalar(pulseScale / (radius * 0.15));

      if (coreRef.current.material instanceof THREE.MeshBasicMaterial) {
        // Color shifts based on frequency
        const hue = (state.clock.elapsedTime * 0.1 + audioData.mid) % 1;
        coreRef.current.material.color.setHSL(hue, 0.8, 0.5);
        coreRef.current.material.opacity = 0.2 + audioData.energy * 0.5;
      }
    }

    // Wireframe pulse
    if (wireframeRef.current && audioData?.enabled) {
      const wireScale = 0.98 + audioData.bass * 0.1;
      wireframeRef.current.scale.setScalar(wireScale);
      if (wireframeRef.current.material instanceof THREE.MeshBasicMaterial) {
        wireframeRef.current.material.opacity = 0.1 + audioData.energy * 0.2;
      }
    }
  });

  const handleClick = useCallback(
    (index: number) => {
      setSelectedIndex(selectedIndex === index ? null : index);
      onImageClick?.(images[index], index);

      // Animate camera to look at selected image
      if (selectedIndex !== index && positions[index]) {
        const targetPosition = positions[index].clone().multiplyScalar(1.5);
        camera.position.lerp(targetPosition, 0.1);
      }
    },
    [selectedIndex, onImageClick, images, positions, camera]
  );

  return (
    <>
      {/* Ambient lighting with audio reactivity */}
      <ambientLight intensity={audioData?.enabled ? 0.4 + audioData.energy * 0.4 : 0.6} />
      <pointLight
        position={[10, 10, 10]}
        intensity={audioData?.enabled ? 0.8 + audioData.treble * 0.5 : 1}
        color={audioData?.enabled ? `hsl(${240 + audioData.mid * 60}, 80%, 60%)` : '#ffffff'}
      />
      <pointLight
        position={[-10, -10, -10]}
        intensity={audioData?.enabled ? 0.3 + audioData.bass * 0.4 : 0.5}
        color="#4f46e5"
      />

      {/* Central glow sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[radius * 0.15, 32, 32]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0.1} />
      </mesh>

      {/* Wireframe sphere guide */}
      <mesh ref={wireframeRef}>
        <sphereGeometry args={[radius * 0.98, 32, 16]} />
        <meshBasicMaterial color="#334155" wireframe transparent opacity={0.1} />
      </mesh>

      {/* Audio-reactive outer ring */}
      {audioData?.enabled && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.1, radius * 1.15 + audioData.bass * 0.2, 64]} />
          <meshBasicMaterial
            color={`hsl(${260 + audioData.mid * 40}, 80%, 50%)`}
            transparent
            opacity={0.3 + audioData.beatIntensity * 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Image cards */}
      <group ref={groupRef}>
        {images.map((image, index) => (
          <ImageCard
            key={`${image.src}-${index}`}
            image={image}
            position={positions[index]}
            index={index}
            isHovered={hoveredIndex === index}
            isSelected={selectedIndex === index}
            onHover={setHoveredIndex}
            onClick={handleClick}
            cardSize={itemSize}
            audioData={audioData}
          />
        ))}
      </group>

      {/* Orbit controls for user interaction */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={radius * 0.5}
        maxDistance={radius * 3}
        autoRotate={autoRotate && hoveredIndex === null}
        autoRotateSpeed={audioData?.enabled ? rotationSpeed * 2 * (1 + audioData.energy) : rotationSpeed * 2}
      />
    </>
  );
}

function FallbackGallery({ images }: { images: GalleryImage[] }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center">
        <p className="text-slate-400 mb-4">WebGL not supported</p>
        <div className="grid grid-cols-3 gap-2 max-w-md">
          {images.slice(0, 9).map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt || ''}
              className="w-24 h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SphereGallery({
  images,
  className = 'w-full h-[600px]',
  autoRotate = true,
  rotationSpeed = 0.3,
  radius = 5,
  itemSize = 1.2,
  onImageClick,
  audioData,
}: SphereGalleryProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  // Check WebGL support on mount
  if (typeof window !== 'undefined' && webglSupported) {
    try {
      const canvas = document.createElement('canvas');
      if (!canvas.getContext('webgl') && !canvas.getContext('experimental-webgl')) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }

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
        camera={{ position: [0, 0, radius * 2], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e1b4b)' }}
      >
        <SphereScene
          images={images}
          autoRotate={autoRotate}
          rotationSpeed={rotationSpeed}
          radius={radius}
          itemSize={itemSize}
          onImageClick={onImageClick}
          audioData={audioData}
        />
      </Canvas>
    </div>
  );
}
