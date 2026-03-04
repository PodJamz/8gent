import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '8gent Jr - Your Voice, Your Way';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 50%, #fce7f3 100%)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Logo/Emoji */}
        <div
          style={{
            fontSize: 120,
            marginBottom: 20,
          }}
        >
          <span role="img" aria-label="speech">
            &#128483;&#65039;
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}
        >
          8gent Jr
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            color: '#4b5563',
            marginBottom: 40,
          }}
        >
          Your Voice, Your Way
        </div>

        {/* Feature badges */}
        <div
          style={{
            display: 'flex',
            gap: 24,
          }}
        >
          {['AAC Communication', 'AI-Powered', 'Personalized Voice'].map((feature) => (
            <div
              key={feature}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 9999,
                fontSize: 20,
                color: '#2563eb',
                fontWeight: 500,
                border: '1px solid rgba(37, 99, 235, 0.2)',
              }}
            >
              {feature}
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            color: '#6b7280',
          }}
        >
          Every child deserves a voice
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
