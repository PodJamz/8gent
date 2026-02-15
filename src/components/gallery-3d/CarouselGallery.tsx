'use client';

import { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html, Environment, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { GalleryImage, AudioReactiveData } from './types';
import { lerp } from './utils';

interface CarouselGalleryProps {
  images: GalleryImage[];
  className?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  radius?: number;
  itemWidth?: number;
  itemHeight?: number;
  showReflection?: boolean;
  onImageClick?: (image: GalleryImage, index: number) => void;
  audioData?: AudioReactiveData;
}

interface CarouselItemProps {
  image: GalleryImage;
  angle: number;
  radius: number;
  index: number;
  totalItems: number;
  currentRotation: number;
  isActive: boolean;
  width: number;
  height: number;
  onClick: () => void;
  audioData?: AudioReactiveData;
}

function CarouselItem({
  image,
  angle,
  radius,
  index,
  currentRotation,
  isActive,
  width,
  height,
  onClick,
  audioData,
}: CarouselItemProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(image.src);
  const [hovered, setHovered] = useState(false);

  // Calculate position on carousel
  const position = useMemo(() => {
    const theta = angle + currentRotation;
    return new THREE.Vector3(
      Math.sin(theta) * radius,
      0,
      Math.cos(theta) * radius
    );
  }, [angle, radius, currentRotation]);

  // Calculate rotation to face outward
  const rotation = useMemo(() => {
    return new THREE.Euler(0, angle + currentRotation + Math.PI, 0);
  }, [angle, currentRotation]);

  // Smooth scale animation with audio reactivity
  useFrame((state, delta) => {
    if (meshRef.current) {
      let targetScale = hovered ? 1.1 : isActive ? 1.05 : 1;

      // Audio reactive scaling
      if (audioData?.enabled) {
        const freqResponse = index % 2 === 0 ? audioData.bass : audioData.treble;
        targetScale *= 1 + freqResponse * 0.15;

        if (audioData.isBeat && isActive) {
          targetScale *= 1 + audioData.beatIntensity * 0.2;
        }
      }

      meshRef.current.scale.x = lerp(meshRef.current.scale.x, targetScale, delta * 8);
      meshRef.current.scale.y = lerp(meshRef.current.scale.y, targetScale, delta * 8);

      // Audio reactive emissive
      if (audioData?.enabled && meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        const intensity = isActive ? audioData.energy * 0.4 : audioData.energy * 0.1;
        meshRef.current.material.emissiveIntensity = intensity;
      }
    }

    // Frame glow on beat
    if (frameRef.current && audioData?.enabled) {
      if (frameRef.current.material instanceof THREE.MeshStandardMaterial) {
        const hue = (state.clock.elapsedTime * 0.1 + audioData.mid) % 1;
        if (isActive) {
          frameRef.current.material.color.setHSL(hue, 0.8, 0.4);
          frameRef.current.material.emissive.setHSL(hue, 0.8, 0.3);
          frameRef.current.material.emissiveIntensity = audioData.beatIntensity * 0.5;
        }
      }
    }
  });

  // Aspect ratio adjustment
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const cardWidth = aspect > 1 ? width : width * aspect;
  const cardHeight = aspect > 1 ? height / aspect : height;

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={onClick}
        castShadow
      >
        <planeGeometry args={[cardWidth, cardHeight]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={isActive ? 1 : 0.7}
          metalness={0.1}
          roughness={0.8}
          emissive="#4f46e5"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Frame border */}
      <mesh ref={frameRef} position={[0, 0, -0.01]}>
        <planeGeometry args={[cardWidth + 0.1, cardHeight + 0.1]} />
        <meshStandardMaterial
          color={isActive ? '#4f46e5' : '#334155'}
          metalness={0.5}
          roughness={0.3}
          emissive="#4f46e5"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Title on hover */}
      {hovered && image.alt && (
        <Html center position={[0, -cardHeight / 2 - 0.4, 0.1]}>
          <div className="bg-black/90 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap shadow-xl">
            {image.alt}
          </div>
        </Html>
      )}
    </group>
  );
}

interface CarouselSceneProps {
  images: GalleryImage[];
  autoRotate: boolean;
  rotationSpeed: number;
  radius: number;
  itemWidth: number;
  itemHeight: number;
  showReflection: boolean;
  onImageClick?: (image: GalleryImage, index: number) => void;
  audioData?: AudioReactiveData;
}

