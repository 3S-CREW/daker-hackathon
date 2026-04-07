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

    // 3. GitHub README 조회 로직 강화 (다중 폴백 지원)
    let readmeContent = ''
    try {
      // 1순위: API를 통한 profile README 요청 (raw)
      let readmeRes = await fetch(
        `https://api.github.com/repos/${username}/${username}/contents/README.md`,
        { headers: { 'Accept': 'application/vnd.github.v3.raw', 'User-Agent': 'daker-hackathon' } }
      )
      
      if (!readmeRes.ok) {
        // 2순위: 소문자 readme.md 시도
        readmeRes = await fetch(
          `https://api.github.com/repos/${username}/${username}/contents/readme.md`,
          { headers: { 'Accept': 'application/vnd.github.v3.raw', 'User-Agent': 'daker-hackathon' } }
        )
      }

      if (readmeRes.ok) {
        readmeContent = await readmeRes.text()
      } else if (reposData.length > 0) {
        // 3순위: 프로필 리드미가 없다면, 가장 스타가 많은 1위 저장소의 리드미라도 가져온다
        const topRepo = reposData[0].name
        const topRepoReadmeRes = await fetch(
          `https://api.github.com/repos/${username}/${topRepo}/contents/README.md`,
          { headers: { 'Accept': 'application/vnd.github.v3.raw', 'User-Agent': 'daker-hackathon' } }
        )
        if (topRepoReadmeRes.ok) {
          readmeContent = await topRepoReadmeRes.text()
          readmeContent = `[프로필 리드미가 없어 대표 프로젝트(${topRepo})의 리드미를 제공합니다]\n\n` + readmeContent
        }
      }
    } catch(e) {
      console.error('Readme fetch failed:', e)
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
      readme_summary: readmeContent // 전체 전달
    }

    const prompt = `아래 GitHub 데이터 및 README 내역을 바탕으로, 최고급 개발자 채용 시장에서 쓰일 법한 **'세련된 디지털 명함 및 이력서(Digital Business Card & Resume)'** 형태의 단일 HTML 페이지를 제작해 주세요.

데이터: ${JSON.stringify(githubData)}
선택된 테마: ${theme}

**최고 중요 지침 (시스템 파손 방지)**:
- **오로지 <!DOCTYPE html>로 시작하는 순수 HTML 코드만 출력하세요.**
- 인사말, 설명, 마크다운 코드블록(\`\`\`html) 등 HTML 태그 외부의 어떠한 텍스트도 절대 쓰지 마세요.

**디자인 지침 (프리미엄 & 정갈함)**:
- 전체적으로 복잡하지 않은 **여백 중심의 미니멀리즘(Bento Box 스타일 또는 섹션 분리형)** 디자인을 적용하세요.
- 명함처럼 한눈에 들어오는 **Hero 섹션**을 페이지 최상단에 배치하세요 (아바타, 이름, 직급/포지션 타이틀, 소셜 링크 집중 배치).
- **README 완전 활용 (핵심 지시)**: 제공된 README 텍스트에 담긴 개발자의 **이력, 경험, 스토리, 경력 사항을 절대 누락하지 마세요**. 
  단순 요약으로 끝내지 말고, 세련된 웹페이지의 **'Detailed Resume / Experience'** 등의 메인 섹션으로 구성하여, 사용자가 작성한 이력이 충실히 노출되도록 상세하게 포맷팅해 주세요.
- **간격과 정렬**: 요소들이 절대로 서로 달라붙지 않도록, 섹션 간에는 최소 \`80px\`, 카드 간에는 최소 \`32px\`(\`gap: 2rem\`)의 충분한 여백을 확보하세요.
- **카드 미학**: 프로젝트 카드는 튀지 않는 옅은 테두리(\`border: 1px solid rgba(0,0,0,0.05)\`)와 큰 모서리 둥글기(\`border-radius: 20px\`), 부드러운 그림자를 사용해 깔끔하게 완성하세요.
- **폰트**: 전역에 'Pretendard' 폰트를 적용하고, 제목 타이포그래피는 매우 세련되게 처리하세요 (\`letter-spacing: -0.02em\`, \`line-height: 1.4\`).

결과물은 채용 담당자에게 바로 링크를 공유해도 손색없는, 완벽하게 스타일링되고 이력이 상세히 기재된 한 장짜리 포트폴리오 웹페이지여야 합니다. 오직 HTML 코드만 출력하십시오.`

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
        temperature: 0.3, // 명확한 구조와 지침 준수율을 위해 낮게 유지
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

    // 1. 마크다운 코드 블록 흔적 완전 제거
    html = html.replace(/```html/ig, '').replace(/```/g, '').trim()

    // 2. 혹시라도 남은 앞뒤 쓰레기 텍스트(대화체) 잘라내기 (최초의 < 와 최후의 > 사이만 추출)
    const firstTagIndex = html.indexOf('<')
    const lastTagIndex = html.lastIndexOf('>')
    if (firstTagIndex !== -1 && lastTagIndex !== -1 && lastTagIndex > firstTagIndex) {
      html = html.substring(firstTagIndex, lastTagIndex + 1)
    }

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

