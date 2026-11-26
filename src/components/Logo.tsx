import { PawPrint } from 'lucide-react';

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          light ? 'bg-white/15 text-white' : 'bg-teal-700 text-white'
        }`}
      >
        <PawPrint className="h-5 w-5" />
      </span>
      <span className={`text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
        Pet<span className={light ? 'text-teal-200' : 'text-teal-700'}>Care</span>
      </span>
    </span>
  );
}
