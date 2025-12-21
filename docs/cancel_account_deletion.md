# cancel\_account\_deletion

**프론트엔드 사용**

```typescript
// 탈퇴 취소 버튼 핸들러
const handleCancelDelete = async () => {
  try {
    const { error } = await supabase.rpc('cancel_account_deletion');
    
    if (error) {
      alert('취소 실패: ' + error.message);
      return;
    }
    
    alert('탈퇴가 취소되었습니다.');
    
  } catch (e) {
    alert('오류가 발생했습니다.');
  }
};
```

