# request\_account\_deletion

**프론트엔드 사용**

```typescript
// 탈퇴 요청 버튼 핸들러
const handleDeleteRequest = async () => {  // ← async 필수!
  try {
    const { error } = await supabase.rpc('request_account_deletion');
    
    if (error) {
      alert('탈퇴 요청 실패: ' + error.message);
      return;
    }
    
    alert('7일 후에 계정이 삭제됩니다.');
    
  } catch (e) {
    alert('오류가 발생했습니다.');
  }
};
```

