export type Verdict = 'safe' | 'suspicious' | 'dangerous';

export interface Check {
  label: string;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
}

export interface AnalysisResult {
  verdict: Verdict;
  confidence: number;
  title: string;
  explanation: string;
  keywords: string[];
  checks: Check[];
  voiceEN: string;
  voiceHI: string;
}

const DANGER_KEYWORDS = [
  'otp', 'pin', 'password', 'cvv', 'bank account', 'credit card',
  'social security', 'ssn', 'transfer money', 'send money', 'wire transfer',
  'suspended', 'blocked', 'verify your account', 'confirm your identity',
  'click here immediately', 'act now', 'urgent action required',
  'your account will be closed', 'unauthorized transaction',
  'aadhaar', 'pan card', 'kyc update', 'link expired',
  'lottery winner', 'you have won', 'claim your prize',
  'arrest warrant', 'legal action', 'police complaint',
];

const WARNING_KEYWORDS = [
  'free', 'offer', 'limited time', 'discount', 'congratulations',
  'click here', 'subscribe', 'unsubscribe', 'verify', 'confirm',
  'update your details', 'unusual activity', 'login attempt',
  'delivery failed', 'package', 'shipment',
];

const SUSPICIOUS_DOMAINS = [
  'bit.ly', 'tinyurl', 'goo.gl', 't.co', 'is.gd', 'buff.ly',
  'ow.ly', 'adf.ly', 'tiny.cc',
];

const FAKE_TLDS = ['.xyz', '.top', '.club', '.work', '.click', '.loan', '.racing', '.win', '.bid', '.stream'];

function findKeywords(text: string, list: string[]): string[] {
  const lower = text.toLowerCase();
  return list.filter(k => lower.includes(k));
}

export function analyzeText(text: string, type: 'call' | 'sms'): AnalysisResult {
  const dangerFound = findKeywords(text, DANGER_KEYWORDS);
  const warnFound = findKeywords(text, WARNING_KEYWORDS);
  const score = dangerFound.length * 20 + warnFound.length * 8;
  const confidence = Math.min(98, Math.max(15, score + 30));

  let verdict: Verdict = 'safe';
  if (score >= 40) verdict = 'dangerous';
  else if (score >= 15) verdict = 'suspicious';

  const typeLabel = type === 'call' ? 'call transcript' : 'message';

  const checks: Check[] = [
    { label: 'Personal Info Request', status: dangerFound.some(k => ['otp','pin','password','cvv','aadhaar','pan card'].includes(k)) ? 'fail' : 'pass', detail: dangerFound.some(k => ['otp','pin','password','cvv'].includes(k)) ? 'Asks for sensitive credentials' : 'No credential requests found' },
    { label: 'Urgency Tactics', status: dangerFound.some(k => k.includes('urgent') || k.includes('immediately') || k.includes('act now')) ? 'fail' : warnFound.some(k => k.includes('limited')) ? 'warn' : 'pass', detail: 'Checks for pressure language' },
    { label: 'Financial Request', status: dangerFound.some(k => k.includes('money') || k.includes('transfer') || k.includes('bank')) ? 'fail' : 'pass', detail: 'Checks for money transfer requests' },
    { label: 'Threat Language', status: dangerFound.some(k => k.includes('arrest') || k.includes('legal') || k.includes('police') || k.includes('suspended') || k.includes('blocked')) ? 'fail' : 'pass', detail: 'Checks for intimidation tactics' },
    { label: 'Too-Good-To-Be-True', status: dangerFound.some(k => k.includes('winner') || k.includes('won') || k.includes('prize') || k.includes('lottery')) ? 'fail' : warnFound.some(k => k.includes('free') || k.includes('congratulations')) ? 'warn' : 'pass', detail: 'Checks for unrealistic promises' },
    { label: 'Grammar & Spelling', status: text.split(' ').length < 5 ? 'warn' : 'pass', detail: 'Analyzes text quality' },
  ];

  const voiceEN = verdict === 'dangerous'
    ? `This ${typeLabel} is dangerous! It is trying to steal your personal information. Never share your OTP, password, or bank details. Delete it immediately.`
    : verdict === 'suspicious'
    ? `This ${typeLabel} looks suspicious. Be careful and do not click any links or share personal information.`
    : `This ${typeLabel} appears safe. No scam patterns were detected. Stay vigilant.`;

  const voiceHI = verdict === 'dangerous'
    ? `Yeh ${typeLabel} khatarnak hai! Yeh aapki jaankari churane ki koshish kar raha hai. Kabhi apna OTP, password ya bank details share mat karo. Ise turant delete karo.`
    : verdict === 'suspicious'
    ? `Yeh ${typeLabel} sandigdh lagta hai. Savdhan rahein aur koi bhi link click mat karein.`
    : `Yeh ${typeLabel} surakshit lagta hai. Koi scam pattern nahi mila. Savdhan rahein.`;

  return {
    verdict, confidence,
    title: verdict === 'dangerous' ? '🚨 Scam Detected!' : verdict === 'suspicious' ? '⚠️ Suspicious Content' : '✅ Appears Safe',
    explanation: verdict === 'dangerous'
      ? `This ${typeLabel} contains ${dangerFound.length} dangerous pattern(s) commonly used in scams. It attempts to create urgency and extract sensitive information.`
      : verdict === 'suspicious'
      ? `This ${typeLabel} contains some warning signs. While not definitively a scam, exercise caution.`
      : `This ${typeLabel} does not contain common scam patterns. It appears to be legitimate.`,
    keywords: [...dangerFound, ...warnFound],
    checks, voiceEN, voiceHI,
  };
}

