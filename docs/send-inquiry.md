# send-inquiry

**용도**: 문의사항 (버그, 기능 제안, 비즈니스 등) 발송

**Request**

```typescript
// POST /functions/v1/send-inquiry
{
  "type": "bug_report" | "feature_request" | "business" | "account_issue",
  "email": "user@example.com", // 답변 받을 이메일
  "title": "제목",
  "description": "상세 내용",
  "attachments": ["url1", "url2"], // 스크린샷 등 (선택)
  "user_id": "uuid" // 로그인 시 (선택)
}
```

**Response**

```typescript
{ "success": true, "message": "문의가 접수되었습니다." }
```

**슬랙 메시지 예시**

```
📩 새로운 문의

- 유형: 버그 리포트
- 제목: 로그인 버튼이 작동하지 않아요
- 이메일: user@example.com
- 첨부파일: 2개
```

