import { StyleSheet, Text, View } from 'react-native';

/**
 * Progress ring built from two half-discs (no SVG dependency).
 * `progress` is 0..1+; over 1 the ring turns the warning colour.
 */
export function Ring({ progress, size = 200, color, track, children }: { progress: number; size?: number; color: string; track: string; children?: React.ReactNode }) {
  const p = Math.min(Math.max(progress, 0), 1);
  const ringColor = progress > 1.05 ? '#F59E0B' : color;
  const half = size / 2;
  const thickness = size * 0.1;
  const halfStyle = { width: half, height: size, overflow: 'hidden' as const, position: 'absolute' as const };
  const disc = { width: size, height: size, borderRadius: half, borderWidth: thickness, position: 'absolute' as const };

  return (
    <View style={{ width: size, height: size }}>
      <View style={[disc, { borderColor: track }]} />
      {/* right half: 0–50% */}
      <View style={[halfStyle, { left: half }]}>
        <View style={[disc, { left: -half, borderColor: ringColor, borderLeftColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: `${-135 + Math.min(p, 0.5) * 360}deg` }] }]} />
      </View>
      {/* left half: 50–100% */}
      {p > 0.5 ? (
        <View style={[halfStyle, { left: 0 }]}>
          <View style={[disc, { left: 0, borderColor: ringColor, borderRightColor: 'transparent', borderTopColor: 'transparent', transform: [{ rotate: `${-135 + (p - 0.5) * 360}deg` }] }]} />
        </View>
      ) : null}
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        {children ?? <Text>{Math.round(progress * 100)}%</Text>}
      </View>
    </View>
  );
}
