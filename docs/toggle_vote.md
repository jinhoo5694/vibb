# toggle\_vote

**프론트엔드 사용**

```typescript
const handleUpvote = async (contentId: string) => {
  const { data, error } = await supabase.rpc('toggle_vote', {
    target_content_id: contentId,
    vote: 'upvote'
  })

  if (!error && data) {
    if (data.action === 'added') {
      toast.success('추천했습니다!')
    } else if (data.action === 'removed') {
      toast.info('추천을 취소했습니다.')
    } else if (data.action === 'changed') {
      toast.success('추천으로 변경했습니다!')
    }
  }
}
```

**파라미터 상세**

1. **`target_content_id`****&#x20;(필수)**

| 항목 | 내용              |
| -- | --------------- |
| 타입 | `string` (UUID) |
| 설명 | 투표할 콘텐츠 ID      |

1. **`vote`****&#x20;(필수)**

| 항목 | 내용                         |
| -- | -------------------------- |
| 타입 | `'upvote'` \| `'downvote'` |
| 설명 | 투표 유형                      |

**반환 데이터**

```typescript
interface ToggleVoteResult {
  action: 'added' | 'removed' | 'changed'
  vote: 'upvote' | 'downvote'
}
```

| action      | 의미           |
| ----------- | ------------ |
| `'added'`   | 새로 투표함       |
| `'removed'` | 기존 투표 취소함    |
| `'changed'` | 추천 ↔ 비추천 변경함 |

