import { useMemo, useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LIKERT_MIN = 1;
const LIKERT_MAX = 7;

type Props = {
  onComplete: (responses: Record<string, any>) => void;
  onBack: () => void;
};

export default function SensoryProfileTolerance({ onComplete, onBack }: Props) {
  const [scores, setScores] = useState({
    light: 4,
    noise: 4,
    interruptions: 4,
    texture: 4,
    context_switching: 4,
  });
  const [checks, setChecks] = useState({
    headphones_ok: true,
    prefers_dim_light: false,
    needs_breaks_when_overwhelmed: false,
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(() => Object.values(scores).reduce((a, b) => a + b, 0), [scores]);
  const normalized = useMemo(() => {
    const maxTotal = (LIKERT_MAX) * 5;
    return Math.round((total / maxTotal) * 100);
  }, [total]);

  const localSummary = useMemo(() => {
    const high = (k: keyof typeof scores) => scores[k] >= 6;
    const lines: string[] = [];
    if (high('noise')) lines.push('High sensitivity to noise; benefits from quiet zones or headphones.');
    if (high('interruptions')) lines.push('Frequent interruptions reduce effectiveness; prefers protected focus time.');
    if (high('light')) lines.push('Light sensitivity; dimmer or indirect lighting is helpful.');
    if (high('context_switching')) lines.push('Context switching is taxing; batching tasks improves outcomes.');
    if (high('texture')) lines.push('Tactile textures may be distracting; prefers smooth/consistent materials.');
    if (lines.length === 0) lines.push('Balanced sensory tolerance across common workplace factors.');
    if (checks.needs_breaks_when_overwhelmed) lines.push('Short restorative breaks assist regulation when overloaded.');
    return lines.slice(0, 4).join(' ');
  }, [scores, checks]);

  const submit = () => {
    const responses = { ...scores, ...checks, normalized_score_pct: normalized };
    onComplete(responses);
  };

  const askAI = async () => {
    setAiLoading(true);
    setError(null);
    setAiSummary(null);
    try {
      const res = await fetch('/api/ai/demo-analyze/sensory_profile_tolerance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses: { ...scores, ...checks, normalized_score_pct: normalized },
          user_context: { demo_mode: true }
        })
      });
      if (!res.ok) throw new Error(`AI failed: ${res.status}`);
      const data = await res.json();
      const summary = data?.analysis?.summary as string | undefined;
      setAiSummary(summary || 'AI summary unavailable.');
    } catch (e: any) {
      setError(e?.message || 'AI request failed');
    } finally {
      setAiLoading(false);
    }
  };

  const renderSlider = (key: keyof typeof scores, label: string) => (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs opacity-70">{scores[key]}</span>
      </div>
      <Slider.Root
        className="relative flex h-5 select-none items-center"
        min={LIKERT_MIN}
        max={LIKERT_MAX}
        step={1}
        value={[scores[key]]}
        onValueChange={([v]) => setScores((s) => ({ ...s, [key]: v }))}
      >
        <Slider.Track className="bg-gray-200 dark:bg-gray-800 relative grow rounded-full h-1.5">
          <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
        </Slider.Track>
        <Slider.Thumb className="block size-4 rounded-full bg-white dark:bg-gray-200 shadow border" aria-label={label} />
      </Slider.Root>
      <div className="flex justify-between text-xs opacity-60 mt-1">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" onClick={onBack} className="mb-4">← Back</Button>
        <Card>
          <CardHeader>
            <CardTitle>🎚 Sensory Profile & Tolerance</CardTitle>
            <CardDescription>
              Likert sliders (1–7) and checkboxes for sensory factors. Local deterministic scoring, optional AI summary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderSlider('light', 'Light Sensitivity')}
            {renderSlider('noise', 'Noise Sensitivity')}
            {renderSlider('interruptions', 'Sensitivity to Interruptions')}
            {renderSlider('texture', 'Texture/Tactile Sensitivity')}
            {renderSlider('context_switching', 'Tolerance for Context Switching')}

            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={checks.headphones_ok} onChange={(e) => setChecks(c => ({...c, headphones_ok: e.target.checked}))} />
                Headphones acceptable during work
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={checks.prefers_dim_light} onChange={(e) => setChecks(c => ({...c, prefers_dim_light: e.target.checked}))} />
                Prefers dim or indirect lighting
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={checks.needs_breaks_when_overwhelmed} onChange={(e) => setChecks(c => ({...c, needs_breaks_when_overwhelmed: e.target.checked}))} />
                Needs short breaks when overwhelmed
              </label>
            </div>

            <div className="mt-6 text-sm">
              <div className="font-medium">Local Summary</div>
              <div className="opacity-80">{localSummary}</div>
              <div className="mt-1 opacity-60">Overall tolerance score: {normalized}%</div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button onClick={submit}>Save</Button>
              <Button variant="outline" onClick={askAI} disabled={aiLoading}>
                {aiLoading ? 'Summarizing…' : 'AI Summarize (optional)'}
              </Button>
            </div>

            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
            {aiSummary && (
              <div className="mt-4 text-sm">
                <div className="font-medium">AI Summary</div>
                <div className="opacity-80 whitespace-pre-wrap">{aiSummary}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
