import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  onComplete: (responses: Record<string, string>) => void;
  onBack: () => void;
}

const INITIAL_ITEMS = [
  "Quiet space",
  "Visual instructions",
  "Async communication",
  "Flexible hours",
  "Noise-cancelling headphones",
  "Natural lighting",
  "Clear written agendas",
  "Frequent context switching",
  "Pair programming",
  "Open office chatter",
];

export default function WorkEnvMatchmaker({ onComplete, onBack }: Props) {
  const [pools, setPools] = useState<Record<string, string[]>>({
    Pool: INITIAL_ITEMS,
    Must: [],
    "Nice-to-have": [],
    Avoid: [],
  });

  const moveItem = (item: string, from: string, to: string) => {
    if (from === to) return;
    setPools((prev) => ({
      ...prev,
      [from]: prev[from].filter((i) => i !== item),
      [to]: [...prev[to], item],
    }));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: string, from: string) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ item, from }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, to: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (!data) return;
    
    try {
      const { item, from } = JSON.parse(data);
      moveItem(item, from, to);
    } catch (err) {
      console.error("Drop data parsing error:", err);
    }
  };

  const reset = () => setPools({ Pool: INITIAL_ITEMS, Must: [], "Nice-to-have": [], Avoid: [] });

  const handleFinish = () => {
    const mapping: Record<string, string> = {};
    Object.entries(pools).forEach(([bucket, items]) => {
      if (bucket === "Pool") return;
      items.forEach((it) => (mapping[it] = bucket));
    });
    onComplete({ wem_needs: JSON.stringify(mapping) });
  };

  const Bucket = ({ name }: { name: keyof typeof pools }) => (
    <Card
      className="border-dashed"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, name)}
    >
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-base">{name}</CardTitle>
        <Badge variant="outline">{pools[name].length}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-2 min-h-[60px]">
          {pools[name].map((item) => (
            <div
              key={item}
              draggable
              onDragStart={(e) => handleDragStart(e, item, name)}
              className="flex items-center gap-2 border rounded-full px-3 py-1 bg-white dark:bg-gray-900 cursor-move"
            >
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const Pool = () => (
    <Card
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, "Pool")}
    >
      <CardHeader className="py-3">
        <CardTitle className="text-base">Available items</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-2 min-h-[60px]">
          {pools.Pool.map((item) => (
            <div
              key={item}
              draggable
              onDragStart={(e) => handleDragStart(e, item, "Pool")}
              className="flex items-center gap-2 border rounded-full px-3 py-1 bg-white dark:bg-gray-900 cursor-move"
            >
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4 max-w-5xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">🎮 Work Environment Matchmaker</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={reset}>Reset</Button>
            <Button variant="outline" onClick={onBack}>Back</Button>
            <Button onClick={handleFinish}>Finish</Button>
          </div>
        </div>

        <Pool />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Bucket name="Must" />
          <Bucket name="Nice-to-have" />
          <Bucket name="Avoid" />
        </div>
      </div>
    </div>
  );
}