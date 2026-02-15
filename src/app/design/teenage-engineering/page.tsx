'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Watch, Keyboard } from '@/components/teenage-engineering';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { BrandColorSwatch } from '@/components/design/BrandColorSwatch';

// Teenage Engineering brand colors
const teColors = {
  lightGrey: '#E5E5E5',
  mediumGrey: '#C8C8C8',
  darkGrey: '#2C2C2C',
  orange: '#FF5722',
  white: '#FFFFFF',
  black: '#000000',
};

/**
 * Teenage Engineering Design Theme Page
 * Minimalist precision meets playful engineering
 * Showcases the design philosophy behind OP-1, OP-Z, and Pocket Operators
 */

export default function TeenageEngineeringPage() {
  const [activeComponent, setActiveComponent] = useState<'calculator' | 'watch' | 'keyboard'>('calculator');

  return (
    <ProductPageLayout title="Teenage Engineering" subtitle="Minimalist Precision">
      <div className="space-y-20">
        {/* Hero Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2
              className="text-5xl md:text-6xl font-mono font-bold mb-6"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              FUNCTION = BEAUTY
            </h2>
            <p
              className="text-lg font-mono leading-relaxed"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Teenage Engineering proves that the best design disappears into pure experience. Every button,
              every grid line, every pixel serves a purpose. No decoration. No compromise. Just tools that
              feel like extensions of thought.
            </p>
          </motion.div>
        </section>

        {/* Color Palette */}
        <section>
          <h3
            className="text-2xl font-mono font-bold mb-6 text-center"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            COLOR SYSTEM
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <BrandColorSwatch
              color={teColors.lightGrey}
              name="Light Grey"
              value="#E5E5E5"
            />
            <BrandColorSwatch
              color={teColors.mediumGrey}
              name="Medium Grey"
              value="#C8C8C8"
            />
            <BrandColorSwatch
              color={teColors.darkGrey}
              name="Dark Grey"
              value="#2C2C2C"
            />
            <BrandColorSwatch
              color={teColors.orange}
              name="TE Orange"
              value="#FF5722"
            />
            <BrandColorSwatch
              color={teColors.white}
              name="White"
              value="#FFFFFF"
            />
          </div>

          <div
            className="mt-8 max-w-2xl mx-auto text-center text-sm font-mono p-4 rounded border"
            style={{
              backgroundColor: 'hsl(var(--theme-card))',
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-muted-foreground))',
            }}
          >
            Neutral greys provide the canvas. Orange accent demands attention only where it matters. White and black
            create stark, readable contrast. No gradients. No subtle transitions. Just precision.
          </div>
        </section>

        {/* Interactive Components */}
        <section>
          <h3
            className="text-2xl font-mono font-bold mb-6 text-center"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            INTERACTIVE INTERFACES
          </h3>

          {/* Component Selector */}
          <div className="flex justify-center gap-4 mb-8">
            {['calculator', 'watch', 'keyboard'].map((comp) => (
              <button
                key={comp}
                onClick={() => setActiveComponent(comp as typeof activeComponent)}
                className="px-6 py-3 font-mono font-bold text-sm rounded border-2 transition-all"
                style={{
                  backgroundColor:
                    activeComponent === comp
                      ? 'hsl(var(--theme-primary))'
                      : 'hsl(var(--theme-card))',
                  borderColor: 'hsl(var(--theme-border))',
                  color:
                    activeComponent === comp
                      ? 'hsl(var(--theme-primary-foreground))'
                      : 'hsl(var(--theme-foreground))',
                }}
              >
                {comp.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Component Display */}
          <motion.div
            key={activeComponent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center"
          >
            {activeComponent === 'calculator' && <Calculator />}
            {activeComponent === 'watch' && <Watch />}
            {activeComponent === 'keyboard' && <Keyboard />}
          </motion.div>

          <div
            className="mt-8 max-w-2xl mx-auto text-center text-sm font-mono p-4 rounded border"
            style={{
              backgroundColor: 'hsl(var(--theme-card))',
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-muted-foreground))',
            }}
          >
            {activeComponent === 'calculator' && (
              <>
                <strong>OP-1 Calculator Mode</strong> - Working calculator with speaker grille, mode selectors,
                and waveform display. Function embedded in playful form.
              </>
            )}
            {activeComponent === 'watch' && (
              <>
                <strong>Digital Time Display</strong> - Minimal watch widget showing time and date. Grid-based
                layout with animated seconds indicator. Pure information.
              </>
            )}
            {activeComponent === 'keyboard' && (
              <>
                <strong>OP-1 Keyboard Synth</strong> - Playable piano keys with Web Audio synthesis. Click keys
                or use your computer keyboard. Sound as interface feedback.
              </>
            )}
          </div>
        </section>

        {/* Typography Showcase */}
        <section>
          <h3
            className="text-2xl font-mono font-bold mb-6 text-center"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            TYPOGRAPHY SYSTEM
          </h3>

          <div className="space-y-6 max-w-3xl mx-auto">
            <div
              className="p-6 rounded border-2"
              style={{
                backgroundColor: 'hsl(var(--theme-card))',
                borderColor: 'hsl(var(--theme-border))',
              }}
            >
              <div className="text-xs font-mono tracking-widest opacity-60 mb-2">
                MONOSPACE TYPEFACE
              </div>
              <div className="text-5xl font-mono font-bold" style={{ color: 'hsl(var(--theme-foreground))' }}>
                SF MONO
              </div>
              <div className="mt-4 text-2xl font-mono font-bold" style={{ color: 'hsl(var(--theme-foreground))' }}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
              </div>
              <div className="mt-2 text-2xl font-mono font-bold" style={{ color: 'hsl(var(--theme-foreground))' }}>
                0123456789
              </div>
            </div>

            <div
              className="text-sm font-mono p-4 rounded border"
              style={{
                backgroundColor: 'hsl(var(--theme-card))',
                borderColor: 'hsl(var(--theme-border))',
                color: 'hsl(var(--theme-muted-foreground))',
              }}
            >
              Monospace typography isn&apos;t a stylistic choice - it&apos;s a functional one. Every character occupies
              the same width. Numbers align perfectly in grids. Text becomes data. Readability becomes absolute.
            </div>
          </div>
        </section>

        {/* Design Principles */}
        <section>
          <h3
            className="text-2xl font-mono font-bold mb-8 text-center"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            DESIGN PRINCIPLES
          </h3>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <DesignPrinciple
              number="01"
              title="TACTILE INTERFACES"
              description="Every interaction is physical. Buttons have weight. Knobs have resistance. Digital tools that feel analog. The screen is just a window to tangible experience."
            />
            <DesignPrinciple
              number="02"
              title="GRID-BASED LAYOUT"
              description="Everything aligns to a precise grid. No arbitrary placement. No 'feels right' positioning. Mathematical precision creates visual harmony without trying."
            />
            <DesignPrinciple
              number="03"
              title="PLAYFUL ENGINEERING"
              description="Synthesizers with calculators. Music boxes with games. Serious tools that don't take themselves seriously. Function can be fun without sacrificing utility."
            />
            <DesignPrinciple
              number="04"
              title="NO DECORATION"
              description="Zero skeuomorphism. Zero gradients. Zero unnecessary ornament. If it's not functional, it doesn't exist. Beauty emerges from constraint, not addition."
            />
            <DesignPrinciple
              number="05"
              title="HONEST MATERIALS"
              description="Metal looks like metal. Plastic looks like plastic. No fake leather. No fake wood. Materials speak their own language without pretense."
            />
            <DesignPrinciple
              number="06"
              title="HIDDEN DEPTH"
              description="Simple surface. Complex possibilities underneath. Master the basics in minutes. Discover new techniques for years. Depth through layers, not clutter."
            />
          </div>
        </section>

        {/* Philosophy */}
        <section>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h3
              className="text-3xl font-mono font-bold mb-6 text-center"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              WHY IT WORKS
            </h3>

            <div className="space-y-6">
              <div
                className="p-6 rounded border-2"
                style={{
                  backgroundColor: 'hsl(var(--theme-card))',
                  borderColor: 'hsl(var(--theme-border))',
                }}
              >
                <p
                  className="text-lg font-mono leading-relaxed"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  Teenage Engineering understands something most companies don&apos;t: <strong>constraints breed creativity</strong>.
                  Limited colors. Limited shapes. Limited materials. Within these boundaries, they create tools
                  that feel limitless.
                </p>
              </div>

              <div
                className="p-6 rounded border-2"
                style={{
                  backgroundColor: 'hsl(var(--theme-card))',
                  borderColor: 'hsl(var(--theme-border))',
                }}
              >
                <p
                  className="text-lg font-mono leading-relaxed"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  The OP-1 portable synthesizer has a calculator mode. Not because it needed one. But because <strong>tools
                  should be playgrounds</strong>. Easter eggs aren&apos;t features - they&apos;re philosophy. They say: explore. Discover.
                  Own this.
                </p>
              </div>

              <div
                className="p-6 rounded border-2"
                style={{
                  backgroundColor: 'hsl(var(--theme-card))',
                  borderColor: 'hsl(var(--theme-border))',
                }}
              >
                <p
                  className="text-lg font-mono leading-relaxed"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  Their Pocket Operators cost $59. Exposed circuit boards. Paper manuals. Minimal packaging. Not because
                  they&apos;re cheap. Because <strong>honesty is more valuable than polish</strong>. Show the user what they&apos;re
                  buying. No smoke. No mirrors. Just circuits and sound.
                </p>
              </div>

              <div
                className="p-6 rounded border-2"
                style={{
                  backgroundColor: 'hsl(var(--theme-card))',
                  borderColor: 'hsl(var(--theme-border))',
                }}
              >
                <p
                  className="text-lg font-mono leading-relaxed"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  Most products hide complexity behind simplicity. TE does the opposite: <strong>they reveal simplicity within
                  complexity</strong>. 16 pads. 4 encoders. Infinite music. The interface isn&apos;t dumbed down. The user is trusted
                  to learn. And they do.
                </p>
              </div>

              <div
                className="p-8 rounded border-2 text-center"
                style={{
                  backgroundColor: 'hsl(var(--theme-primary))',
                  borderColor: 'hsl(var(--theme-border))',
                }}
              >
                <p
                  className="text-2xl font-mono font-bold leading-relaxed"
                  style={{ color: 'hsl(var(--theme-primary-foreground))' }}
                >
                  &quot;Good design is obvious. Great design is transparent.&quot;
                </p>
                <p
                  className="text-sm font-mono mt-4 opacity-80"
                  style={{ color: 'hsl(var(--theme-primary-foreground))' }}
                >
                  — Joe Sparano (paraphrased)
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Final Thought */}
        <section>
          <div
            className="max-w-2xl mx-auto p-8 rounded border-2 text-center"
            style={{
              backgroundColor: 'hsl(var(--theme-card))',
              borderColor: 'hsl(var(--theme-border))',
            }}
          >
            <div className="text-xs font-mono tracking-widest opacity-60 mb-4">
              TEENAGE ENGINEERING PROVES
            </div>
            <p
              className="text-3xl font-mono font-bold leading-tight"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              The best tools disappear.
              <br />
              You stop using them.
              <br />
              You start creating with them.
            </p>
          </div>
        </section>
      </div>
    </ProductPageLayout>
  );
}

// Helper Component: Design Principle Card
function DesignPrinciple({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="p-6 rounded border-2"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        borderColor: 'hsl(var(--theme-border))',
      }}
    >
      <div
        className="text-4xl font-mono font-bold mb-2"
        style={{ color: 'hsl(var(--theme-primary))' }}
      >
        {number}
      </div>
      <h4
        className="text-lg font-mono font-bold mb-3"
        style={{ color: 'hsl(var(--theme-foreground))' }}
      >
        {title}
      </h4>
      <p
        className="text-sm font-mono leading-relaxed"
        style={{ color: 'hsl(var(--theme-muted-foreground))' }}
      >
        {description}
      </p>
    </motion.div>
  );
}
