import { useState } from 'react';
import ReactPlayer from 'react-player';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  onComplete: (responses: Record<string, string>) => void;
  onBack: () => void;
};

export default function MicroBriefingComprehension({ onComplete, onBack }: Props) {
  const [videoUrl, setVideoUrl] = useState<string>('https://www.w3schools.com/html/mov_bbb.mp4');
  const [answers, setAnswers] = useState<Record<string, string>>({ q1: '', q2: '', q3: '' });
  const [submitting, setSubmitting] = useState(false);
  const [grading, setGrading] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = Object.values(answers).every((v) => v.trim().length >= 3);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/grade-open-ended', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: videoUrl, answers }),
      });
      if (!res.ok) throw new Error(`Grading failed: ${res.status}`);
      const data = await res.json();
      setGrading(data.grading);
      // also notify parent of completion (store raw answers)
      onComplete(answers);
    } catch (e: any) {
      setError(e?.message || 'Grading failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" onClick={onBack} className="mb-4">← Back</Button>
        <Card>
          <CardHeader>
            <CardTitle>🎬 Micro-briefing Comprehension</CardTitle>
            <CardDescription>
              Watch a short clip, then answer open-ended questions. Your responses are graded for clarity, detail, and relevance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="text-sm font-medium block mb-2">Video URL</label>
              <input
                className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="aspect-video mb-6 bg-black/10 dark:bg-white/10 rounded overflow-hidden">
              <ReactPlayer url={videoUrl} width="100%" height="100%" controls />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Q1. Summarize the main point in 1-3 sentences.</label>
                <Textarea
                  value={answers.q1}
                  onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
                  rows={3}
                  placeholder="Your answer..."
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Q2. List 2-3 key details you noticed.</label>
                <Textarea
                  value={answers.q2}
                  onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
                  rows={3}
                  placeholder="Your answer..."
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Q3. How would you apply this in a work setting?</label>
                <Textarea
                  value={answers.q3}
                  onChange={(e) => setAnswers({ ...answers, q3: e.target.value })}
                  rows={3}
                  placeholder="Your answer..."
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
                {submitting ? 'Grading...' : 'Submit & Grade'}
              </Button>
              <Button variant="outline" onClick={() => onComplete(answers)} disabled={submitting}>
                Skip grading
              </Button>
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-600">{error}</div>
            )}

            {grading && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Grading Results</h3>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">
                  {JSON.stringify(grading, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
