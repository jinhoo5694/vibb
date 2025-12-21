# get\_my\_contents

**프론트엔드 사용**

```typescript
// 전체 내 콘텐츠 가져오기
const { data } = await supabase.rpc('get_my_contents', {})

// 내 MCP만 가져오기
const { data } = await supabase.rpc('get_my_contents', {
  content_type_filter: 'mcp'
})

// 승인 대기 중인 콘텐츠
const { data } = await supabase.rpc('get_my_contents', {
  status_filter: 'pending'
})

// 인기순 정렬
const { data } = await supabase.rpc('get_my_contents', {
  sort_by: 'popular'
})

// 복합 필터
const { data } = await supabase.rpc('get_my_contents', {
  content_type_filter: 'skill',
  status_filter: 'published',
  sort_by: 'views',
  page_number: 1,
  page_size: 10
})
```

**파라미터 상세**

1. `content_type_filter` (선택)

| 항목  | 내용                                                                |
| --- | ----------------------------------------------------------------- |
| 타입  | `string \| null`                                                  |
| 값   | '`skill`' , '`mcp`' , '`prompt`','`ai_tool`' ,'`post`' ,'`news`'  |
| 기본값 | `null` (전체 타입)                                                    |
| 설명  | 콘텐츠 타입별 필터링                                                       |

1. `status_filter` (선택)

| 항목  | 내용                                                              |
| --- | --------------------------------------------------------------- |
| 타입  | `string \| null`                                                |
| 값   | '`draft`', '`pending`', '`published`', '`hidden`', '`reported`' |
| 기본값 | `null` (전체 타입)                                                  |
| 설명  | 콘텐츠 타입별 필터링                                                     |

1. `sort_by` (선택)

| 항목  | 내용                                             |
| --- | ---------------------------------------------- |
| 타입  | `string`                                       |
| 값   | `'latest'`, `'oldest'`, `'popular'`, `'views'` |
| 기본값 | `'latest'`                                     |
| 설명  | 정렬 기준                                          |

1. `page_number` (선택)

| 항목  | 내용              |
| --- | --------------- |
| 타입  | `number`        |
| 기본값 | 1               |
| 설명  | 페이지 번호 (1부터 시작) |

1. `page_size` (선택)

| 항목  | 내용        |
| --- | --------- |
| 타입  | `number`  |
| 기본값 | 20        |
| 설명  | 페이지당 항목 수 |

**반환값**

```typescript
interface ContentItem {
  id: string
  title: string
  body: string
  type: 'skill' | 'mcp' | 'prompt' | 'ai_tool' | 'post' | 'news'
  status: 'draft' | 'pending' | 'published' | 'hidden' | 'reported'
  view_count: number
  upvote_count: number
  downvote_count: number
  created_at: string
  updated_at: string
  tags: Array<{ id: string; name: string }>
}
```

