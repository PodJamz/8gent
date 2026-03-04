'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  BarChart3,
  Tags,
  User,
  ChevronDown,
  X,
  Zap,
  AlertCircle,
} from 'lucide-react';
import type { SearchQuery, SearchIntent, SeniorityLevel } from '@/lib/humans/types';
import { INTENT_LABELS, SENIORITY_LABELS } from '@/lib/humans/types';

// ============================================================================
// Autocomplete Suggestions
// ============================================================================

const ROLE_SUGGESTIONS = [
  // Engineering
  'Software Engineer',
  'Senior Software Engineer',
  'Staff Engineer',
  'Principal Engineer',
  'Engineering Manager',
  'VP of Engineering',
  'CTO',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Site Reliability Engineer',
  'Data Engineer',
  'ML Engineer',
  'Machine Learning Engineer',
  'AI Engineer',
  'iOS Developer',
  'Android Developer',
  'Mobile Developer',
  // Product
  'Product Manager',
  'Senior Product Manager',
  'Director of Product',
  'VP of Product',
  'Chief Product Officer',
  'Product Designer',
  'UX Designer',
  'UI Designer',
  'UX Researcher',
  // Design
  'Head of Design',
  'Design Director',
  'Brand Designer',
  'Graphic Designer',
  'Creative Director',
  // Data
  'Data Scientist',
  'Data Analyst',
  'Business Analyst',
  'Analytics Engineer',
  // Sales & Marketing
  'Sales Representative',
  'Account Executive',
  'Sales Manager',
  'VP of Sales',
  'Chief Revenue Officer',
  'Marketing Manager',
  'Growth Manager',
  'Content Marketer',
  'CMO',
  // Operations
  'Operations Manager',
  'COO',
  'Chief of Staff',
  'HR Manager',
  'People Operations',
  'Recruiter',
  'Technical Recruiter',
  // Finance
  'CFO',
  'Finance Manager',
  'Financial Analyst',
  // Executive
  'CEO',
  'Founder',
  'Co-founder',
  'General Partner',
  'Venture Partner',
  'Angel Investor',
];

const LOCATION_SUGGESTIONS = [
  // US Cities
  'San Francisco, CA',
  'San Francisco Bay Area',
  'New York, NY',
  'New York City',
  'Los Angeles, CA',
  'Seattle, WA',
  'Austin, TX',
  'Boston, MA',
  'Chicago, IL',
  'Denver, CO',
  'Miami, FL',
  'Atlanta, GA',
  'Portland, OR',
  'San Diego, CA',
  'Washington, DC',
  'Philadelphia, PA',
  'Phoenix, AZ',
  'Dallas, TX',
  'Houston, TX',
  // International
  'London, UK',
  'Berlin, Germany',
  'Paris, France',
  'Amsterdam, Netherlands',
  'Dublin, Ireland',
  'Toronto, Canada',
  'Vancouver, Canada',
  'Singapore',
  'Tokyo, Japan',
  'Sydney, Australia',
  'Melbourne, Australia',
  'Tel Aviv, Israel',
  'Bangalore, India',
  'Mumbai, India',
  // Remote
  'Remote',
  'Remote (US)',
  'Remote (EU)',
  'Remote (Global)',
  'Hybrid',
  // Regions
  'United States',
  'Europe',
  'Asia Pacific',
  'North America',
  'EMEA',
  'APAC',
];

// ============================================================================
// Autocomplete Input Component
// ============================================================================

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder: string;
  inputStyle: React.CSSProperties;
  autoFocus?: boolean;
}