export function analyzeUrl(url: string): AnalysisResult {
  const lower = url.toLowerCase();
  let score = 0;
  const flags: string[] = [];

  if (!lower.startsWith('https://')) { score += 25; flags.push('No HTTPS'); }
  if (lower.includes('@')) { score += 30; flags.push('Contains @ symbol'); }
  if ((lower.match(/\./g) || []).length > 3) { score += 15; flags.push('Too many subdomains'); }
  if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lower)) { score += 35; flags.push('IP address in URL'); }
  SUSPICIOUS_DOMAINS.forEach(d => { if (lower.includes(d)) { score += 20; flags.push(`URL shortener: ${d}`); } });
  FAKE_TLDS.forEach(t => { if (lower.includes(t)) { score += 15; flags.push(`Suspicious TLD: ${t}`); } });
  if (lower.includes('login') || lower.includes('signin') || lower.includes('verify') || lower.includes('secure') || lower.includes('account')) { score += 10; flags.push('Login/verify keywords in URL'); }
  if (lower.length > 75) { score += 10; flags.push('Unusually long URL'); }
  const knownBrands = ['paypal', 'google', 'facebook', 'apple', 'amazon', 'microsoft', 'netflix', 'instagram'];
  knownBrands.forEach(b => {
    if (lower.includes(b) && !lower.includes(`${b}.com`)) { score += 25; flags.push(`Impersonating ${b}`); }
  });

  const confidence = Math.min(98, Math.max(20, score + 25));
  let verdict: Verdict = 'safe';
  if (score >= 40) verdict = 'dangerous';
  else if (score >= 15) verdict = 'suspicious';

  const checks: Check[] = [
    { label: 'HTTPS Protocol', status: lower.startsWith('https://') ? 'pass' : 'fail', detail: lower.startsWith('https://') ? 'Secure connection' : 'No encryption' },
    { label: 'Domain Reputation', status: flags.some(f => f.includes('Impersonating') || f.includes('IP address')) ? 'fail' : flags.some(f => f.includes('shortener') || f.includes('TLD')) ? 'warn' : 'pass', detail: 'Domain trust analysis' },
    { label: 'URL Structure', status: flags.some(f => f.includes('@') || f.includes('long')) ? 'fail' : 'pass', detail: 'Checks for obfuscation' },
    { label: 'Phishing Patterns', status: flags.some(f => f.includes('Login') || f.includes('verify')) ? 'warn' : 'pass', detail: 'Checks for credential harvesting' },
    { label: 'Brand Impersonation', status: flags.some(f => f.includes('Impersonating')) ? 'fail' : 'pass', detail: 'Checks for brand spoofing' },
    { label: 'Redirect Analysis', status: flags.some(f => f.includes('shortener')) ? 'warn' : 'pass', detail: 'Checks for redirect chains' },
  ];

  return {
    verdict, confidence,
    title: verdict === 'dangerous' ? '🚨 Dangerous Link!' : verdict === 'suspicious' ? '⚠️ Suspicious Link' : '✅ Link Appears Safe',
    explanation: verdict === 'dangerous'
      ? `This URL shows ${flags.length} red flag(s): ${flags.join(', ')}. Do NOT click this link.`
      : verdict === 'suspicious'
      ? `This URL has some warning signs: ${flags.join(', ')}. Proceed with caution.`
      : 'This URL appears legitimate with no obvious red flags.',
    keywords: flags, checks,
    voiceEN: verdict === 'dangerous' ? 'This link is dangerous! Do not click it. It may steal your information.' : verdict === 'suspicious' ? 'This link looks suspicious. Be very careful before clicking.' : 'This link appears safe. No red flags detected.',
    voiceHI: verdict === 'dangerous' ? 'Yeh link khatarnak hai! Ise click mat karo. Yeh aapki jaankari chura sakta hai.' : verdict === 'suspicious' ? 'Yeh link sandigdh hai. Click karne se pehle savdhan rahein.' : 'Yeh link surakshit lagta hai.',
  };
}

export function analyzeWebsite(url: string): AnalysisResult {
  const result = analyzeUrl(url);
  const knownBrands = ['paypal', 'google', 'facebook', 'apple', 'amazon', 'microsoft', 'netflix', 'instagram', 'sbi', 'hdfc', 'icici'];
  const lower = url.toLowerCase();
  let impersonating = '';
  knownBrands.forEach(b => {
    if (lower.includes(b) && !lower.includes(`${b}.com`) && !lower.includes(`${b}.in`)) {
      impersonating = b;
    }
  });
  if (impersonating) {
    result.title = `🚨 Fake ${impersonating.charAt(0).toUpperCase() + impersonating.slice(1)} Website!`;
    result.explanation = `This website is impersonating ${impersonating}. DO NOT enter any credentials or personal information. The real website is ${impersonating}.com`;
    result.verdict = 'dangerous';
    result.confidence = Math.max(result.confidence, 90);
  }
  return result;
}
