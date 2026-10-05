import React from 'react';
import { 
  Sun, 
  Scale, 
  BookOpen, 
  Trees, 
  Vote, 
  Flame, 
  ShieldCheck, 
  Award,
  Landmark
} from 'lucide-react';

export default function CandidateSymbolIcon({ name, className = 'w-6 h-6', style = {} }) {
  switch ((name || '').toLowerCase()) {
    case 'sun':
    case 'rising sun':
      return <Sun className={className} style={style} />;
    case 'scale':
    case 'scales of justice':
      return <Scale className={className} style={style} />;
    case 'book-open':
    case 'open book':
      return <BookOpen className={className} style={style} />;
    case 'trees':
    case 'banyan tree':
    case 'tree':
      return <Trees className={className} style={style} />;
    case 'vote':
    case 'ballot stamp':
    case 'nota':
      return <Vote className={className} style={style} />;
    case 'flame':
    case 'torch':
      return <Flame className={className} style={style} />;
    case 'shield':
      return <ShieldCheck className={className} style={style} />;
    case 'landmark':
      return <Landmark className={className} style={style} />;
    default:
      return <Award className={className} style={style} />;
  }
}
