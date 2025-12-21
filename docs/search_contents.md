# search\_contents

**프론트엔드 사용**

```typescript
const { data, error } = await supabase.rpc('search_contents', {
  search_query: '검색어',
  content_type_filter: 'mcp',
  tag_ids: [1, 2, 3],
  sort_by: 'latest',
  page_number: 1,
  page_size: 20
})

const { data } = await supabase.rpc('search_contents', {})
// 실제로는 이렇게 동작:
// search_query: null        → 전체 검색
// content_type_filter: null → 전체 타입
// tag_ids: null             → 태그 필터 없음
// sort_by: 'latest'         → 최신순
// page_number: 1            → 첫 페이지
// page_size: 20             → 20개
-> 전체 콘텐츠를 최신순으로 20개 가져옴
```

**파라미터 상세**

1. **`search_query`****&#x20;(선택)**

| 항목  | 내용                                 |
| --- | ---------------------------------- |
| 타입  | string \| null                     |
| 기본값 | null                               |
| 설명  | 제목, 본문에서 키워드 검색                    |
| 특징  | 대소문자 무시 (Claude = claude = CLAUDE) |

1. **`content_type_filter`****&#x20;(선택)**

| 항목  | 내용                                                                                    |
| --- | ------------------------------------------------------------------------------------- |
| 타입  | string \| null &#xA;- 'skill' \| 'mcp' \| 'prompt' \| 'ai\_tool' \| 'post' \| 'news'  |
| 기본값 | null (전체 타입)                                                                          |
| 설명  | 콘텐츠 타입별 필터링                                                                           |

1. **`tag_ids`****&#x20;(선택)&#x20;**

| 항목  | 내용                   |
| --- | -------------------- |
| 타입  | number\[] \| null    |
| 기본값 | null (태그 필터 없음)      |
| 설명  | 특정 태그가 포함된 콘텐츠 필터링   |
| 특징  | OR 조건 (하나라도 포함되면 매칭) |

1. **`sort_by`****&#x20;(선택)&#x20;**

| 항목  | 내용                                                                          |
| --- | --------------------------------------------------------------------------- |
| 타입  | string&#xA;- 'latest' \| 'popular' (upvote\_count) \| 'views' (view\_count) |
| 기본값 | 'latest'                                                                    |
| 설명  | 정렬 기준                                                                       |

1. **`page_number`****&#x20;(선택)**

| 항목  | 내용                 |
| --- | ------------------ |
| 타입  | number             |
| 기본값 | 1                  |
| 설명  | 현재 페이지 번호 (1부터 시작) |

1. **`page_size`****&#x20;(선택)**

| 항목  | 내용           |
| --- | ------------ |
| 타입  | number       |
| 기본값 | 20           |
| 설명  | 한 페이지당 아이템 수 |

**반환 데이터**

```typescript
interface SearchResult {
  id: string                    // UUID
  title: string                 // 제목
  body: string                  // 본문
  type: string                  // skill, mcp, prompt, ai_tool, post, news
  author_id: string             // 작성자 UUID
  author_nickname: string       // 작성자 닉네임
  author_avatar: string | null  // 작성자 아바타 URL
  content_status: string        // published, pending, rejected
  view_count: number            // 조회수
  upvote_count: number          // 추천수
  downvote_count: number        // 비추천수
  created_at: string            // 생성일시
  tags: Array<{id: number, name: string}>  // 태그 목록
}
```

