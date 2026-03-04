// Custom GLSL shaders for 3D Gallery effects

/**
 * Holographic/Iridescent shader for futuristic gallery items
 */
export const holographicShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform float time;
    uniform float opacity;
    uniform float hologramIntensity;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    void main() {
      vec4 texColor = texture2D(map, vUv);

      // Fresnel effect for edge glow
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);

      // Holographic rainbow shift
      float hue = fract(vUv.y * 2.0 + time * 0.1);
      vec3 rainbow = vec3(
        sin(hue * 6.28318 + 0.0) * 0.5 + 0.5,
        sin(hue * 6.28318 + 2.094) * 0.5 + 0.5,
        sin(hue * 6.28318 + 4.188) * 0.5 + 0.5
      );

      // Scanline effect
      float scanline = sin(vUv.y * 200.0 + time * 5.0) * 0.03;

      vec3 holoColor = mix(texColor.rgb, rainbow, fresnel * hologramIntensity);
      holoColor += scanline;
      holoColor += fresnel * 0.3 * rainbow;

      gl_FragColor = vec4(holoColor, texColor.a * opacity);
    }
  `,
};

/**
 * Glass refraction shader for elegant gallery frames
 */
export const glassShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform float opacity;
    uniform float refractionRatio;
    uniform vec3 glassColor;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec4 texColor = texture2D(map, vUv);

      // Simple glass tint
      vec3 tinted = mix(texColor.rgb, glassColor, 0.1);

      // Edge highlight
      float edgeFactor = 1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
      tinted += vec3(0.2) * pow(edgeFactor, 2.0);

      gl_FragColor = vec4(tinted, texColor.a * opacity);
    }
  `,
};

/**
 * Particle glow shader for floating gallery items
 */
export const particleGlowShader = {
  vertexShader: `
    attribute float size;
    attribute vec3 customColor;

    varying vec3 vColor;

    void main() {
      vColor = customColor;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform float opacity;

    varying vec3 vColor;

    void main() {
      vec4 texColor = texture2D(map, gl_PointCoord);

      // Soft glow falloff
      float dist = length(gl_PointCoord - vec2(0.5));
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);

      gl_FragColor = vec4(vColor * texColor.rgb, texColor.a * opacity * glow);
    }
  `,
};

/**
 * Ripple distortion shader for interactive hover effects
 */
export const rippleShader = {
  vertexShader: `
    uniform float time;
    uniform vec2 rippleCenter;
    uniform float rippleStrength;

    varying vec2 vUv;

    void main() {
      vUv = uv;

      vec3 pos = position;

      // Ripple displacement
      float dist = distance(uv, rippleCenter);
      float ripple = sin(dist * 20.0 - time * 5.0) * rippleStrength;
      ripple *= smoothstep(1.0, 0.0, dist);

      pos.z += ripple * 0.1;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform float opacity;
    uniform float time;
    uniform vec2 rippleCenter;
    uniform float rippleStrength;

    varying vec2 vUv;

    void main() {
      // UV distortion for water-like effect
      vec2 uv = vUv;
      float dist = distance(uv, rippleCenter);
      float ripple = sin(dist * 30.0 - time * 5.0) * rippleStrength * 0.01;
      ripple *= smoothstep(0.5, 0.0, dist);

      uv += normalize(uv - rippleCenter) * ripple;

      vec4 texColor = texture2D(map, uv);
      gl_FragColor = vec4(texColor.rgb, texColor.a * opacity);
    }
  `,
};

/**
 * Neon glow shader for cyberpunk aesthetic
 */
export const neonShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform float opacity;
    uniform float time;
    uniform vec3 neonColor;
    uniform float glowIntensity;

    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      vec4 texColor = texture2D(map, vUv);

      // Pulsing neon glow
      float pulse = sin(time * 2.0) * 0.5 + 0.5;

      // Edge detection for neon outline
      float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
      edge = pow(edge, 2.0);

      vec3 glow = neonColor * edge * glowIntensity * (0.7 + pulse * 0.3);

      vec3 finalColor = texColor.rgb + glow;

      gl_FragColor = vec4(finalColor, texColor.a * opacity);
    }
  `,
};

/**
 * Depth fade shader for infinite gallery effect
 */
export const depthFadeShader = {
  vertexShader: `
    varying vec2 vUv;
    varying float vDepth;

    void main() {
      vUv = uv;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vDepth = -mvPosition.z;

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform float opacity;
    uniform float nearFade;
    uniform float farFade;
    uniform vec3 fogColor;

    varying vec2 vUv;
    varying float vDepth;

    void main() {
      vec4 texColor = texture2D(map, vUv);

      // Depth-based fog
      float fogFactor = smoothstep(nearFade, farFade, vDepth);
      vec3 finalColor = mix(texColor.rgb, fogColor, fogFactor);

      // Near fade out
      float nearOpacity = smoothstep(0.0, nearFade * 0.5, vDepth);

      gl_FragColor = vec4(finalColor, texColor.a * opacity * nearOpacity * (1.0 - fogFactor * 0.5));
    }
  `,
};

/**
 * Chromatic aberration shader for artistic effect
 */
export const chromaticShader = {
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform float opacity;
    uniform float aberrationAmount;
    uniform vec2 aberrationDirection;

    varying vec2 vUv;

    void main() {
      vec2 offset = aberrationDirection * aberrationAmount * 0.01;

      float r = texture2D(map, vUv + offset).r;
      float g = texture2D(map, vUv).g;
      float b = texture2D(map, vUv - offset).b;
      float a = texture2D(map, vUv).a;

      gl_FragColor = vec4(r, g, b, a * opacity);
    }
  `,
};

/**
 * Dissolve shader for transitions
 */
export const dissolveShader = {
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform float progress;
    uniform float edgeWidth;
    uniform vec3 edgeColor;

    varying vec2 vUv;

    // Noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec4 texColor = texture2D(map, vUv);

      float noise = random(vUv * 10.0);
      float threshold = progress;

      // Edge glow
      float edge = smoothstep(threshold - edgeWidth, threshold, noise) -
                   smoothstep(threshold, threshold + edgeWidth, noise);

      vec3 finalColor = mix(texColor.rgb, edgeColor, edge);
      float alpha = step(noise, threshold) * texColor.a;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};