function CarouselScene({
  images,
  autoRotate,
  rotationSpeed,
  radius,
  itemWidth,
  itemHeight,
  showReflection,
  onImageClick,
  audioData,
}: CarouselSceneProps) {
  const [currentRotation, setCurrentRotation] = useState(0);
  const [targetRotation, setTargetRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const platformRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();

  const itemAngle = (Math.PI * 2) / images.length;

  // Calculate active item (front-facing)
  const activeIndex = useMemo(() => {
    const normalized = ((currentRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    return Math.round(normalized / itemAngle) % images.length;
  }, [currentRotation, itemAngle, images.length]);

  // Auto rotation with audio modulation
  useFrame((state, delta) => {
    if (!isDragging) {
      if (autoRotate) {
        let speed = rotationSpeed;

        // Audio reactive rotation speed
        if (audioData?.enabled) {
          speed *= 1 + audioData.energy * 1.5;
          // Reverse direction on heavy beat
          if (audioData.isBeat && audioData.beatIntensity > 0.7) {
            speed *= -0.5;
          }
        }

        setTargetRotation((prev) => prev + speed * delta);
      }
      setCurrentRotation((prev) => lerp(prev, targetRotation, delta * 5));
    }

    // Audio reactive platform
    if (platformRef.current && audioData?.enabled) {
      const pulseScale = 1 + audioData.bass * 0.2;
      platformRef.current.scale.x = lerp(platformRef.current.scale.x, pulseScale, delta * 8);
      platformRef.current.scale.z = lerp(platformRef.current.scale.z, pulseScale, delta * 8);

      if (platformRef.current.material instanceof THREE.MeshStandardMaterial) {
        const hue = (state.clock.elapsedTime * 0.05 + audioData.mid * 0.5) % 1;
        platformRef.current.material.emissive.setHSL(hue, 0.8, 0.2);
        platformRef.current.material.emissiveIntensity = audioData.beatIntensity * 0.3;
      }
    }
  });

  // Mouse/touch interaction
  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      setIsDragging(true);
      setDragStart(e.clientX);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const delta = (e.clientX - dragStart) * 0.005;
        setTargetRotation((prev) => prev - delta);
        setCurrentRotation((prev) => prev - delta);
        setDragStart(e.clientX);
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      // Snap to nearest item
      const snapAngle = Math.round(currentRotation / itemAngle) * itemAngle;
      setTargetRotation(snapAngle);
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [gl, isDragging, dragStart, currentRotation, itemAngle]);

  return (
    <>
      {/* Lighting with audio reactivity */}
      <ambientLight intensity={audioData?.enabled ? 0.3 + audioData.energy * 0.3 : 0.4} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={1}
        intensity={audioData?.enabled ? 0.8 + audioData.treble * 0.5 : 1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color={audioData?.enabled ? `hsl(${260 + audioData.mid * 40}, 70%, 70%)` : '#ffffff'}
      />
      <pointLight
        position={[10, 5, 10]}
        intensity={audioData?.enabled ? 0.4 + audioData.bass * 0.4 : 0.5}
        color="#4f46e5"
      />
      <pointLight
        position={[-10, 5, -10]}
        intensity={audioData?.enabled ? 0.4 + audioData.treble * 0.4 : 0.5}
        color="#06b6d4"
      />

      {/* Carousel items */}
      {images.map((image, index) => (
        <CarouselItem
          key={`${image.src}-${index}`}
          image={image}
          angle={index * itemAngle}
          radius={radius}
          index={index}
          totalItems={images.length}
          currentRotation={currentRotation}
          isActive={index === activeIndex}
          width={itemWidth}
          height={itemHeight}
          onClick={() => onImageClick?.(image, index)}
          audioData={audioData}
        />
      ))}

      {/* Reflective floor */}
      {showReflection && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -itemHeight / 2 - 0.5, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={audioData?.enabled ? 30 + audioData.energy * 40 : 50}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#0f172a"
            metalness={0.5}
            mirror={audioData?.enabled ? 0.3 + audioData.bass * 0.4 : 0.5}
          />
        </mesh>
      )}

      {/* Central platform */}
      <mesh ref={platformRef} position={[0, -itemHeight / 2 - 0.45, 0]}>
        <cylinderGeometry args={[radius * 0.3, radius * 0.35, 0.1, 64]} />
        <meshStandardMaterial
          color="#1e1b4b"
          metalness={0.8}
          roughness={0.2}
          emissive="#4f46e5"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Audio reactive ring around platform */}
      {audioData?.enabled && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -itemHeight / 2 - 0.4, 0]}>
          <ringGeometry args={[radius * 0.35, radius * 0.4 + audioData.bass * 0.2, 64]} />
          <meshBasicMaterial
            color={`hsl(${260 + audioData.mid * 60}, 80%, 50%)`}
            transparent
            opacity={0.4 + audioData.beatIntensity * 0.4}
          />
        </mesh>
      )}

      {/* Environment for reflections */}
      <Environment preset="city" />
    </>
  );
}

function FallbackGallery({ images }: { images: GalleryImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950 p-8">
      <div className="relative w-full max-w-2xl">
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt || ''}
          className="w-full h-64 object-cover rounded-xl shadow-2xl"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-white w-6' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-slate-400 mt-4 text-sm">WebGL not supported - showing fallback</p>
    </div>
  );
}

export default function CarouselGallery({
  images,
  className = 'w-full h-[600px]',
  autoRotate = true,
  rotationSpeed = 0.2,
  radius = 4,
  itemWidth = 2.5,
  itemHeight = 1.8,
  showReflection = true,
  onImageClick,
  audioData,
}: CarouselGalleryProps) {
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
        camera={{ position: [0, 2, radius * 2.5], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)' }}
      >
        <CarouselScene
          images={images}
          autoRotate={autoRotate}
          rotationSpeed={rotationSpeed}
          radius={radius}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          showReflection={showReflection}
          onImageClick={onImageClick}
          audioData={audioData}
        />
      </Canvas>
    </div>
  );
}
