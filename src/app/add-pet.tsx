import { router } from 'expo-router';
import { useState } from 'react';

import { Body, Button, Field, Label, Pill, Row, Screen } from '@/components/ui';
import { dailyTarget, stageLabel, usePets, type Pet, type Species, type Stage } from '@/data/pets';
import { uid } from '@/lib/storage';

export default function AddPet() {
  const [, setPets] = usePets();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('dog');
  const [stage, setStage] = useState<Stage>('neutered');
  const [weight, setWeight] = useState('');
  const [target, setTarget] = useState('');

  const w = parseFloat(weight);
  const t = parseFloat(target) || w;
  const valid = name.trim() && w > 0 && w < 150 && t > 0;
  const draft: Pet = { id: '', name, species, stage, weightKg: w || 0, targetKg: t || 0 };

  return (
    <Screen>
      <Field label="Name" value={name} onChangeText={setName} placeholder="e.g. Bingo" />
      <Label>Species</Label>
      <Row>
        <Pill active={species === 'dog'} onPress={() => setSpecies('dog')}>🐶 Dog</Pill>
        <Pill active={species === 'cat'} onPress={() => setSpecies('cat')}>🐱 Cat</Pill>
      </Row>
      <Label>Life stage</Label>
      <Row style={{ flexWrap: 'wrap' }}>
        {(Object.keys(stageLabel) as Stage[]).map((s) => (
          <Pill key={s} active={stage === s} onPress={() => setStage(s)}>
            {stageLabel[s]}
          </Pill>
        ))}
      </Row>
      <Field label="Current weight (kg)" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="12.5" />
      {stage === 'weight-loss' ? <Field label="Target weight (kg)" value={target} onChangeText={setTarget} keyboardType="decimal-pad" placeholder="11" /> : null}
      {valid ? <Body>Daily target: {dailyTarget(draft)} kcal</Body> : null}
      <Button
        title="Save pet"
        disabled={!valid}
        onPress={() => {
          setPets((p) => [...p, { ...draft, id: uid(), name: name.trim() }]);
          router.back();
        }}
      />
    </Screen>
  );
}
