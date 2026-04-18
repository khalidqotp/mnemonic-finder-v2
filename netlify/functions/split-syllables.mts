import type { Context } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { word } = await req.json()
  if (!word) {
    return Response.json({ error: 'Missing word' }, { status: 400 })
  }

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    system: `أنت مساعد لغوي متخصص. المستخدم يعطيك كلمة يابانية مكتوبة بالحروف العربية.
مهمتك: قسّم الكلمة إلى مقاطع صوتية (كل مقطع عادةً 2-3 حروف عربية).
قواعد التقسيم:
- كل 2-3 حروف عربية تكوّن مقطعاً
- مثال: "كونيتشيوا" → ["كو","ني","تشي","وا"]
- مثال: "سوكاري" → ["سو","كا","ري"]
- مثال: "جاكاري" → ["جا","كا","ري"]
رد فقط بـ JSON هكذا بدون أي نص خارجه:
{"syllables": ["مق1","مق2","مق3"]}`,
    messages: [{ role: 'user', content: `قسّم هذه الكلمة إلى مقاطع: "${word}"` }],
  })

  const raw = (message.content[0] as { text: string }).text
  const clean = raw.replace(/```json|```/g, '').trim()
  const parsed = JSON.parse(clean)

  return Response.json({ syllables: parsed.syllables || [] })
}

export const config = {
  path: '/api/split-syllables',
}
