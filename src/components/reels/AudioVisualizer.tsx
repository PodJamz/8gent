'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Vertex shader - simple passthrough
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Fragment shader - psychedelic audio-reactive visualization
const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_treble;
  uniform float u_energy;
  uniform float u_waveform[64];

  #define PI 3.14159265359

  // Noise functions
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  // Color palette
  vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 centered = uv - 0.5;
    centered.x *= u_resolution.x / u_resolution.y;

    float time = u_time * 0.5;

    // Radial distance from center
    float dist = length(centered);
    float angle = atan(centered.y, centered.x);

    // Audio-reactive warping
    float warp = u_bass * 0.3 + u_energy * 0.2;
    vec2 warped = centered;
    warped += vec2(
      sin(angle * 3.0 + time) * warp * 0.1,
      cos(angle * 2.0 - time) * warp * 0.1
    );

    // Layered noise with audio reactivity
    float n1 = fbm(warped * (3.0 + u_mid * 2.0) + time * 0.3);
    float n2 = fbm(warped * (5.0 + u_treble * 3.0) - time * 0.2 + n1);
    float n3 = fbm(warped * (2.0 + u_bass) + vec2(n1, n2) * 0.5);

    // Combine noise layers
    float pattern = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // Add circular waveform visualization
    float waveIndex = (angle + PI) / (2.0 * PI) * 64.0;
    int idx = int(mod(waveIndex, 64.0));
    float waveVal = 0.0;
    for (int i = 0; i < 64; i++) {
      if (i == idx) waveVal = u_waveform[i];
    }

    float waveRing = smoothstep(0.02, 0.0, abs(dist - 0.3 - waveVal * 0.15 * u_energy));

    // Pulsing rings
    float rings = sin(dist * 20.0 - time * 2.0 - u_bass * 5.0) * 0.5 + 0.5;
    rings *= smoothstep(0.8, 0.2, dist);

    // Color based on pattern and audio
    float colorShift = pattern + time * 0.1 + u_mid * 0.5;
    vec3 color = palette(colorShift);

    // Add bass-reactive glow
    color += vec3(0.8, 0.2, 0.4) * u_bass * rings * 0.5;

    // Add treble sparkles
    float sparkle = step(0.97, random(uv * 100.0 + time)) * u_treble * 2.0;
    color += vec3(1.0) * sparkle;

    // Add waveform ring
    color += vec3(0.3, 0.6, 1.0) * waveRing * 2.0;

    // Vignette
    float vignette = 1.0 - dist * 0.8;
    color *= vignette;

    // Energy-based brightness boost
    color *= 0.7 + u_energy * 0.5;

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface AudioVisualizerProps {
  analyserRef: React.RefObject<AnalyserNode | null>;
  className?: string;
  isPlaying?: boolean;
}

export function AudioVisualizer({ analyserRef, className, isPlaying }: AudioVisualizerProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const glRef = React.useRef<WebGLRenderingContext | null>(null);
  const programRef = React.useRef<WebGLProgram | null>(null);
  const animationRef = React.useRef<number>(0);
  const startTimeRef = React.useRef<number>(Date.now());

  // Initialize WebGL
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: true, alpha: false });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl;

    // Compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(fragmentShader));
    }

    // Create program
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    programRef.current = program;

    // Set up geometry (fullscreen quad)
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Animation loop
  React.useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) return;

    const render = () => {
      // Resize canvas if needed
      const displayWidth = canvas.clientWidth * window.devicePixelRatio;
      const displayHeight = canvas.clientHeight * window.devicePixelRatio;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.useProgram(program);

      // Get audio data
      let bass = 0, mid = 0, treble = 0, energy = 0;
      const waveform = new Float32Array(64);

      if (analyserRef.current && isPlaying) {
        const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(frequencyData);

        const timeData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteTimeDomainData(timeData);

        // Calculate frequency bands
        const binCount = frequencyData.length;
        const bassEnd = Math.floor(binCount * 0.1);
        const midEnd = Math.floor(binCount * 0.5);

        for (let i = 0; i < binCount; i++) {
          const val = frequencyData[i] / 255;
          energy += val;
          if (i < bassEnd) bass += val;
          else if (i < midEnd) mid += val;
          else treble += val;
        }

        bass /= bassEnd;
        mid /= (midEnd - bassEnd);
        treble /= (binCount - midEnd);
        energy /= binCount;

        // Get waveform data
        for (let i = 0; i < 64; i++) {
          const idx = Math.floor((i / 64) * timeData.length);
          waveform[i] = (timeData[idx] - 128) / 128;
        }
      } else {
        // Idle animation when not playing
        const t = (Date.now() - startTimeRef.current) / 1000;
        bass = 0.2 + Math.sin(t * 0.5) * 0.1;
        mid = 0.3 + Math.sin(t * 0.7) * 0.1;
        treble = 0.2 + Math.sin(t * 1.1) * 0.1;
        energy = 0.3;
        for (let i = 0; i < 64; i++) {
          waveform[i] = Math.sin(t * 2 + i * 0.2) * 0.3;
        }
      }

      // Set uniforms
      const time = (Date.now() - startTimeRef.current) / 1000;
      gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.height);
      gl.uniform1f(gl.getUniformLocation(program, 'u_time'), time);
      gl.uniform1f(gl.getUniformLocation(program, 'u_bass'), bass);
      gl.uniform1f(gl.getUniformLocation(program, 'u_mid'), mid);
      gl.uniform1f(gl.getUniformLocation(program, 'u_treble'), treble);
      gl.uniform1f(gl.getUniformLocation(program, 'u_energy'), energy);
      gl.uniform1fv(gl.getUniformLocation(program, 'u_waveform'), waveform);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full', className)}
      style={{ background: '#000' }}
    />
  );
}
