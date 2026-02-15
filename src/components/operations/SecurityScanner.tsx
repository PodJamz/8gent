'use client';

/**
 * Security Scanner Component
 *
 * AI security scanning interface for testing prompt injection
 * and jailbreak vulnerabilities.
 *
 * Inspired by ZeroLeaks (https://github.com/ZeroLeaks/zeroleaks)
 * An autonomous security testing tool by the ZeroLeaks team.
 *
 * Attack vectors adapted from ZeroLeaks methodology:
 * - Direct extraction
 * - Encoding bypasses (Base64, ROT13)
 * - Persona-based jailbreaks (DAN, Developer Mode)
 * - Social engineering
 * - Format injection
 * - Crescendo (multi-turn trust escalation)
 * - Many-Shot (context priming)
 * - Chain-of-Thought manipulation
 *
 * Our implementation extends ZeroLeaks with:
 * - Real-time Convex persistence
 * - Integration with provider health monitoring
 * - Theme-aware glass-morphism UI
 * - Operations Center dashboard integration
 *
 * @see https://zeroleaks.ai for hosted security scanning
 * @see docs/reference/attributions.md for full credits
 *
 * NOTE: Run `npx convex dev` to generate API types after schema changes.
 */

import { useState } from 'react';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';

import { api } from '@/lib/convex-shim';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Play,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Target,
  Scan,
  Lock,
  Unlock,
  Eye,
  FileWarning,
  Bug,
  Zap,
} from 'lucide-react';

const ATTACK_VECTORS = [
  { id: 'direct', name: 'Direct Extraction', icon: Target },
  { id: 'encoded', name: 'Encoding Bypass', icon: Lock },
  { id: 'persona', name: 'Persona Jailbreak', icon: Eye },
  { id: 'social', name: 'Social Engineering', icon: Bug },
  { id: 'format', name: 'Format Injection', icon: FileWarning },
  { id: 'crescendo', name: 'Crescendo Attack', icon: Zap },
] as const;

const SCAN_TYPES = [
  {
    id: 'prompt_injection',
    name: 'Prompt Injection',
    description: 'Test for prompt injection vulnerabilities',
    icon: Bug,
  },
  {
    id: 'jailbreak_attempt',
    name: 'Jailbreak Detection',
    description: 'Test jailbreak resistance',
    icon: Unlock,
  },
  {
    id: 'data_extraction',
    name: 'Data Extraction',
    description: 'Test for sensitive data leakage',
    icon: Eye,
  },
  {
    id: 'system_prompt_leak',
    name: 'System Prompt Leak',
    description: 'Test system prompt protection',
    icon: Lock,
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Scan',
    description: 'Full security assessment',
    icon: Shield,
  },
] as const;

const SEVERITY_CONFIG = {
  secure: {
    color: 'emerald',
    icon: CheckCircle,
    label: 'Secure',
  },
  low: {
    color: 'blue',
    icon: AlertTriangle,
    label: 'Low Risk',
  },
  medium: {
    color: 'yellow',
    icon: AlertTriangle,
    label: 'Medium Risk',
  },
  high: {
    color: 'orange',
    icon: AlertTriangle,
    label: 'High Risk',
  },
  critical: {
    color: 'red',
    icon: XCircle,
    label: 'Critical',
  },
};

interface SecurityScan {
  _id: string;
  scanId: string;
  scanType: string;
  status: 'running' | 'completed' | 'failed';
  vulnerabilityScore?: number;
  severity?: 'secure' | 'low' | 'medium' | 'high' | 'critical';
  leakStatus?: string;
  findings?: string;
  startedAt: number;
  completedAt?: number;
  durationMs?: number;
}

