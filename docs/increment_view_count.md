# increment\_view\_count

**프론트엔드 사용**

DB 레벨에서 유저당 1회만 카운트되도록 중복 방지 처리됨.

비로그인 무조건 카운트.

```typescript
// 콘텐츠 상세 페이지 진입 시 호출
useEffect(() => {
  const trackView = async () => {
    await supabase.rpc('increment_view_count', {
      target_content_id: contentId
    })
  }
  
  trackView()
}, [contentId])

// 반환값 활용 예시
const { data } = await supabase.rpc('increment_view_count', {
  target_content_id: contentId
})

if (data.counted) {
  console.log('조회수 증가됨')
} else {
  console.log('이미 조회한 콘텐츠')
}
```

**파라미터 상세**

target\_content\_id (필수)

| **항목** | **내용**     |
| ------ | ---------- |
| **타입** | `UUID`     |
| **설명** | 조회할 콘텐츠 ID |

**반환 데이터**

```typescript
interface IncrementViewCountResult {
  counted: boolean
}
```

| **필드**    | **타입**    | **설명**                                  |
| --------- | --------- | --------------------------------------- |
| `counted` | `boolean` | true: 조회수 증가됨 (첫 조회), false: 이미 조회한 콘텐츠 |

동작 방식

1. `content_views` 테이블에서 해당 유저가 이 콘텐츠를 조회한 적 있는지 확인
2. **처음 조회**: 조회 기록 저장 + view\_count 증가 + `{ counted: true }` 반환
3. **이미 조회**: 아무 작업 없이 `{ counted: false }` 반환
