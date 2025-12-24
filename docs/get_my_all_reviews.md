# get\_my\_all\_reviews

**프론트엔드 사용**

```typescript
// 전체 내 댓글 가져오기
const { data } = await supabase.rpc('get_my_all_reviews', {})

// 오래된순 정렬
const { data } = await supabase.rpc('get_my_all_reviews', {
  sort_by: 'oldest'
})

// 페이지네이션
const { data } = await supabase.rpc('get_my_all_reviews', {
  sort_by: 'latest',
  page_number: 2,
  page_size: 10
})
```

**파라미터 상세**

`sort_by` (선택)

| **항목**  | **내용**                 |
| ------- | ---------------------- |
| **타입**  | `string`               |
| **값**   | `'latest'`, `'oldest'` |
| **기본값** | `'latest'`             |
| **설명**  | 정렬 기준 (작성일 기준)         |

`page_number` (선택)

| **항목** | **내용**          |
| ------ | --------------- |
| **타입** | `number`        |
| **값**  | `1`             |
| **설명** | 페이지 번호 (1부터 시작) |

`page_size` (선택)

| **항목** | **내용**    |
| ------ | --------- |
| **타입** | `number`  |
| **값**  | `20`      |
| **설명** | 페이지당 항목 수 |

**반환 데이터**

```typescript
interface MyReviewItem {
  id: string
  type: 'review' | 'reply'
  content: string
  rating: number | null        // 리뷰만 해당, 대댓글은 null
  created_at: string
  parent_content: {
    id: string
    title: string
    type: 'skill' | 'mcp' | 'prompt' | 'ai_tool' | 'post' | 'news'
  }
  parent_review: {             // 대댓글만 해당, 리뷰는 null
    id: string
    content: string            // 원본 리뷰 내용 (50자 미리보기)
  } | null
}
```

| **항목**           | **내용**           | **설명**                  |
| ---------------- | ---------------- | ----------------------- |
| `id`             | `UUID`           | 리뷰/대댓글 ID               |
| `type`           | `string`         | `'review'` 또는 '`reply'` |
| `content`        | `string`         | 작성한 내용                  |
| `rating`         | `int \| null`    | 별점 (리뷰만 해당)             |
| `created_at`     | `timestamp`      | 작성일                     |
| `parent_content` | `object`         | 원본 게시글 정보               |
| `parent_review`  | `object \| null` | 원본 리뷰 정보 (대댓글만 해당)      |

