'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WarpfieldParticlesProps {
  particleCount?: number;
  baseRadius?: number;
  influenceRadius?: number;
  maxDistortion?: number;
  dampingFactor?: number;
  particleColor?: THREE.Color;
  secondaryColor?: THREE.Color;
  audioData?: {
    bass: number;
    mid: number;
    treble: number;
    energy: number;
    beatIntensity: number;
  };
}

// Spring physics for smooth motion
interface ParticleState {
  velocity: THREE.Vector3;
  basePosition: THREE.Vector3;
}

export default function WarpfieldParticles({
  particleCount = 5000,
  baseRadius = 3,
  influenceRadius = 2,
  maxDistortion = 0.5,
  dampingFactor = 0.92,
  particleColor = new THREE.Color('#ff6b35'),
  secondaryColor = new THREE.Color('#00ff88'),
  audioData,
}: WarpfieldParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  // Store particle states for physics
  const particleStates = useRef<ParticleState[]>([]);
  const wavefrontRef = useRef(0);
  const timeRef = useRef(0);

  // Create geometry with initial positions
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Torus knot parameters
    const p = 3;
    const q = 2;
    const tubeRadius = 0.8;

    for (let i = 0; i < particleCount; i++) {
      // Distribute particles along torus knot
      const u = (i / particleCount) * Math.PI * 2 * p;
      const noiseU = (Math.random() - 0.5) * 0.5;

      // Torus knot formula
      const cu = Math.cos(u + noiseU);
      const su = Math.sin(u + noiseU);
      const quOverP = (q / p) * (u + noiseU);
      const cs = Math.cos(quOverP);

      const r = baseRadius * (2 + cs) * 0.4;
      let x = r * cu;
      let y = r * su;
      let z = baseRadius * Math.sin(quOverP) * 0.4;

      // Add tube thickness with random angle
      const tubeAngle = Math.random() * Math.PI * 2;
      const tubeOffset = tubeRadius * (0.5 + Math.random() * 0.5);
      x += Math.cos(tubeAngle) * tubeOffset * cu * 0.3;
      y += Math.cos(tubeAngle) * tubeOffset * su * 0.3;
      z += Math.sin(tubeAngle) * tubeOffset * 0.3;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color gradient
      const t = i / particleCount;
      const mixedColor = new THREE.Color().lerpColors(particleColor, secondaryColor, t);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      // Varied particle sizes
      sizes[i] = 3 + Math.random() * 4;

      // Initialize particle state
      particleStates.current[i] = {
        velocity: new THREE.Vector3(0, 0, 0),
        basePosition: new THREE.Vector3(x, y, z),
      };
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    return geo;
  }, [particleCount, baseRadius, particleColor, secondaryColor]);

  // Animation frame
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    timeRef.current += delta;
    const geo = pointsRef.current.geometry;
    const positionAttr = geo.attributes.position as THREE.BufferAttribute;
    const sizeAttr = geo.attributes.size as THREE.BufferAttribute;
    const colorAttr = geo.attributes.color as THREE.BufferAttribute;

    // Get audio data (default to idle animation if no audio)
    const bass = audioData?.bass ?? 0;
    const mid = audioData?.mid ?? 0;
    const treble = audioData?.treble ?? 0;
    const energy = audioData?.energy ?? 0;
    const beatIntensity = audioData?.beatIntensity ?? 0;

    // Idle animation when no audio
    const idleTime = timeRef.current;
    const idlePulse = Math.sin(idleTime * 0.5) * 0.5 + 0.5;
    const idleWave = Math.sin(idleTime * 0.3) * 0.3;

    // Update wavefront propagation
    wavefrontRef.current += delta * 2 * (1 + bass * 3 + idlePulse * 0.2);
    if (wavefrontRef.current > baseRadius * 4) {
      wavefrontRef.current = 0;
    }

    // Process each particle
    for (let i = 0; i < particleCount; i++) {
      const ps = particleStates.current[i];
      const baseX = ps.basePosition.x;
      const baseY = ps.basePosition.y;
      const baseZ = ps.basePosition.z;

      // Current position
      let currX = positionAttr.array[i * 3];
      let currY = positionAttr.array[i * 3 + 1];
      let currZ = positionAttr.array[i * 3 + 2];

      // Distance from center for wavefront effect
      const distFromCenter = Math.sqrt(baseX * baseX + baseY * baseY + baseZ * baseZ);

      // === HIGHS/TREBLE: Jitter velocity ===
      const jitterStrength = (treble + idlePulse * 0.1) * maxDistortion * 0.5;
      const jitterX = (Math.random() - 0.5) * jitterStrength;
      const jitterY = (Math.random() - 0.5) * jitterStrength;
      const jitterZ = (Math.random() - 0.5) * jitterStrength;

      // === SUB-BASS: Propagating wavefront ===
      const wavefrontDist = Math.abs(distFromCenter - wavefrontRef.current);
      const wavefrontInfluence = Math.max(0, 1 - wavefrontDist / influenceRadius);
      const wavefrontForce = wavefrontInfluence * (bass + idleWave * 0.2) * maxDistortion;

      // Direction from center
      const dirX = baseX / (distFromCenter || 1);
      const dirY = baseY / (distFromCenter || 1);
      const dirZ = baseZ / (distFromCenter || 1);

      // Apply forces
      ps.velocity.x += dirX * wavefrontForce * 0.3 + jitterX;
      ps.velocity.y += dirY * wavefrontForce * 0.3 + jitterY;
      ps.velocity.z += dirZ * wavefrontForce * 0.3 + jitterZ;

      // Spring force back to base position
      const springStrength = 2.0;
      ps.velocity.x += (baseX - currX) * springStrength * delta;
      ps.velocity.y += (baseY - currY) * springStrength * delta;
      ps.velocity.z += (baseZ - currZ) * springStrength * delta;

      // Apply damping
      ps.velocity.multiplyScalar(dampingFactor);

      // Update position
      currX += ps.velocity.x * delta * 60;
      currY += ps.velocity.y * delta * 60;
      currZ += ps.velocity.z * delta * 60;

      // Write to buffer
      positionAttr.array[i * 3] = currX;
      positionAttr.array[i * 3 + 1] = currY;
      positionAttr.array[i * 3 + 2] = currZ;

      // === MIDS: Expand particle radius ===
      const baseSize = 3 + (i % 5);
      const sizeMultiplier = 1 + (mid + idlePulse * 0.3) * 1.5;
      sizeAttr.array[i] = baseSize * sizeMultiplier;

      // Color modulation based on energy
      const t = i / particleCount;
      const energyBoost = 0.4 + (energy + idlePulse * 0.3) * 0.6;
      const mixedColor = new THREE.Color().lerpColors(particleColor, secondaryColor, t);

      // Brighten on beats
      if (beatIntensity > 0.3) {
        mixedColor.lerp(new THREE.Color(1, 1, 1), beatIntensity * 0.4);
      }

      colorAttr.array[i * 3] = mixedColor.r * energyBoost;
      colorAttr.array[i * 3 + 1] = mixedColor.g * energyBoost;
      colorAttr.array[i * 3 + 2] = mixedColor.b * energyBoost;
    }

    positionAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;

    // Gentle rotation of entire system
    pointsRef.current.rotation.y += delta * 0.15 * (1 + energy * 0.5);
    pointsRef.current.rotation.x = Math.sin(timeRef.current * 0.2) * 0.15;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        vertexColors
        size={4}
        sizeAttenuation
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
