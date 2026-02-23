/**
 * 8gent Skills Library
 *
 * This module exports references to all available skills for 8gent.
 * Skills are stored as markdown files in this directory and can be
 * dynamically loaded when needed.
 *
 * Skills Location: src/lib/claw-ai/skills/
 *
 * Available Skills:
 * - ui.md: Opinionated UI constraints for building better interfaces
 * - clone-react.md: Visual React component extraction from websites
 * - scientific-skills.md: K-Dense collection of 139 scientific research skills
 */

export const SKILLS_PATH = 'src/lib/claw-ai/skills';

export const AVAILABLE_SKILLS = [
  {
    id: 'ui',
    name: 'UI Skills',
    file: 'ui.md',
    description: 'Opinionated constraints for building better interfaces with Tailwind, accessible primitives, and performance best practices',
  },
  {
    id: 'clone-react',
    name: 'CloneReact',
    file: 'clone-react.md',
    description: 'Extract React components visually from any website using Electron-powered selection',
  },
  {
    id: 'scientific-skills',
    name: 'K-Dense Scientific Skills',
    file: 'scientific-skills.md',
    description: '139 ready-to-use scientific skills covering bioinformatics, cheminformatics, clinical research, and more',
  },
] as const;

export type SkillId = typeof AVAILABLE_SKILLS[number]['id'];