function ScanCard({ scan }: { scan: SecurityScan }) {
  const severity = scan.severity ?? 'secure';
  const config = SEVERITY_CONFIG[severity];
  const Icon = config.icon;

  const colorClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const colors = colorClasses[config.color as keyof typeof colorClasses];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 ${colors}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-white capitalize">
            {scan.scanType.replace(/_/g, ' ')}
          </h4>
          <p className="text-xs text-white/40">
            {new Date(scan.startedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {scan.status === 'running' ? (
            <Loader2 className="w-5 h-5 text-white/60 animate-spin" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>
      </div>

      {scan.status === 'completed' && (
        <>
          {/* Vulnerability Score */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-white/40">Vulnerability Score</span>
              <span className="font-medium text-white">
                {scan.vulnerabilityScore ?? 0}/100
              </span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scan.vulnerabilityScore ?? 0}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full ${(scan.vulnerabilityScore ?? 0) > 70
                    ? 'bg-red-500'
                    : (scan.vulnerabilityScore ?? 0) > 40
                      ? 'bg-yellow-500'
                      : 'bg-emerald-500'
                  }`}
              />
            </div>
          </div>

          {/* Severity Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors}`}
            >
              {config.label}
            </span>
            {scan.leakStatus && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/60">
                Leak: {scan.leakStatus}
              </span>
            )}
          </div>

          {/* Duration */}
          {scan.durationMs && (
            <p className="text-xs text-white/30">
              Completed in {(scan.durationMs / 1000).toFixed(2)}s
            </p>
          )}
        </>
      )}

      {scan.status === 'failed' && (
        <p className="text-xs text-red-400">Scan failed</p>
      )}
    </motion.div>
  );
}

export function SecurityScanner() {
  const [selectedType, setSelectedType] = useState<string>('comprehensive');
  const [selectedVectors, setSelectedVectors] = useState<string[]>([
    'direct',
    'encoded',
    'persona',
  ]);
  const [isScanning, setIsScanning] = useState(false);

  const scans = useQuery(api.observability.getSecurityScans, { limit: 10 });
  const createScan = useMutation(api.observability.createSecurityScan);

  const handleStartScan = async () => {
    setIsScanning(true);
    try {
      await createScan({
        scanType: selectedType as any,
        attackVectors: selectedVectors,
        triggeredBy: 'manual',
      });
      // Note: Actual scan execution would be done by a background job
      // For now, we just create the scan record
    } catch (error) {
      console.error('Failed to start scan:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const toggleVector = (vectorId: string) => {
    setSelectedVectors((prev) =>
      prev.includes(vectorId)
        ? prev.filter((v) => v !== vectorId)
        : [...prev, vectorId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Scan className="w-5 h-5 text-red-400" />
          Security Scanner
        </h2>
        <span className="text-xs text-white/40">ZeroLeaks-inspired</span>
      </div>

      {/* Scan Configuration */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6">
        {/* Scan Type Selection */}
        <div>
          <h3 className="text-sm font-medium text-white mb-3">Scan Type</h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            {SCAN_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;

              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`
                    p-3 rounded-xl border transition-all text-left
                    ${isSelected
                      ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mb-2" />
                  <div className="text-xs font-medium">{type.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Attack Vectors */}
        <div>
          <h3 className="text-sm font-medium text-white mb-3">Attack Vectors</h3>
          <div className="flex flex-wrap gap-2">
            {ATTACK_VECTORS.map((vector) => {
              const Icon = vector.icon;
              const isSelected = selectedVectors.includes(vector.id);

              return (
                <button
                  key={vector.id}
                  onClick={() => toggleVector(vector.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                    ${isSelected
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs">{vector.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Scan Button */}
        <button
          onClick={handleStartScan}
          disabled={isScanning || selectedVectors.length === 0}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
            font-medium transition-all
            ${isScanning || selectedVectors.length === 0
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30'
            }
          `}
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Starting Scan...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start Security Scan
            </>
          )}
        </button>
      </div>

      {/* Recent Scans */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Recent Scans</h3>
        {scans === undefined ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-white/5 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : scans.length === 0 ? (
          <div className="text-center py-8 text-white/40">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No security scans yet</p>
            <p className="text-xs mt-1">Start a scan to test your AI&apos;s defenses</p>
          </div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence>
              {(scans as SecurityScan[]).map((scan) => (
                <ScanCard key={scan._id} scan={scan} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
