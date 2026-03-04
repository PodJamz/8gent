'use client';

import { useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  ShoppingBag, Heart, Share2, Star, ChevronRight, ChevronDown,
  Truck, RotateCcw, Shield, Check, Plus, Minus
} from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { BrandColorSwatch } from '@/components/design/BrandColorSwatch';

// Nike brand colors
const nikeColors = {
  black: '#111111',
  white: '#FFFFFF',
  orange: '#FA5400',
  volt: '#CEFF00',
  gym_red: '#C41E3A',
  royal_blue: '#0D47A1',
  cream: '#F5F0EB',
};

// ============================================================================
// 3D Nike Shoe Component - Using GLTF Model
// ============================================================================
function NikeSneaker({ color = '#111111' }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/shoe.glb');

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  // Clone the scene to avoid mutation issues
  const clonedScene = scene.clone();

  // Apply color to materials
  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const material = child.material as THREE.MeshStandardMaterial;
      if (material.color) {
        // Tint the material with the selected color
        material.color.set(color);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
      <group ref={groupRef} scale={8} position={[0, -0.5, 0]} rotation={[0.2, 0, 0]}>
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
}

// Preload the model
useGLTF.preload('/models/shoe.glb');

function SneakerCanvas({ selectedColor }: { selectedColor: string }) {
  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden" style={{ backgroundColor: nikeColors.cream }}>
      <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <NikeSneaker color={selectedColor} />
          <Environment preset="studio" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ============================================================================
// Nike E-Commerce Product Page
// ============================================================================
function NikeProductPage() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(nikeColors.black);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('description');

  const sizes = ['US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12'];
  const colorOptions = [
    { name: 'Black', value: nikeColors.black },
    { name: 'White', value: nikeColors.white },
    { name: 'Gym Red', value: nikeColors.gym_red },
    { name: 'Royal Blue', value: nikeColors.royal_blue },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        borderColor: 'hsl(var(--theme-border))',
      }}
    >
      {/* Product Image / 3D View */}
      <SneakerCanvas selectedColor={selectedColor} />

      {/* Product Info */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: nikeColors.orange }}>
              Just In
            </p>
            <h2
              className="text-2xl font-bold mt-1"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              Nike Air Max 90
            </h2>
            <p className="text-sm mt-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Men&apos;s Shoes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="p-2 rounded-full border transition-colors"
              style={{ borderColor: 'hsl(var(--theme-border))' }}
            >
              <Heart
                className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : ''}`}
                style={{ color: liked ? undefined : 'hsl(var(--theme-muted-foreground))' }}
              />
            </button>
            <button
              className="p-2 rounded-full border"
              style={{ borderColor: 'hsl(var(--theme-border))' }}
            >
              <Share2 className="w-5 h-5" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            4.0 (2,847 Reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span
            className="text-3xl font-bold"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            $150
          </span>
          <span
            className="text-lg line-through"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            $180
          </span>
          <span className="text-sm font-medium px-2 py-1 rounded" style={{ backgroundColor: nikeColors.orange, color: 'white' }}>
            17% OFF
          </span>
        </div>

        {/* Color Selection */}
        <div>
          <p className="text-sm font-medium mb-3" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Color: {colorOptions.find(c => c.value === selectedColor)?.name}
          </p>
          <div className="flex gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color.value ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{
                  backgroundColor: color.value,
                  borderColor: selectedColor === color.value ? nikeColors.orange : 'hsl(var(--theme-border))',
                  outlineColor: nikeColors.orange,
                }}
              />
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Select Size
            </p>
            <button className="text-sm underline" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Size Guide
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-3 rounded-lg border text-sm font-medium transition-all ${
                  selectedSize === size ? 'border-2' : ''
                }`}
                style={{
                  borderColor: selectedSize === size ? nikeColors.black : 'hsl(var(--theme-border))',
                  backgroundColor: selectedSize === size ? 'hsl(var(--theme-secondary))' : 'transparent',
                  color: 'hsl(var(--theme-foreground))',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Quantity
          </p>
          <div
            className="flex items-center border rounded-lg"
            style={{ borderColor: 'hsl(var(--theme-border))' }}
          >
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span
              className="px-4 py-2 font-medium"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add to Bag Button */}
        <div className="flex gap-3">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: nikeColors.black }}
          >
            <ShoppingBag className="w-5 h-5" />
            Add to Bag
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
          <div className="flex flex-col items-center text-center gap-2">
            <Truck className="w-6 h-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
            <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Free Delivery
            </span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <RotateCcw className="w-6 h-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
            <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              60-Day Returns
            </span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Shield className="w-6 h-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
            <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              2-Year Warranty
            </span>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-0 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
          {[
            {
              id: 'description',
              title: 'Description',
              content: 'Nothing as iconically Air as the Nike Air Max 90. Featuring the original wavy design that\'s easy to style, this iteration celebrates 30+ years of sneaker culture with leather and textile uppers, visible Air cushioning in the heel, and a rubber Waffle outsole.',
            },
            {
              id: 'details',
              title: 'Product Details',
              content: 'Leather and textile upper • Foam midsole • Max Air unit in heel • Rubber Waffle outsole • Style: CN8490-002',
            },
            {
              id: 'shipping',
              title: 'Shipping & Returns',
              content: 'Free standard shipping on orders over $50. Free 60-day returns on all orders. See our full return policy for details.',
            },
          ].map((section) => (
            <div key={section.id} className="border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              <button
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                className="w-full flex items-center justify-between py-4"
              >
                <span className="font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                  {section.title}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                />
              </button>
              <AnimatePresence>
                {expandedSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p
                      className="pb-4 text-sm leading-relaxed"
                      style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                    >
                      {section.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Nike Component Library
// ============================================================================
function NikeComponentLibrary() {
  return (
    <div className="space-y-8">
      {/* Buttons */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Buttons
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-6 py-3 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: nikeColors.black }}
          >
            Add to Bag
          </button>
          <button
            className="px-6 py-3 rounded-full text-sm font-medium border-2"
            style={{
              borderColor: nikeColors.black,
              color: nikeColors.black,
            }}
          >
            Favorite
          </button>
          <button
            className="px-6 py-3 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: nikeColors.orange }}
          >
            Shop Now
          </button>
          <button
            className="px-6 py-3 text-sm font-medium underline"
            style={{ color: nikeColors.black }}
          >
            View Details
          </button>
        </div>
      </div>

      {/* Product Cards */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Product Cards
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Air Max 90', price: '$150', tag: 'Just In' },
            { name: 'Air Force 1', price: '$130', tag: 'Best Seller' },
            { name: 'Dunk Low', price: '$120', tag: null },
          ].map((product, i) => (
            <div
              key={i}
              className="group cursor-pointer"
            >
              <div
                className="aspect-square rounded-lg mb-3 relative overflow-hidden"
                style={{ backgroundColor: nikeColors.cream }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-20 h-8 rounded-full"
                    style={{ backgroundColor: nikeColors.black }}
                  />
                </div>
                {product.tag && (
                  <span
                    className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded"
                    style={{
                      backgroundColor: product.tag === 'Just In' ? nikeColors.orange : nikeColors.black,
                      color: 'white',
                    }}
                  >
                    {product.tag}
                  </span>
                )}
                <button className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="w-5 h-5" style={{ color: nikeColors.black }} />
                </button>
              </div>
              <h5 className="font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                Nike {product.name}
              </h5>
              <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                Men&apos;s Shoes
              </p>
              <p className="font-medium mt-1" style={{ color: 'hsl(var(--theme-foreground))' }}>
                {product.price}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Size Selector
        </h4>
        <div className="flex flex-wrap gap-2">
          {['US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10'].map((size, i) => (
            <button
              key={size}
              className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                i === 2 ? 'border-2' : ''
              }`}
              style={{
                borderColor: i === 2 ? nikeColors.black : 'hsl(var(--theme-border))',
                backgroundColor: i === 2 ? 'hsl(var(--theme-secondary))' : 'transparent',
                color: 'hsl(var(--theme-foreground))',
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================
export default function NikePage() {
  return (
    <ProductPageLayout
      theme="nike"
      targetUser="athletes and those who move with purpose"
      problemStatement="If you have a body, you are an athlete."
      problemContext="Nike believes in the power of sport to move the world forward. Every product, every experience is designed to bring inspiration and innovation to every athlete. The asterisk is intentional: *If you have a body, you are an athlete."
      insight="Performance meets style in everything we create. From the waffle sole to Air cushioning, Nike innovations start with the athlete and work backward to the product. Bold simplicity. Unmistakable identity. Just do it."
      tradeoffs={['Performance over trends', 'Innovation over tradition', 'Bold over safe']}
      appName="Nike Air Max 90"
      appDescription="Iconic cushioning, timeless design"
      showToolbar={true}
      themeLabel="Nike"
      onReferenceToAI={(prompt) => { if (typeof window !== 'undefined') { sessionStorage.setItem('openclaw_theme_reference', prompt); sessionStorage.setItem('openclaw_theme_reference_timestamp', Date.now().toString()); } }}
      principles={[
        {
          title: 'Just Do It',
          description: 'Action over hesitation. Every design decision moves the athlete forward, removing barriers between intention and achievement.',
        },
        {
          title: 'Innovation',
          description: 'From Air to Flyknit to self-lacing, Nike pushes boundaries. Technology serves the athlete, never the other way around.',
        },
        {
          title: 'Authenticity',
          description: 'The Swoosh is recognized worldwide. Bold, simple, confident. Design that needs no explanation.',
        },
        {
          title: 'Inclusivity',
          description: 'Sport belongs to everyone. Products designed for all bodies, all abilities, all dreams.',
        },
      ]}
      quote={{
        text: 'There is no finish line.',
        author: 'Nike',
      }}
    >
      {/* E-Commerce Product Page */}
      <NikeProductPage />

      {/* Component Library */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Nike Component Library
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Core UI elements following Nike&apos;s bold, athletic design language.
        </p>
        <NikeComponentLibrary />
      </div>

      {/* Brand Colors */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Brand Colors
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Nike&apos;s signature color palette. Click to copy hex values.
        </p>
        <BrandColorSwatch colors={nikeColors} columns={4} />
      </div>
    </ProductPageLayout>
  );
}
