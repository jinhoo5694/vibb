# approve-content

**프론트엔드 사용**

알림은 rpc를 호출하면 자동으로 추가됨.

```typescript
// 프론트엔드 (Admin)
const approveContent = async (contentId: string) => {
  const { error } = await supabase.rpc('approve_content', {
    content_id: contentId,
    action: 'approve'
  });
  
  if (!error) {
    toast.success('콘텐츠가 승인되었습니다.');
  }
};

const rejectContent = async (contentId: string, reason: string) => {
  // reason is required
  if (!reason.trim()) {
    toast.error('거절 사유를 입력해주세요.');
    return;
  }

  const { error } = await supabase.rpc('approve_content', {
    content_id: contentId,
    action: 'reject',
    reject_reason: reason.trim()
  });

  if (!error) {
    toast.success('콘텐츠가 거절되었습니다.');
  }
};
```

