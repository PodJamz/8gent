/**
 * Tests for ChatComponents.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  WeatherWidget,
  KanbanTicketCard,
  KanbanTicketList,
  PhotoGallery,
  ProjectCard,
  WorkExperienceCard,
  ThemePreviewCard,
  ChatComponentRenderer,
} from '../ChatComponents';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('ChatComponents', () => {
  describe('WeatherWidget', () => {
    it('should render location and temperature', () => {
      render(
        <WeatherWidget
          data={{
            location: 'San Francisco',
            temperature: 72,
            condition: 'sunny',
          }}
        />
      );

      expect(screen.getByText('San Francisco')).toBeInTheDocument();
      expect(screen.getByText('72')).toBeInTheDocument();
      expect(screen.getByText('°F')).toBeInTheDocument();
    });

    it('should render sunny condition icon', () => {
      const { container } = render(
        <WeatherWidget
          data={{
            location: 'Test',
            temperature: 70,
            condition: 'sunny',
          }}
        />
      );

      // Check that svg icon is rendered (Sun icon)
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render cloudy condition icon', () => {
      const { container } = render(
        <WeatherWidget
          data={{
            location: 'Test',
            temperature: 60,
            condition: 'cloudy',
          }}
        />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render rainy condition icon', () => {
      const { container } = render(
        <WeatherWidget
          data={{
            location: 'Test',
            temperature: 55,
            condition: 'rainy',
          }}
        />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render windy condition icon', () => {
      const { container } = render(
        <WeatherWidget
          data={{
            location: 'Test',
            temperature: 65,
            condition: 'windy',
          }}
        />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render humidity when provided', () => {
      render(
        <WeatherWidget
          data={{
            location: 'Test',
            temperature: 70,
            condition: 'sunny',
            humidity: 65,
          }}
        />
      );

      expect(screen.getByText('65% humidity')).toBeInTheDocument();
    });

    it('should render wind speed when provided', () => {
      render(
        <WeatherWidget
          data={{
            location: 'Test',
            temperature: 70,
            condition: 'sunny',
            windSpeed: 12,
          }}
        />
      );

      expect(screen.getByText('12 mph')).toBeInTheDocument();
    });

    it('should render both humidity and wind speed', () => {
      render(
        <WeatherWidget
          data={{
            location: 'Test',
            temperature: 70,
            condition: 'sunny',
            humidity: 50,
            windSpeed: 10,
          }}
        />
      );

      expect(screen.getByText('50% humidity')).toBeInTheDocument();
      expect(screen.getByText('10 mph')).toBeInTheDocument();
    });

    it('should not render extra info section when no humidity or wind', () => {
      const { container } = render(
        <WeatherWidget
          data={{
            location: 'Test',
            temperature: 70,
            condition: 'sunny',
          }}
        />
      );

      expect(screen.queryByText('humidity')).not.toBeInTheDocument();
      expect(screen.queryByText('mph')).not.toBeInTheDocument();
    });
  });

  describe('KanbanTicketCard', () => {
    const baseTicket = {
      id: 'ticket-1',
      title: 'Test Ticket',
      status: 'todo' as const,
      priority: 'medium' as const,
    };

    it('should render ticket title', () => {
      render(<KanbanTicketCard ticket={baseTicket} />);
      expect(screen.getByText('Test Ticket')).toBeInTheDocument();
    });

    it('should render ticket description when provided', () => {
      render(
        <KanbanTicketCard
          ticket={{ ...baseTicket, description: 'This is a description' }}
        />
      );
      expect(screen.getByText('This is a description')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      render(<KanbanTicketCard ticket={baseTicket} />);
      // Only title and priority should be present
      expect(screen.getByText('Test Ticket')).toBeInTheDocument();
      expect(screen.getByText('medium')).toBeInTheDocument();
    });

    it('should render priority badge', () => {
      render(<KanbanTicketCard ticket={{ ...baseTicket, priority: 'high' }} />);
      expect(screen.getByText('high')).toBeInTheDocument();
    });

    it('should render tags when provided', () => {
      render(
        <KanbanTicketCard
          ticket={{ ...baseTicket, tags: ['frontend', 'bug'] }}
        />
      );
      expect(screen.getByText('frontend')).toBeInTheDocument();
      expect(screen.getByText('bug')).toBeInTheDocument();
    });

    it('should limit tags to 2', () => {
      render(
        <KanbanTicketCard
          ticket={{ ...baseTicket, tags: ['tag1', 'tag2', 'tag3', 'tag4'] }}
        />
      );
      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
      expect(screen.queryByText('tag3')).not.toBeInTheDocument();
    });

    it('should render todo status icon', () => {
      const { container } = render(
        <KanbanTicketCard ticket={{ ...baseTicket, status: 'todo' }} />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render in-progress status icon', () => {
      const { container } = render(
        <KanbanTicketCard ticket={{ ...baseTicket, status: 'in-progress' }} />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render done status icon', () => {
      const { container } = render(
        <KanbanTicketCard ticket={{ ...baseTicket, status: 'done' }} />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render backlog status icon', () => {
      const { container } = render(
        <KanbanTicketCard ticket={{ ...baseTicket, status: 'backlog' }} />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should apply low priority styling', () => {
      render(<KanbanTicketCard ticket={{ ...baseTicket, priority: 'low' }} />);
      expect(screen.getByText('low')).toBeInTheDocument();
    });

    it('should apply urgent priority styling', () => {
      render(<KanbanTicketCard ticket={{ ...baseTicket, priority: 'urgent' }} />);
      expect(screen.getByText('urgent')).toBeInTheDocument();
    });
  });

  describe('KanbanTicketList', () => {
    const tickets = [
      { id: '1', title: 'Ticket 1', status: 'todo' as const, priority: 'high' as const },
      { id: '2', title: 'Ticket 2', status: 'done' as const, priority: 'low' as const },
    ];

    it('should render task count', () => {
      render(<KanbanTicketList tickets={tickets} />);
      expect(screen.getByText('2 tasks')).toBeInTheDocument();
    });

    it('should render all tickets', () => {
      render(<KanbanTicketList tickets={tickets} />);
      expect(screen.getByText('Ticket 1')).toBeInTheDocument();
      expect(screen.getByText('Ticket 2')).toBeInTheDocument();
    });

    it('should render link to projects page', () => {
      render(<KanbanTicketList tickets={tickets} />);
      expect(screen.getByText('View all in Projects')).toBeInTheDocument();
    });

    it('should render empty list', () => {
      render(<KanbanTicketList tickets={[]} />);
      expect(screen.getByText('0 tasks')).toBeInTheDocument();
    });
  });

  describe('PhotoGallery', () => {
    const photos = [
      { id: '1', src: '/photo1.jpg', alt: 'Photo 1' },
      { id: '2', src: '/photo2.jpg', alt: 'Photo 2' },
      { id: '3', src: '/photo3.jpg', alt: 'Photo 3' },
    ];

    it('should render photo count', () => {
      render(<PhotoGallery photos={photos} />);
      expect(screen.getByText('3 photos')).toBeInTheDocument();
    });

    it('should render photos', () => {
      render(<PhotoGallery photos={photos} />);
      expect(screen.getByAltText('Photo 1')).toBeInTheDocument();
      expect(screen.getByAltText('Photo 2')).toBeInTheDocument();
    });

    it('should limit to 6 photos in grid', () => {
      const manyPhotos = Array.from({ length: 10 }, (_, i) => ({
        id: String(i),
        src: `/photo${i}.jpg`,
        alt: `Photo ${i}`,
      }));
      render(<PhotoGallery photos={manyPhotos} />);

      // Should show "more" link
      expect(screen.getByText(/\+4 more in Photos/)).toBeInTheDocument();
    });

    it('should not show more link when 6 or fewer photos', () => {
      render(<PhotoGallery photos={photos} />);
      expect(screen.queryByText(/more in Photos/)).not.toBeInTheDocument();
    });

    it('should render link to photos page when more than 6', () => {
      const manyPhotos = Array.from({ length: 8 }, (_, i) => ({
        id: String(i),
        src: `/photo${i}.jpg`,
        alt: `Photo ${i}`,
      }));
      render(<PhotoGallery photos={manyPhotos} />);
      expect(screen.getByText(/\+2 more in Photos/)).toBeInTheDocument();
    });
  });

  describe('ProjectCard', () => {
    const project = {
      title: '8gent',
      description: 'An AI assistant for the portfolio',
      technologies: ['React', 'TypeScript', 'Next.js'],
    };

    it('should render project title', () => {
      render(<ProjectCard project={project} />);
      expect(screen.getByText('8gent')).toBeInTheDocument();
    });

    it('should render project description', () => {
      render(<ProjectCard project={project} />);
      expect(screen.getByText('An AI assistant for the portfolio')).toBeInTheDocument();
    });

    it('should render technologies', () => {
      render(<ProjectCard project={project} />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Next.js')).toBeInTheDocument();
    });

    it('should limit technologies to 4', () => {
      render(
        <ProjectCard
          project={{
            ...project,
            technologies: ['React', 'TS', 'Next.js', 'Node', 'Tailwind', 'Prisma'],
          }}
        />
      );
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node')).toBeInTheDocument();
      expect(screen.queryByText('Tailwind')).not.toBeInTheDocument();
    });

    it('should render external link when href provided', () => {
      const { container } = render(
        <ProjectCard project={{ ...project, href: '/projects/claw-ai' }} />
      );
      const link = container.querySelector('a[href="/projects/claw-ai"]');
      expect(link).toBeInTheDocument();
    });

    it('should not render external link when no href', () => {
      const { container } = render(<ProjectCard project={project} />);
      // Only the wrapper should exist, no anchor for external link
      const links = container.querySelectorAll('a');
      expect(links.length).toBe(0);
    });
  });

  describe('WorkExperienceCard', () => {
    const work = {
      company: 'Acme Corp',
      title: 'Senior Engineer',
      start: '2020',
      end: '2023',
    };

    it('should render job title', () => {
      render(<WorkExperienceCard work={work} />);
      expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
    });

    it('should render company name', () => {
      render(<WorkExperienceCard work={work} />);
      expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    });

    it('should render date range', () => {
      render(<WorkExperienceCard work={work} />);
      expect(screen.getByText(/2020 - 2023/)).toBeInTheDocument();
    });

    it('should render "Present" when no end date', () => {
      render(<WorkExperienceCard work={{ ...work, end: undefined }} />);
      expect(screen.getByText(/2020 - Present/)).toBeInTheDocument();
    });

    it('should render location when provided', () => {
      render(<WorkExperienceCard work={{ ...work, location: 'San Francisco, CA' }} />);
      expect(screen.getByText(/San Francisco, CA/)).toBeInTheDocument();
    });

    it('should render description when provided', () => {
      render(
        <WorkExperienceCard
          work={{ ...work, description: 'Led a team of engineers' }}
        />
      );
      expect(screen.getByText('Led a team of engineers')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      render(<WorkExperienceCard work={work} />);
      // Should only have title, company, and date
      expect(screen.queryByText('Led a team')).not.toBeInTheDocument();
    });
  });

  describe('ThemePreviewCard', () => {
    const theme = {
      name: 'claude',
      label: 'Claude',
    };

    it('should render theme label', () => {
      render(<ThemePreviewCard theme={theme} />);
      expect(screen.getByText('Claude')).toBeInTheDocument();
    });

    it('should render link to theme page', () => {
      const { container } = render(<ThemePreviewCard theme={theme} />);
      const link = container.querySelector('a[href="/design/claude"]');
      expect(link).toBeInTheDocument();
    });

    it('should render preview instruction', () => {
      render(<ThemePreviewCard theme={theme} />);
      expect(screen.getByText('Tap to preview theme')).toBeInTheDocument();
    });
  });

  describe('ChatComponentRenderer', () => {
    it('should render WeatherWidget for weather type', () => {
      render(
        <ChatComponentRenderer
          component={{
            type: 'weather',
            data: { location: 'NYC', temperature: 65, condition: 'cloudy' },
          }}
        />
      );
      expect(screen.getByText('NYC')).toBeInTheDocument();
      expect(screen.getByText('65')).toBeInTheDocument();
    });

    it('should render KanbanTicketList for kanban type', () => {
      render(
        <ChatComponentRenderer
          component={{
            type: 'kanban',
            data: [{ id: '1', title: 'Task', status: 'todo', priority: 'high' }],
          }}
        />
      );
      expect(screen.getByText('Task')).toBeInTheDocument();
      expect(screen.getByText('1 tasks')).toBeInTheDocument();
    });

    it('should render PhotoGallery for photos type', () => {
      render(
        <ChatComponentRenderer
          component={{
            type: 'photos',
            data: [{ id: '1', src: '/test.jpg', alt: 'Test photo' }],
          }}
        />
      );
      expect(screen.getByText('1 photos')).toBeInTheDocument();
    });

    it('should render ProjectCard for project type', () => {
      render(
        <ChatComponentRenderer
          component={{
            type: 'project',
            data: { title: 'My Project', description: 'Desc', technologies: ['React'] },
          }}
        />
      );
      expect(screen.getByText('My Project')).toBeInTheDocument();
    });

    it('should render WorkExperienceCard for work type', () => {
      render(
        <ChatComponentRenderer
          component={{
            type: 'work',
            data: { company: 'Tech Co', title: 'Dev', start: '2022' },
          }}
        />
      );
      expect(screen.getByText('Tech Co')).toBeInTheDocument();
    });

    it('should render ThemePreviewCard for theme type', () => {
      render(
        <ChatComponentRenderer
          component={{
            type: 'theme',
            data: { name: 'dark', label: 'Dark Mode' },
          }}
        />
      );
      expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    });

    it('should render multiple ProjectCards for projects type', () => {
      render(
        <ChatComponentRenderer
          component={{
            type: 'projects',
            data: [
              { title: 'Project 1', description: 'Desc 1', technologies: [] },
              { title: 'Project 2', description: 'Desc 2', technologies: [] },
            ],
          }}
        />
      );
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 2')).toBeInTheDocument();
    });

    it('should render multiple ThemePreviewCards for themes type', () => {
      render(
        <ChatComponentRenderer
          component={{
            type: 'themes',
            data: [
              { name: 'light', label: 'Light' },
              { name: 'dark', label: 'Dark' },
            ],
          }}
        />
      );
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
    });

    it('should limit themes to 4', () => {
      render(
        <ChatComponentRenderer
          component={{
            type: 'themes',
            data: [
              { name: 't1', label: 'Theme 1' },
              { name: 't2', label: 'Theme 2' },
              { name: 't3', label: 'Theme 3' },
              { name: 't4', label: 'Theme 4' },
              { name: 't5', label: 'Theme 5' },
            ],
          }}
        />
      );
      expect(screen.getByText('Theme 1')).toBeInTheDocument();
      expect(screen.getByText('Theme 4')).toBeInTheDocument();
      expect(screen.queryByText('Theme 5')).not.toBeInTheDocument();
    });

    it('should return null for unknown type', () => {
      const { container } = render(
        <ChatComponentRenderer
          component={{ type: 'unknown' as any, data: {} }}
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });
});
