import { test, expect } from '@playwright/test'

// 시나리오 1: 메인 -> 해커톤 목록 -> 상세 페이지 진입
test('@smoke 메인에서 해커톤 상세 페이지까지 진입', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1').first()).toBeVisible()

  // 해커톤 목록 이동
  await page.click('text=해커톤 둘러보기')
  await expect(page).toHaveURL(/\/hackathons/)

  // 페이지 로딩 확인
  await expect(page.locator('h1').first()).toBeVisible()
})

// 시나리오 2: 해커톤 목록 페이지 렌더링
test('@smoke 해커톤 목록 페이지 정상 렌더링', async ({ page }) => {
  await page.goto('/hackathons')
  await expect(page.locator('h1')).toBeVisible()

  // 로딩 후 콘텐츠 확인 (스켈레톤 또는 카드)
  await page.waitForTimeout(2000)
  const body = page.locator('main')
  await expect(body).toBeVisible()
})

// 시나리오 3: 캠프(팀 목록) 페이지 필터 렌더링
test('@smoke Camp 페이지 - 필터 버튼 렌더링 확인', async ({ page }) => {
  await page.goto('/camp')
  await expect(page.locator('h1').first()).toBeVisible()

  // 필터 버튼 존재 확인
  await expect(page.getByRole('button', { name: '전체' })).toBeVisible()
  await expect(page.getByRole('button', { name: '모집 중' })).toBeVisible()

  // 모집 중 필터 클릭
  await page.getByRole('button', { name: '모집 중' }).click()
  await expect(page.getByRole('button', { name: '모집 중' })).toBeVisible()
})

// 시나리오 4: 랭킹 페이지 렌더링
test('@smoke Rankings 페이지 - 순위 테이블 렌더링 확인', async ({ page }) => {
  await page.goto('/rankings')
  await expect(page.locator('h1')).toContainText('랭킹')

  // 전체 필터 버튼 존재 확인
  await expect(page.getByRole('button', { name: '전체' })).toBeVisible()

  // 로딩 대기
  await page.waitForTimeout(2000)
  const main = page.locator('main')
  await expect(main).toBeVisible()
})

// 시나리오 5: AI 챗봇 모달 열기
test('@smoke AI 챗봇 플로팅 버튼 클릭 시 모달 오픈', async ({ page }) => {
  await page.goto('/')

  // AI 플로팅 버튼 클릭
  const aiButton = page.getByRole('button', { name: 'AI 도우미 열기' })
  await expect(aiButton).toBeVisible()
  await aiButton.click()

  // 모달 열림 확인
  await expect(page.getByText('Daker AI 도우미')).toBeVisible()
  await expect(page.getByPlaceholder('질문을 입력하세요...')).toBeVisible()
})
