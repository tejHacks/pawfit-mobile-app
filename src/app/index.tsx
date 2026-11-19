import { router, Redirect } from 'expo-router';
import { Text, View } from 'react-native';

import { Body, Button, Card, H2, Row, Screen } from '@/components/ui';
import { dailyTarget, stageLabel, today, useFood, usePets } from '@/data/pets';
import { useStoredState } from '@/lib/storage';
import { usePalette } from '@/theme';

export default function Home() {
  const [onboarded, , onboardedReady] = useStoredState('onboarded', false);
  if (onboardedReady && !onboarded) return <Redirect href="/onboarding" />;
  return <HomeScreen />;
}

function HomeScreen() {
  const c = usePalette();
  const [pets] = usePets();
  const [food] = useFood();
  const day = today();

  return (
    <Screen>
      {pets.length === 0 ? (
        <Card>
          <H2>Keep your pet at a healthy weight</H2>
          <Body muted>Add your dog or cat to get a daily calorie target and log what they eat.</Body>
        </Card>
      ) : null}

      {pets.map((p) => {
        const eaten = food.filter((f) => f.petId === p.id && f.day === day).reduce((s, f) => s + f.kcal, 0);
        const target = dailyTarget(p);
        const pct = Math.min(100, Math.round((eaten / target) * 100));
        return (
          <Card key={p.id} onPress={() => router.push({ pathname: '/pet/[id]', params: { id: p.id } })}>
            <Row>
              <Text style={{ fontSize: 40 }}>{p.species === 'dog' ? '🐶' : '🐱'}</Text>
              <View style={{ flex: 1 }}>
                <H2>{p.name}</H2>
                <Body muted>
                  {p.weightKg} kg · {stageLabel[p.stage]}
                </Body>
              </View>
              <Text style={{ color: c.primary, fontWeight: '800', fontSize: 16 }}>
                {eaten}/{target}
              </Text>
            </Row>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: c.border, overflow: 'hidden' }}>
              <View style={{ height: 8, width: `${pct}%`, backgroundColor: eaten > target * 1.05 ? '#F59E0B' : c.primary }} />
            </View>
          </Card>
        );
      })}

      <Button title="Add a pet" onPress={() => router.push('/add-pet')} />
      <Body muted style={{ fontSize: 13 }}>Targets use standard veterinary formulas as a starting point. Check with your vet, especially for weight-loss plans.</Body>
    </Screen>
  );
}
