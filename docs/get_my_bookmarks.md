# get\_my\_bookmarks

**프론트엔드 사용**

```typescript
// 전체 북마크 가져오기
const { data } = await supabase.rpc('get_my_bookmarks', {})

// MCP만 가져오기
const { data } = await supabase.rpc('get_my_bookmarks', {
  type_filter: 'mcp'
})

// 오래된 북마크순 정렬
const { data } = await supabase.rpc('get_my_bookmarks', {
  sort_by: 'oldest'
})

// 복합 필터 + 페이지네이션
const { data } = await supabase.rpc('get_my_bookmarks', {
  type_filter: 'skill',
  sort_by: 'popular',
  page_number: 2,
  page_size: 10
})
```

**파라미터 상세**

1. `type_filter` (선택)

| 항목  | 내용                                                                |
| --- | ----------------------------------------------------------------- |
| 타입  | `string \| null`                                                  |
| 값   | '`skill`' , '`mcp`' , '`prompt`','`ai_tool`' ,'`post`' ,'`news`'  |
| 기본값 | `null` (전체 타입)                                                    |
| 설명  | 콘텐츠 타입별 필터링                                                       |

1. `sort_by` (선택)

| 항목  | 내용                                             |
| --- | ---------------------------------------------- |
| 타입  | `string`                                       |
| 값   | `'latest'`, `'oldest'`, `'popular'`, `'views'` |
| 기본값 | `'latest'`                                     |
| 설명  | 정렬 기준 (`latest`/`oldest`는 북마크 추가일 기준)          |

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
interface BookmarkedContent {
  id: string
  title: string
  body: string
  type: 'skill' | 'mcp' | 'prompt' | 'ai_tool' | 'post' | 'news'
  status: 'draft' | 'pending' | 'published' | 'hidden' | 'reported'
  view_count: number
  upvote_count: number
  downvote_count: number
  created_at: string      // 콘텐츠 생성일
  updated_at: string      // 콘텐츠 수정일
  bookmarked_at: string   // 북마크 추가일
  tags: Array<{ id: string; name: string }>
  author: {
    id: string
    nickname: string
    avatar_url: string | null
  }
}
```

