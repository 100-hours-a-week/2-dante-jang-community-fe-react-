# 커뮤니티 FE

## 개요
이 프로젝트는 간단한 커뮤니티 웹을 구현한 것입니다.  
React를 기반으로 작성되었으며, 게시글 작성 및 열람을 주요 기능으로 제공합니다.

## Page 설명

### Main Page
메인 페이지에서는 모든 사용자의 게시글이 최근 작성일 기준으로 무한 스크롤 형태로 제공됩니다.  
`'/'` 경로를 통해 접근할 수 있습니다.

---

### SignUp Page
회원가입 페이지로, 사용자는 다음 입력값을 통해 회원가입할 수 있습니다:
- 이름 (고유값)
- 이메일 (고유값)
- 비밀번호  
- 비밀번호 확인  

`'/sign-up'` 경로를 통해 접근할 수 있습니다.

---

### Login Page
로그인 기능을 제공하는 페이지입니다.  
사용자는 이메일과 비밀번호를 입력하여 로그인을 진행할 수 있습니다.  
`'/login'` 경로를 통해 접근할 수 있습니다.

---

### User Page
특정 사용자의 정보를 조회할 수 있는 페이지입니다.  
유저 이름을 경로로 포함하여 접근하며, 사용자의 게시글 목록이 표시됩니다.  
`'/${userName}'` 경로를 통해 접근할 수 있습니다.

---

### Setting Page
사용자 설정을 변경할 수 있는 페이지입니다.  
사용자는 프로필 이미지 변경, 닉네임 변경 등의 기능을 이용할 수 있습니다.  
또한 사용자 탈퇴를 수행 할 수 있습니다.  
`'/setting'` 경로를 통해 접근할 수 있습니다.

---

### Post Detail Page
게시글의 상세 내용을 열람할 수 있는 페이지입니다.  
게시글의 좋아요, 조회수, 댓글을 확인 할 수 있습니다.  
게시글 제목과 작성자, 고유 ID를 포함한 경로로 접근합니다.  
본인의 게시글일 경우 수정 및 삭제가 가능합니다.  
`'/${userName}/${postTitle}/${postId}'` 경로를 통해 접근할 수 있습니다.

---

### Write Post Page
새로운 게시글을 작성할 수 있는 페이지입니다.  
`'/write-post'` 경로를 통해 접근할 수 있습니다.

---

### Modify Post Page
기존 게시글을 수정할 수 있는 페이지입니다.  
게시글의 고유 ID를 포함한 경로로 접근합니다.  
`'/modify-post/${postId}'` 경로를 통해 접근할 수 있습니다.

---

### Error Page
예기치 못한 오류 발생 시 표시되는 페이지입니다.  
사용자는 `'/error'` 경로를 통해 접근할 수 있습니다.

---

## Paths

| **Page**               | **Path**                                    |
|-------------------------|---------------------------------------------|
| Main Page              | `'/'`                                       |
| SignUp Page            | `'/sign-up'`                                |
| Login Page             | `'/login'`                                  |
| User Page              | `/${userName}`                              |
| Setting Page           | `'/setting'`                                |
| Post Detail Page       | `/${userName}/${postTitle}/${postId}`        |
| Write Post Page        | `'/write-post'`                             |
| Modify Post Page       | `'/modify-post/${postId}'`                  |
| Error Page             | `'/error'`                                  |

위와 같이 각 페이지는 고유한 경로를 통해 접근할 수 있습니다.