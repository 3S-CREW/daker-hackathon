import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const text = await req.text()
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Empty body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    const { username, theme = 'light' } = JSON.parse(text)

    if (!username || typeof username !== 'string') {
      return new Response(
        JSON.stringify({ error: 'username is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY')!

    // GitHub README 조회 (profile README: username/username)
    const readmeRes = await fetch(
      `https://api.github.com/repos/${username}/${username}/contents/README.md`,
      { headers: { 'Accept': 'application/vnd.github.v3.raw', 'User-Agent': 'daker-hackathon' } }
    )

    let readmeContent = ''
    if (readmeRes.ok) {
      readmeContent = await readmeRes.text()
    } else {
      // profile README 없으면 일반 유저 정보로 대체
      const userRes = await fetch(
        `https://api.github.com/users/${username}`,
        { headers: { 'User-Agent': 'daker-hackathon' } }
      )
      if (!userRes.ok) {
        return new Response(
          JSON.stringify({ error: `GitHub 유저 '${username}'를 찾을 수 없습니다.` }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const user = await userRes.json()
      readmeContent = `이름: ${user.name || username}
바이오: ${user.bio || '없음'}
팔로워: ${user.followers}명
공개 저장소: ${user.public_repos}개
위치: ${user.location || '없음'}
블로그: ${user.blog || '없음'}`
    }

    const prompt = `아래는 GitHub 유저 ${username}의 프로필 README입니다.
이 내용을 분석하여 깔끔하고 현대적인 HTML 포트폴리오 페이지를 생성해 주세요.

선택된 테마: ${theme} (light: 깔끔한 화이트, dark: 세련된 다크 모드, gradient: 화려한 그라데이션)

요구사항:
- 단일 HTML 파일 (인라인 CSS 포함, 외부 라이브러리 없음)
- 토스뱅크 스타일: 흰 배경, 파란 강조색(#0064ff), 둥근 모서리, 넓은 여백
- Pretendard 폰트 사용 (Google Fonts에서 로드)
- 섹션: 소개, 기술 스택, 프로젝트, 연락처
- 모바일 반응형 (max-width: 800px 중앙 정렬)
- README에서 추출 가능한 정보만 포함 (없는 정보는 섹션 생략)
- 완전한 HTML 문서만 반환 (설명 텍스트 없이, \`\`\`html 코드 블록 없이)

README 내용:
${readmeContent.slice(0, 3000)}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 3000,
        temperature: 0.5,
      }),
    })

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'AI 서비스 오류가 발생했습니다.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    let html = data.choices[0]?.message?.content ?? ''

    // 코드 블록 마커 제거 (혹시 포함된 경우)
    html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim()

    return new Response(
      JSON.stringify({ html, username }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('portfolio function error:', err)
    return new Response(
      JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