function AutocompleteInput({
  value,
  onChange,
  suggestions,
  placeholder,
  inputStyle,
  autoFocus,
}: AutocompleteInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const filteredSuggestions = useMemo(() => {
    if (!value.trim()) return suggestions.slice(0, 8);
    const lower = value.toLowerCase();
    return suggestions
      .filter(s => s.toLowerCase().includes(lower))
      .slice(0, 8);
  }, [value, suggestions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, filteredSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      onChange(filteredSuggestions[focusedIndex]);
      setShowSuggestions(false);
      setFocusedIndex(-1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={e => {
          onChange(e.target.value);
          setShowSuggestions(true);
          setFocusedIndex(-1);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border focus:outline-none transition-all text-sm placeholder:opacity-40"
        style={inputStyle}
        autoFocus={autoFocus}
        autoComplete="off"
      />

      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 py-1 rounded-xl backdrop-blur-xl shadow-xl overflow-hidden"
            style={{
              backgroundColor: 'hsl(var(--theme-card))',
              border: '1px solid hsl(var(--theme-border))',
            }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={() => {
                  onChange(suggestion);
                  setShowSuggestions(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  index === focusedIndex ? 'opacity-100' : 'opacity-70'
                }`}
                style={{
                  color: 'hsl(var(--theme-foreground))',
                  backgroundColor: index === focusedIndex
                    ? 'hsl(var(--theme-secondary) / 0.5)'
                    : 'transparent',
                }}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Search Form Component
// ============================================================================

interface SearchFormProps {
  intent: SearchIntent;
  onSearch: (query: SearchQuery) => void;
  onBack: () => void;
  isSearching: boolean;
  guardrailMessage?: string;
  guardrailAlternative?: string;
}

export function SearchForm({
  intent,
  onSearch,
  onBack,
  isSearching,
  guardrailMessage,
  guardrailAlternative,
}: SearchFormProps) {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [seniority, setSeniority] = useState<SeniorityLevel>('any');
  const [keywords, setKeywords] = useState('');
  const [personName, setPersonName] = useState('');
  const [showSeniorityDropdown, setShowSeniorityDropdown] = useState(false);

  const isSpecificPerson = intent === 'specific_person';

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const query: SearchQuery = {
        intent,
        role: isSpecificPerson ? '' : role,
        location: location || undefined,
        seniority: seniority !== 'any' ? seniority : undefined,
        keywords: keywords || undefined,
        personName: isSpecificPerson ? personName : undefined,
      };

      onSearch(query);
    },
    [intent, role, location, seniority, keywords, personName, isSpecificPerson, onSearch]
  );

  const canSubmit = isSpecificPerson ? personName.trim() : role.trim();

  // Theme-aware input styles
  const inputStyle = {
    backgroundColor: 'hsl(var(--theme-secondary) / 0.5)',
    borderColor: 'hsl(var(--theme-border))',
    color: 'hsl(var(--theme-foreground))',
  };

  const labelStyle = {
    color: 'hsl(var(--theme-muted-foreground))',
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm flex items-center gap-1 transition-colors opacity-50 hover:opacity-70"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          <ChevronDown className="w-4 h-4 rotate-90" />
          Back
        </button>
        <span
          className="text-sm font-medium"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          {INTENT_LABELS[intent]}
        </span>
      </div>

      {/* Guardrail Warning */}
      <AnimatePresence>
        {guardrailMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-rose-300 text-sm font-medium">{guardrailMessage}</p>
                {guardrailAlternative && (
                  <p className="text-rose-300/60 text-xs mt-1">{guardrailAlternative}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Field */}
      {isSpecificPerson ? (
        <div className="space-y-2">
          <label className="text-xs font-medium flex items-center gap-2" style={labelStyle}>
            <User className="w-3.5 h-3.5" />
            Person Name
          </label>
          <input
            type="text"
            value={personName}
            onChange={e => setPersonName(e.target.value)}
            placeholder="e.g., John Smith, Jane Doe"
            className="w-full px-4 py-3 rounded-xl border focus:outline-none transition-all text-sm placeholder:opacity-40"
            style={inputStyle}
            autoFocus
          />
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-xs font-medium flex items-center gap-2" style={labelStyle}>
            <Search className="w-3.5 h-3.5" />
            Role or Expertise *
          </label>
          <AutocompleteInput
            value={role}
            onChange={setRole}
            suggestions={ROLE_SUGGESTIONS}
            placeholder="e.g., Product Designer, ML Engineer, Sales Director"
            inputStyle={inputStyle}
            autoFocus
          />
        </div>
      )}

      {/* Location */}
      <div className="space-y-2">
        <label className="text-xs font-medium flex items-center gap-2" style={labelStyle}>
          <MapPin className="w-3.5 h-3.5" />
          Location
          <span className="opacity-50">(optional)</span>
        </label>
        <AutocompleteInput
          value={location}
          onChange={setLocation}
          suggestions={LOCATION_SUGGESTIONS}
          placeholder="e.g., San Francisco, Remote, Europe"
          inputStyle={inputStyle}
        />
      </div>

      {/* Seniority Dropdown (not for specific person) */}
      {!isSpecificPerson && (
        <div className="space-y-2 relative">
          <label className="text-xs font-medium flex items-center gap-2" style={labelStyle}>
            <BarChart3 className="w-3.5 h-3.5" />
            Seniority
            <span className="opacity-50">(optional)</span>
          </label>
          <button
            type="button"
            onClick={() => setShowSeniorityDropdown(!showSeniorityDropdown)}
            className="w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between transition-all text-sm"
            style={inputStyle}
          >
            <span className={seniority === 'any' ? 'opacity-40' : ''}>
              {SENIORITY_LABELS[seniority]}
            </span>
            <ChevronDown
              className={`w-4 h-4 opacity-50 transition-transform ${
                showSeniorityDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {showSeniorityDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-1 py-2 rounded-xl backdrop-blur-xl shadow-xl"
                style={{
                  backgroundColor: 'hsl(var(--theme-card))',
                  border: '1px solid hsl(var(--theme-border))',
                }}
              >
                {(Object.keys(SENIORITY_LABELS) as SeniorityLevel[]).map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      setSeniority(level);
                      setShowSeniorityDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      seniority === level ? 'opacity-100' : 'opacity-60'
                    }`}
                    style={{
                      color: 'hsl(var(--theme-foreground))',
                      backgroundColor: seniority === level ? 'hsl(var(--theme-secondary) / 0.5)' : 'transparent',
                    }}
                  >
                    {SENIORITY_LABELS[level]}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Keywords */}
      <div className="space-y-2">
        <label className="text-xs font-medium flex items-center gap-2" style={labelStyle}>
          <Tags className="w-3.5 h-3.5" />
          Keywords
          <span className="opacity-50">(optional)</span>
        </label>
        <input
          type="text"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          placeholder="e.g., React, startup, YC, fintech"
          className="w-full px-4 py-3 rounded-xl border focus:outline-none transition-all text-sm placeholder:opacity-40"
          style={inputStyle}
        />
      </div>

      {/* Search Button */}
      <motion.button
        type="submit"
        disabled={!canSubmit || isSearching}
        whileHover={{ scale: canSubmit && !isSearching ? 1.01 : 1 }}
        whileTap={{ scale: canSubmit && !isSearching ? 0.99 : 1 }}
        className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all"
        style={{
          backgroundColor: canSubmit && !isSearching
            ? 'hsl(var(--theme-primary))'
            : 'hsl(var(--theme-secondary))',
          color: canSubmit && !isSearching
            ? 'hsl(var(--theme-primary-foreground))'
            : 'hsl(var(--theme-muted-foreground))',
          cursor: canSubmit && !isSearching ? 'pointer' : 'not-allowed',
          opacity: canSubmit && !isSearching ? 1 : 0.5,
        }}
      >
        {isSearching ? (
          <>
            <motion.div
              className="w-4 h-4 border-2 rounded-full"
              style={{
                borderColor: 'hsl(var(--theme-primary-foreground) / 0.3)',
                borderTopColor: 'hsl(var(--theme-primary-foreground))',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            Searching...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            Search
          </>
        )}
      </motion.button>

      {/* Responsible Use Note */}
      <p
        className="text-center text-[11px] pt-2 opacity-40"
        style={{ color: 'hsl(var(--theme-muted-foreground))' }}
      >
        For professional networking only. No private data.
      </p>
    </motion.form>
  );
}
