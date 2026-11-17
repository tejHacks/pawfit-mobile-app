/**
 * Pet energy needs. RER (resting energy requirement) = 70 × kg^0.75,
 * multiplied by a standard life-stage factor. These are starting points —
 * owners should confirm targets with their vet.
 */
import { useStoredState } from '@/lib/storage';

export type Species = 'dog' | 'cat';
export type Stage = 'neutered' | 'intact' | 'weight-loss' | 'active' | 'young';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  stage: Stage;
  weightKg: number;
  targetKg: number;
}

export interface FoodEntry {
  id: string;
  petId: string;
  day: string; // YYYY-MM-DD
  label: string;
  kcal: number;
}

const FACTORS: Record<Species, Record<Stage, number>> = {
  dog: { neutered: 1.6, intact: 1.8, 'weight-loss': 1.0, active: 2.0, young: 2.5 },
  cat: { neutered: 1.2, intact: 1.4, 'weight-loss': 0.8, active: 1.6, young: 2.5 },
};

export const stageLabel: Record<Stage, string> = {
  neutered: 'Neutered adult',
  intact: 'Intact adult',
  'weight-loss': 'Weight loss',
  active: 'Very active',
  young: 'Puppy / kitten',
};

export const rer = (kg: number) => 70 * Math.pow(Math.max(kg, 0.1), 0.75);

/** Daily kcal target. Weight-loss plans use the target weight. */
export function dailyTarget(pet: Pet) {
  const kg = pet.stage === 'weight-loss' ? pet.targetKg : pet.weightKg;
  return Math.round(rer(kg) * FACTORS[pet.species][pet.stage]);
}

/** Local calendar day (not UTC), so logs roll over at the user's midnight. */
export const today = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const usePets = () => useStoredState<Pet[]>('pets', []);
export const useFood = () => useStoredState<FoodEntry[]>('food', []);
