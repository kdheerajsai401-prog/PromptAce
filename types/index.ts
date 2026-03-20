export interface ForgeResult {
  intent_category: string;
  intent_subtype: string;
  intent_label: string;
  intent_emoji: string;
  score_original: number;
  score_forged: number;
  score_reason: string;
  text_risk?: boolean;
  text_risk_note?: string;
  unknown_technique?: boolean;
  technique_flag?: string;
  prompt: string;
  negative_prompt?: string;
  tool: string;
  tool_reason: string;
  parameters?: string;
  parameters_label?: string;
  tips: string[];
  variation_bold: string;
  variation_experimental: string;
}

export interface ForgeRequest {
  input: string;
  dna?: { niche: string; tone: string; platform: string };
}
