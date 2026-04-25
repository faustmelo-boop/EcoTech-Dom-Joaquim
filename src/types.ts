/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ResidueType = 'Plástico' | 'Papel' | 'Vidro' | 'Metal' | 'Outros';

export interface FoodWaste {
  id: string;
  date: string;
  menu: string;
  quantity: number;
  adminId: string;
}

export interface ClassTeam {
  id: string;
  name: string;
  teamName: string;
  points: number;
  gamePoints?: number;
  teacherId?: string;
  teacherName?: string;
}

export interface ResidueEntry {
  id: string;
  date: string;
  classId: string;
  type: ResidueType;
  quantity: number;
}

export type MissionDifficulty = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  active: boolean;
  difficulty: MissionDifficulty;
}

export interface VisualLog {
  id: string;
  date: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  teacherId: string;
  teacherName?: string;
  likes?: number;
  feedbacks?: {
    id: string;
    text: string;
    userName: string;
    date: string;
  }[];
}

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  addedAt: string;
}

export interface SupportTicket {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  message: string;
  status: 'open' | 'closed';
  createdAt: string;
}

export type Level = 'Aprendiz Ambiental 🌱' | 'Protetor 🌿' | 'Guardião 🌳' | 'Herói Sustentável 🌎';

export const LEVEL_THRESHOLDS = [
  { min: 0, max: 100, label: 'Aprendiz Ambiental 🌱' as Level, color: 'bg-emerald-100 text-emerald-700' },
  { min: 101, max: 300, label: 'Protetor 🌿' as Level, color: 'bg-green-100 text-green-700' },
  { min: 301, max: 600, label: 'Guardião 🌳' as Level, color: 'bg-lime-100 text-lime-700' },
  { min: 601, max: Infinity, label: 'Herói Sustentável 🌎' as Level, color: 'bg-teal-100 text-teal-700' },
];

export function getLevelInfo(points: number) {
  return LEVEL_THRESHOLDS.find(t => points >= t.min && points <= t.max) || LEVEL_THRESHOLDS[0];
}
