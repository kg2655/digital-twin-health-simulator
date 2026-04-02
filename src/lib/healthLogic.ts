export interface HealthInputs {
  age: number;
  sleep: number;
  water: number;
  exercise: number;
  stress: number;
}

export interface ImpactFactor {
  name: string;
  impact: number; // -100 to 100
  status: 'positive' | 'negative' | 'neutral';
  description: string;
}

export function calculateHealthScore(inputs: HealthInputs): { score: number; impacts: ImpactFactor[] } {
  let score = 50;
  const impacts: ImpactFactor[] = [];

  // Sleep logic
  let sleepImpact = 0;
  if (inputs.sleep < 6) {
    sleepImpact = -15;
    impacts.push({ name: 'Sleep', impact: sleepImpact, status: 'negative', description: 'Insufficient rest is severely impacting your recovery.' });
  } else if (inputs.sleep >= 7 && inputs.sleep <= 9) {
    sleepImpact = 15;
    impacts.push({ name: 'Sleep', impact: sleepImpact, status: 'positive', description: 'Optimal sleep duration for cognitive health.' });
  } else {
    sleepImpact = 5;
    impacts.push({ name: 'Sleep', impact: sleepImpact, status: 'neutral', description: 'Adequate sleep, but watch for oversleeping.' });
  }
  score += sleepImpact;

  // Exercise logic
  let exerciseImpact = 0;
  if (inputs.exercise < 20) {
    exerciseImpact = -15;
    impacts.push({ name: 'Activity', impact: exerciseImpact, status: 'negative', description: 'Sedentary lifestyle increases long-term health risks.' });
  } else if (inputs.exercise >= 30 && inputs.exercise <= 60) {
    exerciseImpact = 15;
    impacts.push({ name: 'Activity', impact: exerciseImpact, status: 'positive', description: 'Great activity level for cardiovascular health.' });
  } else {
    exerciseImpact = 20;
    impacts.push({ name: 'Activity', impact: exerciseImpact, status: 'positive', description: 'High activity level! You are building strong resilience.' });
  }
  score += exerciseImpact;

  // Stress logic
  let stressImpact = 0;
  if (inputs.stress > 7) {
    stressImpact = -20;
    impacts.push({ name: 'Stress', impact: stressImpact, status: 'negative', description: 'High cortisol levels are degrading your overall score.' });
  } else if (inputs.stress >= 4 && inputs.stress <= 7) {
    stressImpact = -5;
    impacts.push({ name: 'Stress', impact: stressImpact, status: 'neutral', description: 'Moderate stress detected. Manageable but needs attention.' });
  } else {
    stressImpact = 10;
    impacts.push({ name: 'Stress', impact: stressImpact, status: 'positive', description: 'Excellent stress management.' });
  }
  score += stressImpact;

  // Water logic
  let waterImpact = 0;
  if (inputs.water < 1.5) {
    waterImpact = -10;
    impacts.push({ name: 'Hydration', impact: waterImpact, status: 'negative', description: 'Dehydration is slowing down your metabolism.' });
  } else if (inputs.water >= 2) {
    waterImpact = 10;
    impacts.push({ name: 'Hydration', impact: waterImpact, status: 'positive', description: 'Well hydrated! Your cells are functioning optimally.' });
  } else {
    impacts.push({ name: 'Hydration', impact: 0, status: 'neutral', description: 'Hydration is adequate but could be better.' });
  }
  score += waterImpact;

  const finalScore = Math.min(100, Math.max(0, score));
  return { score: finalScore, impacts };
}

export function getHealthPersona(inputs: HealthInputs, score: number) {
  if (score > 85) return { name: "The Vitality Master", description: "You're in peak condition. Your digital twin is thriving.", color: "text-emerald-500" };
  if (inputs.stress > 8 && inputs.sleep < 6) return { name: "The Burnout Risk", description: "High stress and low sleep are a dangerous combination.", color: "text-rose-500" };
  if (inputs.exercise > 60 && inputs.water < 1.5) return { name: "The Dehydrated Athlete", description: "Great activity, but you're neglecting recovery fluids.", color: "text-amber-500" };
  if (inputs.exercise < 15 && inputs.sleep > 9) return { name: "The Sedentary Sleeper", description: "You're resting well, but your body needs movement.", color: "text-indigo-500" };
  if (score > 60) return { name: "The Balanced Strivers", description: "You have a solid routine with minor tweaks needed.", color: "text-blue-500" };
  return { name: "The Lifestyle Rebooter", description: "It's time for a fresh start. Small changes will yield big results.", color: "text-slate-500" };
}

export function simulateHealth(inputs: HealthInputs, days: number = 30, targetInputs?: HealthInputs) {
  const { score: currentScore } = calculateHealthScore(inputs);
  
  // Improved inputs (Ideal)
  const idealInputs: HealthInputs = {
    ...inputs,
    sleep: Math.max(inputs.sleep, 7.5),
    exercise: Math.max(inputs.exercise, 30),
    stress: Math.min(inputs.stress, 3),
    water: Math.max(inputs.water, 2.5),
  };
  const { score: idealScore } = calculateHealthScore(idealInputs);

  // What If inputs (Custom)
  const whatIfScore = targetInputs ? calculateHealthScore(targetInputs).score : currentScore;

  const data = [];
  for (let i = 0; i <= days; i++) {
    const currentTrend = currentScore + (currentScore < 50 ? -0.15 * i : 0.05 * i);
    const idealTrend = currentScore + (idealScore - currentScore) * (1 - Math.exp(-0.15 * i));
    const whatIfTrend = currentScore + (whatIfScore - currentScore) * (1 - Math.exp(-0.15 * i));

    data.push({
      day: i === 0 ? 'Now' : `Day ${i}`,
      current: Math.min(100, Math.max(0, Math.round(currentTrend))),
      improved: Math.min(100, Math.max(0, Math.round(idealTrend))),
      whatIf: Math.min(100, Math.max(0, Math.round(whatIfTrend))),
    });
  }

  return data;
}

export function getInsights(inputs: HealthInputs, score: number) {
  const suggestions = [];
  if (inputs.sleep < 7) suggestions.push("Aim for at least 7-8 hours of sleep to improve cognitive function and recovery.");
  if (inputs.exercise < 30) suggestions.push("Try to get at least 30 minutes of moderate exercise daily.");
  if (inputs.stress > 6) suggestions.push("Consider mindfulness or meditation to lower your stress levels.");
  if (inputs.water < 2) suggestions.push("Increase your water intake to at least 2 liters for better hydration.");

  let summary = "";
  if (score > 80) summary = "Your current lifestyle is excellent! You're on a great path.";
  else if (score > 60) summary = "You have a solid foundation, but there's room for optimization.";
  else summary = "Your health score is currently low. Small changes can make a big difference over time.";

  return { suggestions, summary };
}
