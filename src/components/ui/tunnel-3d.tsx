'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { GALLERY_IMAGES } from '@/lib/gallery-images';

// Configuration
const TUNNEL_WIDTH = 20;
const TUNNEL_HEIGHT = 14;
const SEGMENT_DEPTH = 5;
const NUM_SEGMENTS = 12;
const FLOOR_COLS = 5;
const WALL_ROWS = 3;

const COL_WIDTH = TUNNEL_WIDTH / FLOOR_COLS;
const ROW_HEIGHT = TUNNEL_HEIGHT / WALL_ROWS;

// Pre-select a subset of images for the tunnel
const TUNNEL_IMAGES = GALLERY_IMAGES.filter(img =>
  img.src.startsWith('/photos/') || img.src.includes('blob.vercel')
).slice(0, 12);

interface ImagePlaneProps {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  imageSrc: string;
}

function ImagePlane({ position, rotation, width, height, imageSrc }: ImagePlaneProps) {
  const [opacity, setOpacity] = useState(0);
  const texture = useTexture(imageSrc);

  useEffect(() => {
    // Fade in
    const timeout = setTimeout(() => setOpacity(0.75), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width * 0.85, height * 0.85]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface TunnelSegmentProps {
  zPosition: number;
  lineColor: string;
  seed: number;
}

function TunnelSegment({ zPosition, lineColor, seed }: TunnelSegmentProps) {
  const w = TUNNEL_WIDTH / 2;
  const h = TUNNEL_HEIGHT / 2;
  const d = SEGMENT_DEPTH;

  // Create grid lines geometry
  const lineGeometry = useMemo(() => {
    const vertices: number[] = [];

    // Longitudinal lines (Z-axis)
    for (let i = 0; i <= FLOOR_COLS; i++) {
      const x = -w + (i * COL_WIDTH);
      // Floor
      vertices.push(x, -h, 0, x, -h, -d);
      // Ceiling
      vertices.push(x, h, 0, x, h, -d);
    }

    // Wall longitudinal lines
    for (let i = 1; i < WALL_ROWS; i++) {
      const y = -h + (i * ROW_HEIGHT);
      vertices.push(-w, y, 0, -w, y, -d);
      vertices.push(w, y, 0, w, y, -d);
    }

    // Ring at z=0
    vertices.push(-w, -h, 0, w, -h, 0);
    vertices.push(-w, h, 0, w, h, 0);
    vertices.push(-w, -h, 0, -w, h, 0);
    vertices.push(w, -h, 0, w, h, 0);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  }, [w, h, d]);

  // Deterministic random based on seed
  const seededRandom = (index: number) => {
    const x = Math.sin(seed * 9999 + index * 7919) * 10000;
    return x - Math.floor(x);
  };

  // Generate image placements
  const images = useMemo(() => {
    const result: ImagePlaneProps[] = [];
    let imageIndex = 0;

    // Floor images
    for (let i = 0; i < FLOOR_COLS; i++) {
      if (seededRandom(i) > 0.7) {
        result.push({
          position: [-w + i * COL_WIDTH + COL_WIDTH / 2, -h + 0.01, -d / 2],
          rotation: [-Math.PI / 2, 0, 0],
          width: COL_WIDTH,
          height: d,
          imageSrc: TUNNEL_IMAGES[imageIndex % TUNNEL_IMAGES.length].src,
        });
        imageIndex++;
      }
    }

    // Ceiling images (sparser)
    for (let i = 0; i < FLOOR_COLS; i++) {
      if (seededRandom(i + 100) > 0.85) {
        result.push({
          position: [-w + i * COL_WIDTH + COL_WIDTH / 2, h - 0.01, -d / 2],
          rotation: [Math.PI / 2, 0, 0],
          width: COL_WIDTH,
          height: d,
          imageSrc: TUNNEL_IMAGES[imageIndex % TUNNEL_IMAGES.length].src,
        });
        imageIndex++;
      }
    }

    // Left wall
    for (let i = 0; i < WALL_ROWS; i++) {
      if (seededRandom(i + 200) > 0.7) {
        result.push({
          position: [-w + 0.01, -h + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2],
          rotation: [0, Math.PI / 2, 0],
          width: d,
          height: ROW_HEIGHT,
          imageSrc: TUNNEL_IMAGES[imageIndex % TUNNEL_IMAGES.length].src,
        });
        imageIndex++;
      }
    }

    // Right wall
    for (let i = 0; i < WALL_ROWS; i++) {
      if (seededRandom(i + 300) > 0.7) {
        result.push({
          position: [w - 0.01, -h + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2],
          rotation: [0, -Math.PI / 2, 0],
          width: d,
          height: ROW_HEIGHT,
          imageSrc: TUNNEL_IMAGES[imageIndex % TUNNEL_IMAGES.length].src,
        });
        imageIndex++;
      }
    }

    return result;
  }, [seed, w, h, d]);

  return (
    <group position={[0, 0, zPosition]}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={lineColor} transparent opacity={0.3} />
      </lineSegments>
      {images.map((img, i) => (
        <ImagePlane key={`${zPosition}-${i}`} {...img} />
      ))}
    </group>
  );
}

interface TunnelSceneProps {
  speed?: number;
  lineColor?: string;
}

function TunnelScene({ speed = 0.3, lineColor = '#64748b' }: TunnelSceneProps) {
  const { camera } = useThree();
  const segmentSeeds = useRef<number[]>([]);

  // Initialize seeds
  if (segmentSeeds.current.length === 0) {
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      segmentSeeds.current.push(Math.random() * 1000);
    }
  }

  const [segments, setSegments] = useState(() =>
    Array.from({ length: NUM_SEGMENTS }, (_, i) => ({
      z: -i * SEGMENT_DEPTH,
      seed: segmentSeeds.current[i],
    }))
  );

  useFrame((_, delta) => {
    // Move camera forward slowly
    camera.position.z -= speed * delta;

    // Recycle segments
    setSegments(prev => {
      const camZ = camera.position.z;
      return prev.map(seg => {
        if (seg.z > camZ + SEGMENT_DEPTH) {
          // Move to back
          const minZ = Math.min(...prev.map(s => s.z));
          return { z: minZ - SEGMENT_DEPTH, seed: Math.random() * 1000 };
        }
        return seg;
      });
    });
  });

  return (
    <>
      <fog attach="fog" args={['#0f172a', 5, 50]} />
      {segments.map((seg, i) => (
        <TunnelSegment
          key={i}
          zPosition={seg.z}
          lineColor={lineColor}
          seed={seg.seed}
        />
      ))}
    </>
  );
}

interface Tunnel3DProps {
  className?: string;
  speed?: number;
  lineColor?: string;
  onReady?: () => void;
}

export function Tunnel3D({
  className = '',
  speed = 0.3,
  lineColor = '#64748b',
  onReady,
}: Tunnel3DProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 70, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#0f172a' }}
        onCreated={() => {
          // Canvas is ready, signal to parent
          onReady?.();
        }}
      >
        <TunnelScene speed={speed} lineColor={lineColor} />
      </Canvas>
    </div>
  );
}
