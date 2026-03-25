import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, hackathonId } = await req.json()

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const openaiKey = Deno.env.get('OPENAI_API_KEY')!

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 해커톤 컨텍스트 조회
    let hackathonContext = ''
    if (hackathonId) {
      const { data: hackathon } = await supabase
        .from('hackathons')
        .select('title, description, status, team_size, total_prize, submission_deadline_at, end_at, tags')
        .eq('id', hackathonId)
        .single()

      if (hackathon) {
        hackathonContext = `
현재 해커톤 정보:
- 이름: ${hackathon.title}
- 상태: ${hackathon.status}
- 팀 규모: ${hackathon.team_size}
- 총 상금: ${hackathon.total_prize}
- 제출 마감: ${hackathon.submission_deadline_at}
- 대회 종료: ${hackathon.end_at}
- 태그: ${hackathon.tags?.join(', ')}
- 소개: ${hackathon.description}
`
      }
    } else {
      // 전체 해커톤 목록 조회
      const { data: hackathons } = await supabase
        .from('hackathons')
        .select('title, status, total_prize, submission_deadline_at')
        .order('created_at', { ascending: false })
        .limit(5)

      if (hackathons && hackathons.length > 0) {
        hackathonContext = '현재 등록된 해커톤 목록:\n' +
          hackathons.map(h =>
            `- ${h.title} (${h.status}, 상금: ${h.total_prize}, 마감: ${h.submission_deadline_at})`
          ).join('\n')
      }
    }

    const systemPrompt = `당신은 Daker Hackathon 플랫폼의 AI 도우미입니다.
해커톤 참가자들이 대회 규칙, 팀 구성, 제출 방법 등에 대해 질문하면 친절하고 정확하게 답변합니다.

${hackathonContext}

답변 규칙:
- 한국어로 답변합니다
- 간결하고 명확하게 답변합니다 (3~5문장 이내)
- 모르는 정보는 솔직하게 모른다고 답변합니다
- 플랫폼 기능(팀 만들기, 대회 제출, 랭킹 확인)에 대한 안내도 제공합니다`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI error:', error)
      return new Response(
        JSON.stringify({ error: 'AI 서비스 오류가 발생했습니다.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    const reply = data.choices[0]?.message?.content ?? '답변을 생성할 수 없습니다.'

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('chat function error:', err)
    return new Response(
      JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
