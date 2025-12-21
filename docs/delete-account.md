# delete-account

**용도**: 회원 탈퇴 처리 (Soft Delete + auth.users 삭제)

**Request**

```typescript
// POST /functions/v1/delete-account
{
  "user_id": "uuid"  // 탈퇴 처리할 사용자 ID (필수)
}
```

**Response**

```typescript
// 성공
{ "success": true }

// 실패
{ "success": false, "error": "user_id is required" }
{ "success": false, "error": "Profile update failed: ..." }
{ "success": false, "error": "Auth delete failed: ..." }
```

**TODO**

1. edge functions 작성 후 배포
2. pg\_cron + http 확장 활성화

   `CREATE EXTENSION IFNOTEXISTS pg_cron;`

   `CREATE EXTENSION IFNOTEXISTS http;`
3. &#x20;pg\_cron 스케줄 등록

```sql
-- 만료 계정 처리 함수
CREATE OR REPLACE FUNCTION trigger_delete_expired_accounts()
RETURNS void AS $$
DECLARE
  expired_user RECORD;
BEGIN
  FOR expired_user IN
    SELECT id FROM profiles
    WHERE deletion_scheduled_at IS NOT NULL
      AND deletion_scheduled_at < NOW()
      AND role != 'withdrawal'
  LOOP
    -- Edge Function 호출
    PERFORM http_post(
      'https://{YOUR_PROJECT_REF}.supabase.co/functions/v1/delete-account',
      json_build_object('user_id', expired_user.id)::text,
      'application/json'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cron Job 등록 (매일 한국시간 자정 = UTC 15:00)
SELECT cron.schedule(
  'delete-expired-accounts',
  '0 15 * * *',
  'SELECT trigger_delete_expired_accounts();'
);
```

확인:

`SELECT*FROM cron.job;`

