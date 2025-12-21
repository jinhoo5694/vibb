# Supabase Backend Guide

## 1. 프론트엔드 DB 접근 가이드

### 1.1 profiles vs public\_profiles

| **테이블/View**          | **용도**     | **접근 가능 컬럼**                                      |
| --------------------- | ---------- | ------------------------------------------------- |
| **`profiles`**        | 내 정보 조회/수정 | 전체 (email, deletion\_\* 포함)                       |
| **`public_profiles`** | 다른 사용자 조회  | id, nickname, avatar\_url, role, bio, created\_at |

### 1.2 profiles.role ENUM 정의

| **role**         | **설명**  |
| ---------------- | ------- |
| **`user`**       | 일반 사용자  |
| **`admin`**      | 관리자     |
| **`withdrawal`** | 탈퇴한 사용자 |

### 1.3 로그인/인증정보

```typescript
// 현재 로그인한 유저 정보 (auth.users에서)
const { data: { user } } = await supabase.auth.getUser();

console.log(user.id);                          // UUID (= profiles.id)
console.log(user.email);                       // 이메일
console.log(user.user_metadata.name);          // Google/GitHub에서 받은 이름
console.log(user.user_metadata.avatar_url);    // 프로필 사진 URL
```

### 1.4 내 프로필 조회/수정

```typescript
// 내 프로필 전체 조회
const { data: myProfile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

// 결과: email, deletion_requested_at 등 민감 정보 포함 ✅

// 내 프로필 수정
const { error } = await supabase
  .from('profiles')
  .update({ 
    nickname: '새 닉네임',
    bio: '자기소개'
  })
  .eq('id', user.id);
```

### 1.5 다른 사용자 프로필 조회

```typescript
// 다른 사용자 프로필 조회 (민감정보 제외)
const { data: otherUser } = await supabase
  .from('public_profiles')
  .select('*')
  .eq('id', otherUserId)
  .single();

// 결과
{
  id: 'uuid',
  nickname: '유저B',         // ✅ (탈퇴 시: deleted_abc123)
  avatar_url: 'https://...', // ✅ (탈퇴 시: null)
  role: 'user',              // ✅ (탈퇴 시: 'withdrawal')
  bio: '소개글',              // ✅ (탈퇴 시: null)
  created_at: '...'          // ✅
  // email ❌ (없음)
  // deletion_* ❌ (없음)
}
```

### 1.6 RLS 정책 요약

| **테이블**                      | **SELECT**      | **INSERT** | **UPDATE** | **DELETE** |
| ---------------------------- | --------------- | ---------- | ---------- | ---------- |
| **`profiles`**               | 본인만             | 트리거로 자동    | 본인만        | ❌          |
| **`public_profiles (View)`** | 누구나             | -          | -          | -          |
| **`contents`**               | 누구나 (published) | 로그인 유저     | 본인만        | 본인만        |
| **`reviews`**                | 누구나             | 로그인 유저     | 본인만        | 본인만        |
| **`review_replies`**         | 누구나             | 로그인 유저     | 본인만        | 본인만        |
| **`content_votes`**          | 본인만             | 로그인 유저     | 본인만        | 본인만        |
| **`bookmarks`**              | 본인만             | 로그인 유저     | -          | 본인만        |

## 2. 회원 탈퇴 시스템

### 2.1 탈퇴 방식: Soft Delete (role = 'withdrawal')

```
┌─────────────────────────────────────────────────────────────────┐
│  회원 탈퇴 시                                                    │
├─────────────────────────────────────────────────────────────────┤
│  auth.users        →  삭제됨 (로그인 불가)                        │
│  profiles.id       →  유지 ✅ (FK 연결 유지)                      │
│  profiles.role     →  'withdrawal' ✅ (탈퇴 식별)                │
│  profiles.nickname →  랜덤 변경 (deleted_abc123)                 │
│  profiles.email    →  NULL                                      │
│  profiles.avatar   →  NULL                                      │
│  profiles.bio      →  NULL                                      │
│                                                                 │
│  contents          →  유지 ✅ (author_id 그대로)                  │
│  reviews           →  유지 ✅ (user_id 그대로)                    │
│  review_replies    →  유지 ✅ (user_id 그대로)                    │
│  bookmarks         →  삭제                                       │
│  content_votes     →  삭제                                       │
│  profile_interests →  삭제                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 탈퇴 흐름 (7일 유예)

```
사용자가 탈퇴 요청
    ↓
RPC: request_account_deletion() 호출
    ↓
Trigger: deletion_scheduled_at = 7일 후 자동 설정
    ↓
(7일 유예 기간 - 취소 가능)
    ↓
