'use client';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import type { GalleryImage, AudioReactiveData } from './types';
import { lerp } from './utils';

interface RoomGalleryProps {
  images: GalleryImage[];
  className?: string;
  roomWidth?: number;
  roomHeight?: number;
  roomDepth?: number;
  frameSize?: number;
  walkSpeed?: number;
  onImageClick?: (image: GalleryImage, index: number) => void;
  audioData?: AudioReactiveData;
}

interface WallPaintingProps {
  image: GalleryImage;
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
  index: number;
  onHover: (index: number | null) => void;
  onClick: () => void;
  isHovered: boolean;
  audioData?: AudioReactiveData;
}

function WallPainting({
  image,
  position,
  rotation,
  size,
  index,
  onHover,
  onClick,
  isHovered,
  audioData,
}: WallPaintingProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(image.src);
  const [lightIntensity, setLightIntensity] = useState(0.5);

  useFrame((state, delta) => {
    // Calculate target light intensity with audio reactivity
    let targetIntensity = isHovered ? 1.5 : 0.5;

    if (audioData?.enabled) {
      // Each painting responds to different frequency bands
      const freqValues = [audioData.bass, audioData.lowMid, audioData.mid, audioData.highMid, audioData.treble];
      const freqResponse = freqValues[index % 5] || 0;
      targetIntensity += freqResponse * 0.8;

      if (audioData.isBeat) {
        targetIntensity += audioData.beatIntensity * 0.5;
      }
    }

    setLightIntensity((prev) => lerp(prev, targetIntensity, delta * 5));

    // Audio reactive frame glow
    if (frameRef.current && audioData?.enabled) {
      if (frameRef.current.material instanceof THREE.MeshStandardMaterial) {
        const hue = (state.clock.elapsedTime * 0.05 + index * 0.1) % 1;
        frameRef.current.material.emissive.setHSL(hue, 0.6, 0.2);
        frameRef.current.material.emissiveIntensity = audioData.beatIntensity * 0.3;
      }
    }
  });

  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const width = aspect > 1 ? size : size * aspect;
  const height = aspect > 1 ? size / aspect : size;

  const frameThickness = 0.08;
  const frameDepth = 0.05;

  // Calculate spotlight color based on audio
  const spotlightColor = audioData?.enabled
    ? `hsl(${40 + audioData.mid * 30}, ${50 + audioData.energy * 30}%, 90%)`
    : '#fff5e6';

  return (
    <group position={position} rotation={rotation}>
      {/* Spotlight for painting with audio reactivity */}
      <spotLight
        position={[0, height / 2 + 0.5, 0.5]}
        angle={audioData?.enabled ? 0.6 + audioData.energy * 0.2 : 0.6}
        penumbra={0.5}
        intensity={lightIntensity}
        color={spotlightColor}
        target-position={[0, 0, 0]}
      />

      {/* Frame with audio-reactive emissive */}
      <mesh ref={frameRef} position={[0, 0, -frameDepth / 2]}>
        <boxGeometry args={[width + frameThickness * 2, height + frameThickness * 2, frameDepth]} />
        <meshStandardMaterial
          color={isHovered ? '#8b7355' : '#5c4a32'}
          metalness={audioData?.enabled ? 0.3 + audioData.treble * 0.3 : 0.3}
          roughness={0.7}
          emissive="#4f46e5"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Canvas/Painting */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0.01]}
        onPointerEnter={() => onHover(index)}
        onPointerLeave={() => onHover(null)}
        onClick={onClick}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Museum label */}
      {isHovered && image.alt && (
        <Html center position={[0, -height / 2 - 0.4, 0.1]}>
          <div className="bg-white/95 text-gray-800 px-4 py-2 rounded shadow-lg min-w-[150px]">
            <p className="font-serif text-sm font-medium">{image.alt}</p>
            {image.description && (
              <p className="text-xs text-gray-500 mt-1">{image.description}</p>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

interface RoomSceneProps {
  images: GalleryImage[];
  roomWidth: number;
  roomHeight: number;
  roomDepth: number;
  frameSize: number;
  walkSpeed: number;
  onImageClick?: (image: GalleryImage, index: number) => void;
  audioData?: AudioReactiveData;
}

function Player({ speed }: { speed: number }) {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    const keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const interval = setInterval(() => {
      direction.current.set(0, 0, 0);

      if (keys['KeyW'] || keys['ArrowUp']) direction.current.z -= 1;
      if (keys['KeyS'] || keys['ArrowDown']) direction.current.z += 1;
      if (keys['KeyA'] || keys['ArrowLeft']) direction.current.x -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) direction.current.x += 1;

      direction.current.normalize();
      direction.current.applyQuaternion(camera.quaternion);
      direction.current.y = 0;

      velocity.current.lerp(direction.current.multiplyScalar(speed), 0.1);
      camera.position.add(velocity.current);

      // Keep camera at eye level
      camera.position.y = 1.6;
    }, 16);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(interval);
    };
  }, [camera, speed]);

  return null;
}

