'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Circle,
  AlertCircle,
  Image as ImageIcon,
  Code,
  Briefcase,
  Palette,
} from 'lucide-react';

/**
 * Chat Component Registry
 *
 * AI James can render any of these components inline in chat.
 * Each component is self-contained and renders its own data.
 */

// ============================================================================
// WEATHER WIDGET
// ============================================================================
interface WeatherData {
  location: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy';
  humidity?: number;
  windSpeed?: number;
}

export function WeatherWidget({ data }: { data: WeatherData }) {
  const conditionIcons = {
    sunny: <Sun className="w-8 h-8 text-amber-400" />,
    cloudy: <Cloud className="w-8 h-8 text-gray-400" />,
    rainy: <CloudRain className="w-8 h-8 text-blue-400" />,
    windy: <Wind className="w-8 h-8 text-cyan-400" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-white/10"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">{data.location}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-light">{data.temperature}</span>
            <span className="text-white/60">°F</span>
          </div>
        </div>
        {conditionIcons[data.condition]}
      </div>
      {(data.humidity || data.windSpeed) && (
        <div className="flex gap-4 mt-3 pt-3 border-t border-white/10 text-sm text-white/60">
          {data.humidity && (
            <div className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5" />
              <span>{data.humidity}% humidity</span>
            </div>
          )}
          {data.windSpeed && (
            <div className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5" />
              <span>{data.windSpeed} mph</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// KANBAN TICKET
// ============================================================================
interface KanbanTicket {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done' | 'backlog';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
}

const statusIcons = {
  todo: <Circle className="w-4 h-4 text-gray-400" />,
  'in-progress': <AlertCircle className="w-4 h-4 text-amber-400" />,
  done: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  backlog: <Circle className="w-4 h-4 text-gray-500" />,
};

const priorityColors = {
  low: 'bg-gray-500/20 text-gray-400',
  medium: 'bg-blue-500/20 text-blue-400',
  high: 'bg-amber-500/20 text-amber-400',
  urgent: 'bg-red-500/20 text-red-400',
};

export function KanbanTicketCard({ ticket }: { ticket: KanbanTicket }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-white/20 transition-colors"
    >
      <div className="flex items-start gap-3">
        {statusIcons[ticket.status]}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{ticket.title}</h4>
          {ticket.description && (
            <p className="text-xs text-white/50 mt-1 line-clamp-2">{ticket.description}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${priorityColors[ticket.priority]}`}>
              {ticket.priority}
            </span>
            {ticket.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white/60">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function KanbanTicketList({ tickets }: { tickets: KanbanTicket[] }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
        <Calendar className="w-3.5 h-3.5" />
        <span>{tickets.length} tasks</span>
      </div>
      {tickets.map((ticket) => (
        <KanbanTicketCard key={ticket.id} ticket={ticket} />
      ))}
      <Link
        href="/projects"
        className="flex items-center justify-center gap-1 text-xs text-amber-400 hover:text-amber-300 mt-2"
      >
        View all in Projects <ExternalLink className="w-3 h-3" />
      </Link>
    </div>
  );
}

// ============================================================================
// PHOTO GALLERY
// ============================================================================
interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export function PhotoGallery({ photos }: { photos: PhotoItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
        <ImageIcon className="w-3.5 h-3.5" />
        <span>{photos.length} photos</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {photos.slice(0, 6).map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-lg overflow-hidden bg-white/5"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
      {photos.length > 6 && (
        <Link
          href="/photos"
          className="flex items-center justify-center gap-1 text-xs text-amber-400 hover:text-amber-300"
        >
          +{photos.length - 6} more in Photos <ExternalLink className="w-3 h-3" />
        </Link>
      )}
    </motion.div>
  );
}

// ============================================================================
// PROJECT CARD
// ============================================================================
interface ProjectData {
  title: string;
  description: string;
  technologies: string[];
  href?: string;
  imageUrl?: string;
}

export function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl p-4 border border-white/10"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/20">
          <Code className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{project.title}</h4>
            {project.href && (
              <Link href={project.href} className="text-white/40 hover:text-white">
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
          <p className="text-xs text-white/60 mt-1 line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white/70">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// WORK EXPERIENCE CARD
// ============================================================================
interface WorkExperience {
  company: string;
  title: string;
  location?: string;
  start: string;
  end?: string;
  description?: string;
}

export function WorkExperienceCard({ work }: { work: WorkExperience }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-white/10"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/20">
          <Briefcase className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{work.title}</h4>
          <p className="text-xs text-white/60">{work.company}</p>
          <p className="text-[10px] text-white/40 mt-1">
            {work.start} - {work.end || 'Present'} {work.location && `• ${work.location}`}
          </p>
          {work.description && (
            <p className="text-xs text-white/50 mt-2 line-clamp-2">{work.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// THEME PREVIEW CARD
// ============================================================================
interface ThemePreview {
  name: string;
  label: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

export function ThemePreviewCard({ theme }: { theme: ThemePreview }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl overflow-hidden border border-white/10"
    >
      <Link href={`/design/${theme.name}`}>
        <div className="h-16 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30" />
        <div className="p-3 bg-white/5">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-medium">{theme.label}</span>
          </div>
          <p className="text-xs text-white/50 mt-1">Tap to preview theme</p>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================================================
// COMPONENT RENDERER
// ============================================================================
export type ChatComponentType =
  | { type: 'weather'; data: WeatherData }
  | { type: 'kanban'; data: KanbanTicket[] }
  | { type: 'photos'; data: PhotoItem[] }
  | { type: 'project'; data: ProjectData }
  | { type: 'work'; data: WorkExperience }
  | { type: 'theme'; data: ThemePreview }
  | { type: 'projects'; data: ProjectData[] }
  | { type: 'themes'; data: ThemePreview[] };

export function ChatComponentRenderer({ component }: { component: ChatComponentType }) {
  switch (component.type) {
    case 'weather':
      return <WeatherWidget data={component.data} />;
    case 'kanban':
      return <KanbanTicketList tickets={component.data} />;
    case 'photos':
      return <PhotoGallery photos={component.data} />;
    case 'project':
      return <ProjectCard project={component.data} />;
    case 'work':
      return <WorkExperienceCard work={component.data} />;
    case 'theme':
      return <ThemePreviewCard theme={component.data} />;
    case 'projects':
      return (
        <div className="space-y-2">
          {component.data.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      );
    case 'themes':
      return (
        <div className="grid grid-cols-2 gap-2">
          {component.data.slice(0, 4).map((theme) => (
            <ThemePreviewCard key={theme.name} theme={theme} />
          ))}
        </div>
      );
    default:
      return null;
  }
}
