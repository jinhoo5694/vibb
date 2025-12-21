# toggle\_review\_like

**프론트엔드 사용**

```typescript
const handleLike = async (reviewId: string) => {
  const { data, error } = await supabase.rpc('toggle_review_like', {
    target_review_id: reviewId
  })

  if (!error && data) {
    if (data.action === 'liked') {
      toast.success('좋아요!')
    } else if (data.action === 'unliked') {
      toast.info('좋아요 취소')
    }
  }
}
```

**파라미터 상세**

**`target_review_id`****&#x20;(필수)**

| 항목 | 내용              |
| -- | --------------- |
| 타입 | `string` (UUID) |
| 설명 | 좋아요할 리뷰 ID      |

**반환 데이터**

```typescript
interface ToggleReviewLikeResult {
  action: 'liked' | 'unliked'
}
```

| action      | 의미      |
| ----------- | ------- |
| `'liked'`   | 좋아요 추가됨 |
| `'unliked'` | 좋아요 취소됨 |

