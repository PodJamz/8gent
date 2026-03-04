'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Mail, Globe, MapPin } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { ContactInfo } from './VCardGenerator';
import { ContactField } from './ContactField';
import { SocialLinks } from './SocialLinks';

interface ContactCardProps {
  contact: ContactInfo;
}

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Profile Header */}
      <LiquidGlass
        variant="card"
        intensity="medium"
        className="!p-8 !rounded-3xl mb-4"
      >
        <div className="flex flex-col items-center text-center">
          {/* Profile Photo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="relative mb-4"
          >
            {/* Glow ring */}
            <div
              className="absolute -inset-2 rounded-full opacity-40 blur-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
              }}
            />

            {/* Photo container */}
            <div
              className="relative w-28 h-28 rounded-full overflow-hidden"
              style={{
                boxShadow: '0 0 0 4px hsl(var(--theme-primary) / 0.3)',
              }}
            >
              <Image
                src={contact.photo}
                alt={`${contact.name.first} ${contact.name.last}`}
                fill
                className="object-cover"
                priority
                sizes="112px"
              />
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold mb-1"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            {contact.name.first} {contact.name.last}
          </motion.h1>

          {/* Title */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-base font-medium mb-2"
            style={{ color: 'hsl(var(--theme-primary))' }}
          >
            {contact.title}
          </motion.p>

          {/* Location */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-1.5 opacity-70"
          >
            <MapPin className="w-3.5 h-3.5" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
            <span
              className="text-sm"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {contact.location}
            </span>
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-4 text-sm italic opacity-60"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            &ldquo;{contact.bio}&rdquo;
          </motion.p>
        </div>
      </LiquidGlass>

      {/* Contact Details */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <LiquidGlass
          variant="card"
          intensity="subtle"
          className="!p-2 !rounded-2xl mb-4"
        >
          <div className="space-y-1">
            <ContactField
              icon={<Mail className="w-4 h-4" />}
              label="Email"
              value={contact.email[0]}
              href={`mailto:${contact.email[0]}`}
              copyable
            />

            <ContactField
              icon={<Globe className="w-4 h-4" />}
              label="Website"
              value={contact.website.replace(/^https?:\/\//, '')}
              href={contact.website}
              external
              copyable
            />
          </div>
        </LiquidGlass>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mb-4"
      >
        <h2
          className="text-xs uppercase tracking-wider mb-3 px-2 opacity-60"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          Connect
        </h2>
        <SocialLinks links={contact.social} />
      </motion.div>
    </div>
  );
}
