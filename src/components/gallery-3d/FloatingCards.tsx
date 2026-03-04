'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html, Float, OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { GalleryImage, AudioReactiveData } from './types';
import { lerp } from './utils';

interface FloatingCardsProps {
  images: GalleryImage[];
  className?: string;
  cardWidth?: number;
  cardHeight?: number;
  spread?: number;
  floatSpeed?: number;
  floatIntensity?: number;
  onImageClick?: (image: GalleryImage, index: number) => void;
  audioData?: AudioReactiveData;
}

interface Card3DProps {
  image: GalleryImage;
  position: [number, number, number];
  rotation: [number, number, number];
  index: number;
  cardWidth: number;
  cardHeight: number;
  floatSpeed: number;
  floatIntensity: number;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (index: number | null) => void;
  onClick: () => void;
}

function Card3D({
  image,
  position,
  rotation,
  index,
  cardWidth,
  cardHeight,
  floatSpeed,
  floatIntensity,
  isHovered,
  isSelected,
  onHover,
  onClick,
}: Card3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(image.src);
  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0 });

  // Adjust texture aspect
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const imgWidth = aspect > 1 ? cardWidth * 0.9 : (cardWidth * 0.9 * aspect);
  const imgHeight = aspect > 1 ? (cardHeight * 0.85) / aspect : cardHeight * 0.85;

  useFrame((state, delta) => {
    if (!groupRef.current || !cardRef.current) return;

    // Smooth scale animation
    const targetScale = isSelected ? 1.4 : isHovered ? 1.15 : 1;
    groupRef.current.scale.x = lerp(groupRef.current.scale.x, targetScale, delta * 6);
    groupRef.current.scale.y = lerp(groupRef.current.scale.y, targetScale, delta * 6);
    groupRef.current.scale.z = lerp(groupRef.current.scale.z, targetScale, delta * 6);

    // Card tilt on hover
    if (isHovered) {
      const time = state.clock.elapsedTime;
      setCardRotation({
        x: Math.sin(time * 2) * 0.05,
        y: Math.cos(time * 2) * 0.05,
      });
    } else {
      setCardRotation({ x: 0, y: 0 });
    }

    cardRef.current.rotation.x = lerp(cardRef.current.rotation.x, cardRotation.x, delta * 5);
    cardRef.current.rotation.y = lerp(cardRef.current.rotation.y, cardRotation.y, delta * 5);
  });

  const cardDepth = 0.02;

  return (
    <Float
      speed={floatSpeed}
      rotationIntensity={0.2}
      floatIntensity={floatIntensity}
      floatingRange={[-0.1, 0.1]}
    >
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
        onPointerEnter={() => onHover(index)}
        onPointerLeave={() => onHover(null)}
        onClick={onClick}
      >
        <mesh ref={cardRef}>
          {/* Card body */}
          <RoundedBox args={[cardWidth, cardHeight, cardDepth]} radius={0.05} smoothness={4}>
            <meshStandardMaterial
              color={isHovered ? '#ffffff' : '#f8fafc'}
              metalness={0.1}
              roughness={0.3}
            />
          </RoundedBox>

          {/* Image on card */}
          <mesh position={[0, 0.05, cardDepth / 2 + 0.001]}>
            <planeGeometry args={[imgWidth, imgHeight]} />
            <meshStandardMaterial map={texture} />
          </mesh>

          {/* Card shadow */}
          <mesh position={[0.05, -0.05, -cardDepth]} rotation={[0, 0, 0]}>
            <RoundedBox args={[cardWidth, cardHeight, 0.01]} radius={0.05} smoothness={4}>
              <meshBasicMaterial color="#000000" transparent opacity={0.15} />
            </RoundedBox>
          </mesh>

          {/* Title strip at bottom */}
          {image.alt && (
            <mesh position={[0, -cardHeight / 2 + 0.15, cardDepth / 2 + 0.002]}>
              <planeGeometry args={[cardWidth - 0.2, 0.2]} />
              <meshBasicMaterial color="#1e1b4b" />
            </mesh>
          )}
        </mesh>

        {/* Glow effect on selection */}
        {isSelected && (
          <mesh position={[0, 0, -0.02]}>
            <RoundedBox args={[cardWidth + 0.15, cardHeight + 0.15, 0.01]} radius={0.08} smoothness={4}>
              <meshBasicMaterial color="#4f46e5" transparent opacity={0.4} />
            </RoundedBox>
          </mesh>
        )}

        {/* Hover label */}
        {isHovered && image.alt && (
          <Html center position={[0, -cardHeight / 2 - 0.3, 0]}>
            <div className="bg-slate-900/95 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap shadow-xl border border-indigo-500/30">
              <span className="font-medium">{image.alt}</span>
              {image.description && (
                <p className="text-slate-400 text-xs mt-1">{image.description}</p>
              )}
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

interface CardsSceneProps {
  images: GalleryImage[];
  cardWidth: number;
  cardHeight: number;
  spread: number;
  floatSpeed: number;
  floatIntensity: number;
  onImageClick?: (image: GalleryImage, index: number) => void;
  audioData?: AudioReactiveData;
}

function CardsScene({
  images,
  cardWidth,
  cardHeight,
  spread,
  floatSpeed,
  floatIntensity,
  onImageClick,
  audioData,
}: CardsSceneProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Generate card positions in a scattered but organized manner
  const cardConfigs = useMemo(() => {
    return images.map((_, i) => {
      const cols = Math.ceil(Math.sqrt(images.length));
      const row = Math.floor(i / cols);
      const col = i % cols;

      // Base grid position with offset
      const baseX = (col - (cols - 1) / 2) * (cardWidth + 0.5) * spread;
      const baseY = (row - Math.floor(images.length / cols) / 2) * (cardHeight + 0.4) * spread;
      const baseZ = (Math.random() - 0.5) * 2;

      // Add some randomness
      const x = baseX + (Math.random() - 0.5) * 0.5;
      const y = baseY + (Math.random() - 0.5) * 0.3;
      const z = baseZ;

      // Slight random rotation
      const rotX = (Math.random() - 0.5) * 0.2;
      const rotY = (Math.random() - 0.5) * 0.3;
      const rotZ = (Math.random() - 0.5) * 0.1;

      return {
        position: [x, y, z] as [number, number, number],
        rotation: [rotX, rotY, rotZ] as [number, number, number],
      };
    });
  }, [images.length, cardWidth, cardHeight, spread]);

  return (
    <>
      {/* Soft lighting with audio reactivity */}
      <ambientLight intensity={audioData?.enabled ? 0.5 + audioData.energy * 0.3 : 0.6} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={audioData?.enabled ? 0.8 + audioData.treble * 0.4 : 1}
        castShadow
        color={audioData?.enabled ? `hsl(${240 + audioData.mid * 40}, 70%, 80%)` : '#ffffff'}
      />
      <directionalLight position={[-5, 5, -5]} intensity={audioData?.enabled ? 0.2 + audioData.bass * 0.3 : 0.3} color="#4f46e5" />
      <pointLight position={[0, 0, 5]} intensity={audioData?.enabled ? 0.4 + audioData.mid * 0.4 : 0.5} color="#06b6d4" />

      {/* Cards */}
      {images.map((image, index) => (
        <Card3D
          key={`${image.src}-${index}`}
          image={image}
          position={cardConfigs[index].position}
          rotation={cardConfigs[index].rotation}
          index={index}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          floatSpeed={floatSpeed}
          floatIntensity={floatIntensity}
          isHovered={hoveredIndex === index}
          isSelected={selectedIndex === index}
          onHover={setHoveredIndex}
          onClick={() => {
            setSelectedIndex(selectedIndex === index ? null : index);
            onImageClick?.(image, index);
          }}
        />
      ))}

      {/* Decorative background elements */}
      <BackgroundElements spread={spread * 3} audioData={audioData} />

      {/* Orbit controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minDistance={3}
        maxDistance={20}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
}

function BackgroundElements({ spread, audioData }: { spread: number; audioData?: AudioReactiveData }) {
  const groupRef = useRef<THREE.Group>(null);

  // Create floating geometric shapes
  const shapes = useMemo(() => {
    const items = [];
    for (let i = 0; i < 20; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread - 5,
        ] as [number, number, number],
        scale: 0.1 + Math.random() * 0.2,
        type: Math.random() > 0.5 ? 'box' : 'sphere',
      });
    }
    return items;
  }, [spread]);

  useFrame((state) => {
    if (groupRef.current) {
      let rotSpeed = state.clock.elapsedTime * 0.02;

      if (audioData?.enabled) {
        rotSpeed *= 1 + audioData.energy * 2;
      }

      groupRef.current.rotation.y = rotSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <Float
          key={i}
          speed={audioData?.enabled ? 1 + audioData.energy * 2 : 1}
          floatIntensity={audioData?.enabled ? 0.5 + audioData.beatIntensity * 0.5 : 0.5}
        >
          <mesh position={shape.position} scale={audioData?.enabled ? shape.scale * (1 + audioData.bass * 0.5) : shape.scale}>
            {shape.type === 'box' ? (
              <boxGeometry args={[1, 1, 1]} />
            ) : (
              <sphereGeometry args={[0.5, 16, 16]} />
            )}
            <meshStandardMaterial
              color={audioData?.enabled ? `hsl(${260 + audioData.mid * 60}, 70%, 50%)` : '#4f46e5'}
              transparent
              opacity={audioData?.enabled ? 0.1 + audioData.energy * 0.2 : 0.1}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function FallbackGallery({ images }: { images: GalleryImage[] }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-indigo-50 p-8 overflow-y-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {images.map((img, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg p-3 transform hover:scale-105 hover:-rotate-1 transition-all duration-300"
          >
            <img
              src={img.src}
              alt={img.alt || ''}
              className="w-full h-40 object-cover rounded-lg"
            />
            {img.alt && (
              <p className="text-slate-700 text-sm mt-2 font-medium">{img.alt}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FloatingCards({
  images,
  className = 'w-full h-[600px]',
  cardWidth = 1.8,
  cardHeight = 2.4,
  spread = 1,
  floatSpeed = 2,
  floatIntensity = 0.3,
  onImageClick,
  audioData,
}: FloatingCardsProps) {
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
        camera={{ position: [0, 0, 8], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f8fafc 100%)' }}
      >
        <CardsScene
          images={images}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          spread={spread}
          floatSpeed={audioData?.enabled ? floatSpeed * (1 + audioData.energy) : floatSpeed}
          floatIntensity={audioData?.enabled ? floatIntensity * (1 + audioData.beatIntensity) : floatIntensity}
          onImageClick={onImageClick}
          audioData={audioData}
        />
      </Canvas>
    </div>
  );
}