pg_cron: 매일 자정에 체크
    ↓
Edge Function: delete-account 호출
    ↓
완료: auth 삭제 + profiles soft delete (role = 'withdrawal')
```

## 3. Functions

| Functions                                                                                                                 | Category | Descriptions              | Type           | isCompleted | TestCompleted |
| ------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------- | -------------- | ----------- | ------------- |
| [send-report](https://app.affine.pro/workspace/073d78cd-44b1-4c70-8177-b431aa869352/-gw96tNd7-cb1uq7gja2D)                | 신고/문의    | 슬랙 알림 + 이메일 발송            | Edge functions | True        | False         |
| [send-inquiry](https://app.affine.pro/workspace/073d78cd-44b1-4c70-8177-b431aa869352/sldFn04KuT3VFEEV13rNA)               | 신고/문의    | 문의사항 슬랙/이메일 발송            | Edge functions | True        | False         |
| [delete-account](https://app.affine.pro/workspace/073d78cd-44b1-4c70-8177-b431aa869352/0QBeRmbcV7rtFk6BEPoWs)             | 계정 관리    | 계정 탈퇴 처리 (Soft Delete)    | Edge functions | True        | False         |
| [cancel\_account\_deletion](https://app.affine.pro/workspace/073d78cd-44b1-4c70-8177-b431aa869352/5H1VRW1nc_F-TN4h7v-do)  | 계정 관리    | 계정 탈퇴 취소                  | RPC            | True        | False         |
| [approve-content](https://app.affine.pro/workspace/073d78cd-44b1-4c70-8177-b431aa869352/suVQ_8dN6xXTqfauyuQ5N)            | 콘텐츠      | 콘텐츠 승인/거절 (admin)         | RPC            | True        | False         |
| [request\_account\_deletion](https://app.affine.pro/workspace/073d78cd-44b1-4c70-8177-b431aa869352/5gUMZ2-q7AzsMZG4I3mHK) | 계정 관리    | 탈퇴 요청 처리 (7일 유예)          | RPC            | True        | False         |
| handle\_new\_user                                                                                                         | 계정 관리    | 회원가입 시 프로필 자동 생성          | Trigger        | True        |               |
| set\_content\_status\_by\_type                                                                                            | 콘텐츠      | post/news 자동 published 처리 | Trigger        | True        |               |
| set\_deletion\_scheduled\_at                                                                                              | 계정 관리    | 탈퇴 예정일 자동 설정              | Trigger        | True        |               |
| update\_vote\_counts                                                                                                      | 콘텐츠      | 추천/비추천 수 자동 업데이트          | Trigger        | True        |               |
| delete-expired-accounts                                                                                                   | 계정 관리    | 매일 자정 만료 계정 자동 삭제         | pg\_cron       | True        |               |
| [search\_contents](https://app.affine.pro/workspace/073d78cd-44b1-4c70-8177-b431aa869352/U2CY9-un9CFikoTxrqGv2)           | 콘텐츠      | 통합 검색 (키워드/타입/태그/정렬)      | RPC            | True        |               |
| [toggle\_vote](https://app.affine.pro/workspace/073d78cd-44b1-4c70-8177-b431aa869352/RHOeEDTt5UZp1y4IiXjiv)               | 콘텐츠      | 콘텐츠 추천/비추천 토글             | RPC            | True        |               |
| [toggle\_bookmark](https://app.affine.pro/workspace/073d78cd-44b1-4c70-8177-b431aa869352/GCtLvZ1jtOWf36uBwPO5k)           | 콘텐츠      | 북마크 추가/제거 토글              | RPC            | True        |               |
| [get\_my\_contents](https://app.affine.pro/workspace/073d78cd-44b1-4c70-8177-b431aa869352/jz0QKHQ9XoHAj9UynxPjk)          | 마이페이지    | 내가 작성한 콘텐츠 목록             | RPC            | True        |               |
| [get\_my\_bookmarks](https://app.affine.pro/workspace/073d78cd-44b1-4c70-8177-b431aa869352/s01rdg8Rn0KaVA2bv8HQm)         | 마이페이지    | 내가 북마크한 콘텐츠 목록            | RPC            | True        |               |
| update\_review\_likes\_count                                                                                              | 리뷰       | 리뷰 좋아요 수 자동 업데이트          | Trigger        | True        |               |
| [toggle\_review\_like](https://app.affine.pro/workspace/073d78cd-44b1-4c70-8177-b431aa869352/2LDCi-N4RTxbr3QxFSoLT)       | 리뷰       | 리뷰 좋아요 토글                 | RPC            | True        |               |

