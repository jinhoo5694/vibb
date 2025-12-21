# toggle\_bookmark

**프론트엔드 사용**

```typescript
const handleBookmark = async (contentId: string) => {
  const { data, error } = await supabase.rpc('toggle_bookmark', {
    target_content_id: contentId
  })

  if (!error && data) {
    if (data.action === 'added') {
      toast.success('북마크에 추가했습니다!')
    } else if (data.action === 'removed') {
      toast.info('북마크에서 제거했습니다.')
    }
  }
}
```

**파라미터 상세**

**`target_content_id`****&#x20;(필수)**

| 항목 | 내용              |
| -- | --------------- |
| 타입 | `string` (UUID) |
| 설명 | 북마크할 콘텐츠 ID     |

**반환 데이터**

```typescript
interface ToggleBookmarkResult {
  action: 'added' | 'removed'
}
```

| action      | 의미      |
| ----------- | ------- |
| `'added'`   | 북마크 추가됨 |
| `'removed'` | 북마크 제거됨 |