function RoomScene({
  images,
  roomWidth,
  roomHeight,
  roomDepth,
  frameSize,
  walkSpeed,
  onImageClick,
  audioData,
}: RoomSceneProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Calculate painting positions along walls
  const paintings = useMemo(() => {
    const result: Array<{
      image: GalleryImage;
      position: [number, number, number];
      rotation: [number, number, number];
      index: number;
    }> = [];

    const spacing = 3;
    let imageIndex = 0;

    // Left wall
    const leftWallPaintings = Math.floor(roomDepth / spacing) - 1;
    for (let i = 0; i < leftWallPaintings && imageIndex < images.length; i++) {
      result.push({
        image: images[imageIndex],
        position: [-roomWidth / 2 + 0.1, roomHeight / 2 - 0.5, -roomDepth / 2 + spacing + i * spacing],
        rotation: [0, Math.PI / 2, 0],
        index: imageIndex,
      });
      imageIndex++;
    }

    // Right wall
    const rightWallPaintings = Math.floor(roomDepth / spacing) - 1;
    for (let i = 0; i < rightWallPaintings && imageIndex < images.length; i++) {
      result.push({
        image: images[imageIndex],
        position: [roomWidth / 2 - 0.1, roomHeight / 2 - 0.5, -roomDepth / 2 + spacing + i * spacing],
        rotation: [0, -Math.PI / 2, 0],
        index: imageIndex,
      });
      imageIndex++;
    }

    // Back wall
    const backWallPaintings = Math.floor(roomWidth / spacing) - 1;
    for (let i = 0; i < backWallPaintings && imageIndex < images.length; i++) {
      result.push({
        image: images[imageIndex],
        position: [-roomWidth / 2 + spacing + i * spacing, roomHeight / 2 - 0.5, roomDepth / 2 - 0.1],
        rotation: [0, Math.PI, 0],
        index: imageIndex,
      });
      imageIndex++;
    }

    return result;
  }, [images, roomWidth, roomHeight, roomDepth]);

  return (
    <>
      {/* Ambient museum lighting with audio reactivity */}
      <ambientLight intensity={audioData?.enabled ? 0.25 + audioData.energy * 0.2 : 0.3} />
      <hemisphereLight
        intensity={audioData?.enabled ? 0.35 + audioData.mid * 0.2 : 0.4}
        groundColor={audioData?.enabled ? `hsl(${30 + audioData.bass * 20}, 30%, 15%)` : '#3d3d3d'}
      />

      {/* Ceiling lights with audio-reactive pulse */}
      {Array.from({ length: 4 }).map((_, i) => {
        const freqValues = [audioData?.bass || 0, audioData?.lowMid || 0, audioData?.mid || 0, audioData?.treble || 0];
        const lightPulse = audioData?.enabled ? 0.8 + freqValues[i] * 0.6 : 0.8;
        const emissivePulse = audioData?.enabled ? 0.5 + audioData.beatIntensity * 0.5 : 0.5;

        return (
          <group key={i} position={[0, roomHeight - 0.1, -roomDepth / 4 + (i * roomDepth) / 3]}>
            <pointLight
              intensity={lightPulse}
              distance={audioData?.enabled ? 8 + audioData.energy * 4 : 8}
              color={audioData?.enabled ? `hsl(${40 + audioData.mid * 30}, 70%, 90%)` : '#fff5e6'}
            />
            <mesh>
              <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive={audioData?.enabled ? `hsl(${40 + audioData.mid * 20}, 80%, 70%)` : '#fff5e6'}
                emissiveIntensity={emissivePulse}
              />
            </mesh>
          </group>
        );
      })}

      {/* Floor with audio-reactive reflectivity */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial
          color={audioData?.enabled ? `hsl(${30 + audioData.bass * 10}, 15%, 12%)` : '#2a2520'}
          roughness={audioData?.enabled ? 0.8 - audioData.energy * 0.2 : 0.8}
          metalness={audioData?.enabled ? 0.1 + audioData.treble * 0.2 : 0.1}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial color="#f5f5f0" />
      </mesh>

      {/* Walls */}
      {/* Left wall */}
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshStandardMaterial color="#e8e4df" />
      </mesh>

      {/* Right wall */}
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshStandardMaterial color="#e8e4df" />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, roomHeight / 2, roomDepth / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshStandardMaterial color="#dcd8d3" />
      </mesh>

      {/* Front wall (with entrance) */}
      <mesh position={[0, roomHeight / 2, -roomDepth / 2]}>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshStandardMaterial color="#e8e4df" />
      </mesh>

      {/* Paintings with audio reactivity */}
      {paintings.map(({ image, position, rotation, index }) => (
        <WallPainting
          key={`${image.src}-${index}`}
          image={image}
          position={position}
          rotation={rotation}
          size={frameSize}
          index={index}
          onHover={setHoveredIndex}
          onClick={() => onImageClick?.(image, index)}
          isHovered={hoveredIndex === index}
          audioData={audioData}
        />
      ))}

      {/* Benches */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[2, 0.5, 0.6]} />
        <meshStandardMaterial color="#4a3f35" />
      </mesh>

      {/* Player movement */}
      <Player speed={walkSpeed} />

      {/* First-person controls */}
      <PointerLockControls
        onLock={() => setIsLocked(true)}
        onUnlock={() => setIsLocked(false)}
      />
    </>
  );
}

function FallbackGallery({ images }: { images: GalleryImage[] }) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-stone-100 to-stone-200 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-serif text-stone-800 mb-6 text-center">Gallery Exhibition</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <div key={i} className="bg-white p-4 shadow-lg">
              <img
                src={img.src}
                alt={img.alt || ''}
                className="w-full h-40 object-cover"
              />
              {img.alt && (
                <p className="text-stone-600 text-sm mt-2 font-serif">{img.alt}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RoomGallery({
  images,
  className = 'w-full h-[700px]',
  roomWidth = 12,
  roomHeight = 4,
  roomDepth = 20,
  frameSize = 1.8,
  walkSpeed = 0.08,
  onImageClick,
  audioData,
}: RoomGalleryProps) {
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
        camera={{ position: [0, 1.6, -roomDepth / 2 + 2], fov: 75 }}
        shadows
        gl={{ antialias: true }}
        style={{ background: '#1a1a1a' }}
      >
        <RoomScene
          images={images}
          roomWidth={roomWidth}
          roomHeight={roomHeight}
          roomDepth={roomDepth}
          frameSize={frameSize}
          walkSpeed={audioData?.enabled ? walkSpeed * (1 + audioData.energy * 0.5) : walkSpeed}
          onImageClick={onImageClick}
          audioData={audioData}
        />
      </Canvas>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
        Click to look around | WASD or Arrow keys to walk
      </div>
    </div>
  );
}
