import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Ring } from '@/components/ring';
import { Body, Button, Card, Field, Label, Row, Screen } from '@/components/ui';
import { dailyTarget, today, useFood, usePets } from '@/data/pets';
import { uid } from '@/lib/storage';
import { usePalette } from '@/theme';

export default function PetScreen() {
  const c = usePalette();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pets, setPets] = usePets();
  const [food, setFood] = useFood();
  const [label, setLabel] = useState('');
  const [kcal, setKcal] = useState('');
  const [weight, setWeight] = useState('');
  const pet = pets.find((p) => p.id === id);

  if (!pet) return <Screen><Body>Pet not found.</Body></Screen>;

  const day = today();
  const entries = food.filter((f) => f.petId === pet.id && f.day === day);
  const eaten = entries.reduce((s, f) => s + f.kcal, 0);
  const target = dailyTarget(pet);
  const k = parseInt(kcal, 10);

  return (
    <Screen>
      <Stack.Screen options={{ title: pet.name }} />
      <View style={{ alignItems: 'center', paddingVertical: 8 }}>
        <Ring progress={eaten / target} color={c.primary} track={c.border}>
          <Text style={{ color: c.text, fontSize: 36, fontWeight: '800' }}>{eaten}</Text>
          <Text style={{ color: c.muted }}>of {target} kcal</Text>
        </Ring>
      </View>
      <Body muted style={{ textAlign: 'center' }}>{eaten > target ? `${eaten - target} kcal over today` : `${target - eaten} kcal left today`}</Body>

      <Card>
        <Label>Log food</Label>
        <Field label="What" value={label} onChangeText={setLabel} placeholder="Dry food, 1 cup" />
        <Field label="Calories (kcal)" value={kcal} onChangeText={setKcal} keyboardType="number-pad" placeholder="350" />
        <Button
          title="Add"
          disabled={!(k > 0)}
          onPress={() => {
            setFood((f) => [...f, { id: uid(), petId: pet.id, day, label: label.trim() || 'Food', kcal: k }]);
            setLabel('');
            setKcal('');
          }}
        />
        {entries.map((e) => (
          <Row key={e.id} style={{ justifyContent: 'space-between' }}>
            <Body>{e.label}</Body>
            <Body muted>{e.kcal} kcal</Body>
          </Row>
        ))}
      </Card>

      <Card>
        <Label>Weight</Label>
        <Body>
          {pet.weightKg} kg{pet.stage === 'weight-loss' ? ` → target ${pet.targetKg} kg` : ''}
        </Body>
        <Field label="Update weight (kg)" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder={String(pet.weightKg)} />
        <Button
          title="Save weight"
          variant="secondary"
          disabled={!(parseFloat(weight) > 0)}
          onPress={() => {
            setPets((ps) => ps.map((p) => (p.id === pet.id ? { ...p, weightKg: parseFloat(weight) } : p)));
            setWeight('');
          }}
        />
      </Card>

      <Button
        title={`Remove ${pet.name}`}
        variant="secondary"
        onPress={() => {
          setPets((ps) => ps.filter((p) => p.id !== pet.id));
          setFood((f) => f.filter((e) => e.petId !== pet.id));
          router.back();
        }}
      />
    </Screen>
  );
}
