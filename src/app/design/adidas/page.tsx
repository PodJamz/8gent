'use client';

import { useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  ShoppingBag, Heart, Share2, Star, ChevronRight, ChevronDown,
  Truck, RotateCcw, Shield, Check, Plus, Minus, Leaf
} from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { BrandColorSwatch } from '@/components/design/BrandColorSwatch';

// Adidas brand colors
const adidasColors = {
  black: '#000000',
  white: '#FFFFFF',
  blue: '#0066B2',
  gold: '#C4A000',
  red: '#E42313',
  green: '#00A651',
  grey: '#A0A0A0',
  cream: '#F7F7F7',
};

// ============================================================================
// 3D Adidas Shoe Component - Using GLTF Model
// ============================================================================
function AdidasSneaker({ color = '#000000' }: { color?: string }) {
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
    <div className="w-full h-[400px] rounded-2xl overflow-hidden" style={{ backgroundColor: adidasColors.cream }}>
      <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <AdidasSneaker color={selectedColor} />
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
// Adidas E-Commerce Product Page
// ============================================================================
function AdidasProductPage() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(adidasColors.black);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('description');

  const sizes = ['UK 6', 'UK 6.5', 'UK 7', 'UK 7.5', 'UK 8', 'UK 8.5', 'UK 9', 'UK 9.5', 'UK 10', 'UK 11'];
  const colorOptions = [
    { name: 'Core Black', value: adidasColors.black },
    { name: 'Cloud White', value: adidasColors.white },
    { name: 'Team Royal Blue', value: adidasColors.blue },
    { name: 'Better Scarlet', value: adidasColors.red },
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
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2 py-1 rounded"
                style={{ backgroundColor: adidasColors.blue, color: 'white' }}
              >
                ORIGINALS
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: adidasColors.green }}>
                <Leaf className="w-3 h-3" />
                Sustainable
              </span>
            </div>
            <h2
              className="text-2xl font-bold mt-2"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              Ultraboost Light
            </h2>
            <p className="text-sm mt-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Running Shoes
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
                className={`w-4 h-4 ${star <= 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            5.0 (1,523 Reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span
            className="text-3xl font-bold"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            $190
          </span>
          <span className="flex items-center gap-1 text-sm" style={{ color: adidasColors.blue }}>
            <span className="font-medium">adiClub members:</span> $152
          </span>
        </div>

        {/* Color Selection */}
        <div>
          <p className="text-sm font-medium mb-3" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Colour: {colorOptions.find(c => c.value === selectedColor)?.name}
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
                  borderColor: selectedColor === color.value ? adidasColors.black : 'hsl(var(--theme-border))',
                  outlineColor: adidasColors.black,
                }}
              />
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Select Size (UK)
            </p>
            <button className="text-sm underline" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Size Guide
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {sizes.map((size, i) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                disabled={i === 3 || i === 7}
                className={`py-3 rounded border text-sm font-medium transition-all ${
                  selectedSize === size ? 'border-2' : ''
                } ${i === 3 || i === 7 ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                style={{
                  borderColor: selectedSize === size ? adidasColors.black : 'hsl(var(--theme-border))',
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
            className="flex items-center border rounded"
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

        {/* Add to Bag Buttons */}
        <div className="flex flex-col gap-3">
          <button
            className="w-full flex items-center justify-center gap-2 py-4 font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: adidasColors.black }}
          >
            <ShoppingBag className="w-5 h-5" />
            ADD TO BAG
          </button>
          <button
            className="w-full flex items-center justify-center gap-2 py-4 font-bold border-2 transition-all hover:bg-black hover:text-white"
            style={{
              borderColor: adidasColors.black,
              color: adidasColors.black,
            }}
          >
            <Heart className="w-5 h-5" />
            ADD TO WISHLIST
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
              Free Returns
            </span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Leaf className="w-6 h-6" style={{ color: adidasColors.green }} />
            <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Made with Recycled Materials
            </span>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-0 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
          {[
            {
              id: 'description',
              title: 'Description',
              content: 'Experience energy return like never before. The Ultraboost Light features our lightest BOOST midsole ever, made with 30% less weight than regular BOOST. The Primeknit+ upper adapts to your foot while Continental Rubber outsole delivers superior grip.',
            },
            {
              id: 'details',
              title: 'Product Details',
              content: 'Primeknit+ textile upper • Light BOOST midsole • Continental Rubber outsole • Linear Energy Push system • Torsion System • Article: HQ6340',
            },
            {
              id: 'sustainability',
              title: 'Sustainability',
              content: 'This product features at least 50% recycled materials in the upper. By using recycled materials we reduce waste and our reliance on finite resources. Made in part with Parley Ocean Plastic.',
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
// Adidas Component Library
// ============================================================================
function AdidasComponentLibrary() {
  return (
    <div className="space-y-8">
      {/* Buttons */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Buttons
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-6 py-3 text-sm font-bold text-white uppercase tracking-wider"
            style={{ backgroundColor: adidasColors.black }}
          >
            Add to Bag
          </button>
          <button
            className="px-6 py-3 text-sm font-bold border-2 uppercase tracking-wider"
            style={{
              borderColor: adidasColors.black,
              color: adidasColors.black,
            }}
          >
            Wishlist
          </button>
          <button
            className="px-6 py-3 text-sm font-bold text-white uppercase tracking-wider"
            style={{ backgroundColor: adidasColors.blue }}
          >
            Join adiClub
          </button>
          <button
            className="px-6 py-3 text-sm font-bold underline uppercase tracking-wider"
            style={{ color: adidasColors.black }}
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Category Navigation
        </h4>
        <div className="flex flex-wrap gap-2">
          {['Running', 'Originals', 'Football', 'Training', 'Outdoor', 'Lifestyle'].map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                i === 0 ? 'text-white' : 'border'
              }`}
              style={{
                backgroundColor: i === 0 ? adidasColors.black : 'transparent',
                borderColor: i === 0 ? undefined : 'hsl(var(--theme-border))',
                color: i === 0 ? 'white' : 'hsl(var(--theme-foreground))',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Product Cards
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Ultraboost Light', price: '$190', category: 'RUNNING', sustainable: true },
            { name: 'Samba OG', price: '$100', category: 'ORIGINALS', sustainable: false },
            { name: 'Stan Smith', price: '$110', category: 'ORIGINALS', sustainable: true },
          ].map((product, i) => (
            <div
              key={i}
              className="group cursor-pointer"
            >
              <div
                className="aspect-square rounded mb-3 relative overflow-hidden"
                style={{ backgroundColor: adidasColors.cream }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Three stripes icon */}
                  <div className="flex gap-1">
                    {[0, 1, 2].map((stripe) => (
                      <div
                        key={stripe}
                        className="w-2 h-12 rounded-sm"
                        style={{ backgroundColor: adidasColors.black }}
                      />
                    ))}
                  </div>
                </div>
                <span
                  className="absolute top-3 left-3 text-[10px] font-bold"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {product.category}
                </span>
                {product.sustainable && (
                  <span className="absolute top-3 right-3">
                    <Leaf className="w-4 h-4" style={{ color: adidasColors.green }} />
                  </span>
                )}
                <button className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="w-5 h-5" style={{ color: adidasColors.black }} />
                </button>
              </div>
              <h5 className="font-bold text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                {product.name}
              </h5>
              <p className="text-sm mt-1" style={{ color: 'hsl(var(--theme-foreground))' }}>
                {product.price}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Three Stripes Branding */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Brand Elements
        </h4>
        <div
          className="p-8 rounded flex items-center justify-center"
          style={{ backgroundColor: adidasColors.black }}
        >
          <div className="flex items-end gap-2">
            <div className="w-4 h-16 bg-white" />
            <div className="w-4 h-12 bg-white" />
            <div className="w-4 h-8 bg-white" />
            <span className="text-white font-bold text-2xl ml-4 tracking-widest">adidas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================
export default function AdidasPage() {
  return (
    <ProductPageLayout
      theme="adidas"
      targetUser="creators, athletes, and culture shapers"
      problemStatement="Impossible is Nothing."
      problemContext="Adidas exists to inspire and enable people to harness the power of sport in their lives. From the running track to the street, from professional athletes to cultural icons, the three stripes represent performance, heritage, and creativity united."
      insight="Sport has the power to change lives. Through sport, we have the power to change lives. Our products merge performance innovation with cultural relevance, from Boost technology to sustainable materials. The three stripes are a symbol of authenticity."
      tradeoffs={['Heritage meets innovation', 'Performance meets style', 'Global meets local']}
      appName="Ultraboost Light"
      appDescription="Our lightest Boost ever, energy for every stride"
      showToolbar={true}
      themeLabel="Adidas"
      onReferenceToAI={(prompt) => { if (typeof window !== 'undefined') { sessionStorage.setItem('openclaw_theme_reference', prompt); sessionStorage.setItem('openclaw_theme_reference_timestamp', Date.now().toString()); } }}
      principles={[
        {
          title: 'Performance First',
          description: 'Every product starts with the athlete. From Boost to Primeknit, innovation serves performance before anything else.',
        },
        {
          title: 'Sustainability',
          description: 'End plastic waste. By 2025, 9 out of 10 products will be sustainable. Parley Ocean Plastic leads the way.',
        },
        {
          title: 'Three Stripes',
          description: 'The most recognized symbol in sport. Simple, bold, unmistakable. Heritage that earns its place every day.',
        },
        {
          title: 'Creator Culture',
          description: 'Sport is culture. From Run DMC to Beyoncé, adidas empowers creators to define what sport means to them.',
        },
      ]}
      quote={{
        text: 'Through sport, we have the power to change lives.',
        author: 'adidas',
      }}
    >
      {/* E-Commerce Product Page */}
      <AdidasProductPage />

      {/* Component Library */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Adidas Component Library
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Core UI elements following adidas&apos; bold, performance-driven design language.
        </p>
        <AdidasComponentLibrary />
      </div>

      {/* Brand Colors */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Brand Colors
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Adidas brand color palette. Click to copy hex values.
        </p>
        <BrandColorSwatch colors={adidasColors} columns={4} />
      </div>
    </ProductPageLayout>
  );
}
