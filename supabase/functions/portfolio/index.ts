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

    // 1. GitHub 유저 기본 정보 조회
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
    const userProfile = await userRes.json()

    // 2. 주요 저장소 조회 (별순 정렬, 상위 6개)
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&per_page=6`,
      { headers: { 'User-Agent': 'daker-hackathon' } }
    )
    let reposData = []
    if (reposRes.ok) {
      reposData = await reposRes.json()
    }

    // 3. GitHub README 조회 (profile README: username/username)
    const readmeRes = await fetch(
      `https://api.github.com/repos/${username}/${username}/contents/README.md`,
      { headers: { 'Accept': 'application/vnd.github.v3.raw', 'User-Agent': 'daker-hackathon' } }
    )

    let readmeContent = ''
    if (readmeRes.ok) {
      readmeContent = await readmeRes.text()
    }

    // AI에게 제공할 데이터 구성
    const githubData = {
      profile: {
        name: userProfile.name || username,
        bio: userProfile.bio,
        avatar_url: userProfile.avatar_url,
        blog: userProfile.blog,
        location: userProfile.location,
        followers: userProfile.followers,
        public_repos: userProfile.public_repos,
        html_url: userProfile.html_url
      },
      top_repositories: reposData.map((r: any) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stargazers_count: r.stargazers_count,
        html_url: r.html_url
      })),
      readme_summary: readmeContent.slice(0, 2000) // 너무 길면 자름
    }

    const prompt = `아래 GitHub 데이터를 바탕으로 전문가 수준의 개인 포트폴리오 HTML 페이지를 생성해 주세요.

데이터: ${JSON.stringify(githubData)}
선택된 테마: ${theme} (light: 깔끔한 화이트, dark: 세련된 다크 모드, gradient: 화려한 그라데이션)

요구사항:
- 단일 HTML 파일로 작성 (인라인 CSS 포함, 외부 자바스크립트 최소화)
- 디자인 스타일: 토스(Toss) 및 애플(Apple) 스타일의 극도로 깔끔하고 프리미엄한 느낌
  - 넓은 여백, 부드러운 그림자(Soft Shadows), 둥근 모서리(24px 이상)
  - 굵고 간결한 타이포그래피 (Pretendard 폰트 사용)
  - 인터랙티브한 호버 효과 포함
- 구성 섹션 (필수):
  1. Hero: 아바타 이미지, 이름, 짧은 자기소개, 링크(GitHub, 블로그 등)
  2. About: README 기반으로 유저의 전문성 요약
  3. Projects: 제공된 상위 저장소들을 카드 형태로 시각화 (별 수, 주요 언어 포함)
  4. GitHub Stats: 팔로워 수, 저장소 수 등 유저의 현재 영향력을 수치화하여 시각적으로 표현
  5. Contact: 유저와 소통할 수 있는 정보 및 소셜 링크
- 모바일 반응형 지원 필수
- 별도의 이미지나 placeholder 대신 제공된 아바타 URL을 적극 사용하세요.
- 프로젝트 링크는 제공된 GitHub URL을 연결해 주세요.
- 설명 텍스트 없이 완벽한 HTML 문서 전체 코드만 반환하세요 (\`\`\`html 마크다운 제외).

사용자 언어: 한국어 (내용은 한국어로 작성)`

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
        temperature: 0.7, // 창의성과 구조의 밸런스
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

