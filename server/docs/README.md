# API Documentation

## baseURL
```https://localhost:8080```

# Error Codes
- 400: Bad Request – 유효하지 않은 요청 OR 파라미터 안넣음.
- 401: Unauthorized – 유저인증에 실패함
- 404: Not Found – 찾을수 없음
- 500: Internal Server Error – 서버에러(문의)

# EndPoint


---

## Login/SingnUp

### login

- **Method**: `GET`
- **Endpoint**: `/login`
- **Description**: 로그인 요청 엔드포인트


#### Request:
```json
{}
```
없음

#### Response (Success):

```json
{}
```
없음
(구글 OAuth로 리다이엑션됨)

#### Response (Error):
```json
{}
```

### signup

- **Method**: `GET`
- **Endpoint**: `/signup`
- **Description**: 회원가입 요청 엔드포인트


#### Request:
```json
{}
```
없음

#### Response (Success):

```json
{}
```
없음
(구글 OAuth로 리다이엑션됨)

#### Response (Error):
```json
{}
```

### login-redirect

- **Method**: `GET`
- **Endpoint**: `/auth/google/login/redirect`
- **Description**: 로그인 처리 리다이엑션 엔드포인트


#### Request:
| Parameter   | Type     | Description              |
|-------------|----------|--------------------------|
| `code`  | `string` | 구글로그인할때 받은 코드 |

```json
{"code":"~~~"}
```


#### Response (Success):

```json
{   "code":200,
    "message":"Token created",
    "token":"jwt token..."
}
```


#### Response (Error):
```json
{
    "code":400,
    "error":"Authorization code is missing"
}
{
    "code": 404, 
    "message": "User not found"
}
{
    "code":500,
    "message":"server error"
}
```

### signup-redirect

- **Method**: `GET`
- **Endpoint**: `/auth/google/signup/redirect`
- **Description**: 회원가입 처리 리다이엑션 엔드포인트


#### Request:
| Parameter   | Type     | Description              |
|-------------|----------|--------------------------|
| `code`  | `string` | 구글회원가입할때 받은 코드 |

```json
{"code":"~~~"}
```


#### Response (Success):

```json
{   "code":200,
    "message":"ok",
    "id":"id(고유)",
    "email":"email@gmail.com"
}
```


#### Response (Error):
```json
{
    "code":400,
    "error":"Authorization code is missing"
}
{
    "code": 400, 
    "message": "You cannot sign up again for ${ded} days."
}
{
    "code":409,
    "message":"User already exists"
}
{
    "code":500,
    "message":"server error"
}
```

## PROFILE

- **Method**: `GET`
- **Endpoint**: `/profile`
- **Description**: 유저 정보 보내줌. 헤더에 JWT토큰 필수

### Request:
```json
"headers": {"Authorization": "Bearer {token}",}
{
}
```

### Response (Success):
| value   | Type     | Description              |
|-------------|----------|--------------------------|
| `id`  | `string` | 유저 고유id |
| `email` | `string` | 유저 email |
| `nickname` | `string` | 닉네임 |
| `school` | `string` OR `null` | 유저 소속 학교명 |
| `grade` | `number` OR `null` | 유저 소속 학년 |
| `classroom` | `number` OR `null` | 유저 소속 반 |


```json
{
  "code":200,
  "data":{"id": "id",
  "email":"email@gmail.com",
  "nickname":"admin",
  "school" : "school name" | null,
  "grade" : 2 | null,
  "classroom" : 4 | null}
}
```

### Response (Error):
```json
{
    "code":401,
    "message":"Unauthorized"
}
{
    "code":500,
    "message":"server error"
}
```

## SIGNUP-SETTING

- **Method**: `POST`
- **Endpoint**: `/user_data/signup_setting`
- **Description**: 유저 회원가입할때 유저정보를 추가 및 저장

### Request:
| Parameter   | Type     | Description              |
|-------------|----------|--------------------------|
| `id`  | `string` | 유저 고유id |
| `email` | `string` | 유저 email |
| `nickname` | `string` | 닉네임 |
| `school` | `string` OR `null` | 유저 소속 학교명 |
| `grade` | `number` OR `null` | 유저 소속 학년 |
| `classroom` | `number` OR `null` | 유저 소속 반 |
| `SHcode` | `string` OR `null` | 유저 학교 행정 처리 코드 |

```json
{
  "Gid": "Gid",
  "email": "email@gmail.com",
  "nickname":"nickname",
  "school":"school name" | null,
  "grade" : 2 | null,
  "classroom" : 4 | null,
  "SHcode": "shcode" | null
}
```

### Response (Success):

```json
{
    "code":200,
    "message":"success!"
}
```

### Response (Error):
```json
{
    "code":400,
    "message":"All fields are required"
}
{
    "code":500,
    "message":"server error"
}
```

## PROFILE-UPDATE

- **Method**: `PUT`
- **Endpoint**: `/user_data/profile_update`
- **Description**: 유저 회원정보 업데이트 및 저장
- **important** : JWT토큰 필요
### Request:
| Parameter   | Type     | Description              |
|-------------|----------|--------------------------|
| `nickname` | `string` | 닉네임 |
| `school` | `string` OR `null` | 유저 소속 학교명 |
| `grade` | `number` OR `null` | 유저 소속 학년 |
| `classroom` | `number` OR `null` | 유저 소속 반 |
| `SHcode` | `string` OR `null` | 유저 학교 행정 처리 코드 |

```json
"headers": {"Authorization": "Bearer {token}"},
{
  "Gid": "Gid",
  "email": "email@gmail.com",
  "nickname":"nickname",
  "school":"school name" | null,
  "grade" : 2 | null,
  "classroom" : 4 | null,
  "SHcode": "shcode" | null
}
```

### Response (Success):

```json
{
    "code":200,
    "message":"update success!"
}
```

### Response (Error):
```json
{
    "code":400,
    "message":"nickname required"
}
{
    "code":400,
    "message":"Nickname already taken."
}
{
    "code":500,
    "message":"server error"
}
```



## DELETE-ACCOUNT
- **Method**: `DELETE`
- **Endpoint**: `/user_data/delete_account`
- **Description**: 계정 탈퇴
- **important** : JWT토큰 필요

### Request:
```json
"headers": {"Authorization": "Bearer {token}"}
```

### Response (Success):
```json
{
  "code":200,
  "message": "Account successfully deleted. You cannot sign up again for 30 days."
}
```

### Response (Error):
```json
{
    "code":400,
    "message":"User ID is required"
}
{
    "code":500,
    "message":"server error"
}
```

## AUTH-USER
- **Method**: `GET`
- **Endpoint**: `/user_data/auth/user`
- **Description**: JWT->id
- **important** : JWT토큰 필요

### Request:
```json
"headers": {"Authorization": "Bearer {token}"}
```

### Response (Success):
| value   | Type     | Description              |
|-------------|----------|--------------------------|
| `id`  | `string` | authid |
```json
{
  "code":200,
  "message": "success",
  "id":"authid"

}
```

### Response (Error):
```json
{
    "code":400,
    "message":"Gid is not provide"
}
{
    "code":500,
    "message":"server error"
}
```

## SEARCH-SCHOOL
- **Method**: `GET`
- **Endpoint**: `/api/searchSchool`
- **Description**: 학교검색후 정보들을 반환

### Request:
| Parameter   | Type     | Description              |
|-------------|----------|--------------------------|
| `SchoolName` | `string` | 학교명 |
```json
{
    "SchoolName":"SchoolName"
}
```

### Response (Success):
| value   | Type     | Description              |
|-------------|----------|--------------------------|
| `data`  | `SchoolInfo[]` | 학교정보들을 담은 리스트. types/폴더 참고 |
```json
{
  "code":200,
  "message": "success",
  "data":SchoolInfo[]

}
```

### Response (Error):
```json
{
    "code":400,
    "message":"SchoolName missing"
}
{
    "code":500,
    "message":"server error"
}
```

## SEARCH-MEAL
- **Method**: `GET`
- **Endpoint**: `/api/searchMeal`
- **Description**: 유저의 학교정보를 바탕으로 급식 (1달치)를 반환
- **important** : 유저정보를 바탕으로 하기 떄문에 JWT토큰 필요

### Request:
| Parameter   | Type     | Description              |
|-------------|----------|--------------------------|
| `month` | `string` | 검색할 달 |
```json
"headers": {"Authorization": "Bearer {token}"},
{
    "month":"11"
}
```

### Response (Success):
| value   | Type     | Description              |
|-------------|----------|--------------------------|
| `data`  | `MealInfo[]`OR `null` | 학교급식들을 담은 리스트. types/폴더 참고, 해당 달에 급식이 없으면 빈리스트 OR null|
```json
{
  "code":200,
  "message": "success",
  "data":MealInfo[]

}
```

### Response (Error):
```json
{
    "code":400,
    "message":"E"
}
{
    "code":404,
    "message":"school not found. pls update your school"
}
{
    "code":500,
    "message":"server error"
}
```

## SEARCH-TIMETABLE
- **Method**: `GET`
- **Endpoint**: `/api/searchTimeTable`
- **Description**: 유저의 학교정보를 바탕으로 시간표를 반환
- **important** : 유저정보를 바탕으로 하기 떄문에 JWT토큰 필요

### Request:
| Parameter   | Type     | Description              |
|-------------|----------|--------------------------|
| `date` | `string` | 검색할 달 (yyyy-mm-dd형식) |
```json
"headers": {"Authorization": "Bearer {token}"},
{
    "date":"2024-11-1"
}
```

### Response (Success):
| value   | Type     | Description              |
|-------------|----------|--------------------------|
| `data`  | `TimetableInfo[]` | 시간표를 담은 리스트. types/폴더 참고|
```json
{
  "code":200,
  "message": "success",
  "data":TimetableInfo[]

}
```

### Response (Error):
```json
{
    "code":400,
    "message":"E"
}
{
    "code":404,
    "message":"school not found. pls update your school"
}
{
    "code":500,
    "message":"server error"
}
```

## Image-Upload

- **Method**: `POST`
- **Endpoint**: `/post_data/image_upload`
- **Description**: 이미지 파일 업로드.
- **important** : JWT토큰 필요

### Request:

| Parameter | Type     | Description                               |
|-----------|----------|-------------------------------------------|
| `image`   | `file`   | The image file to be uploaded (single file). |

#### Example 
```javascript
import axios from 'axios';

// Example function to upload an image
async function uploadImage(token, imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await axios.post('/image_upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Image uploaded:', response.data);
  } catch (error) {
    console.error('Image upload failed:', error.response.data);
  }
}
```

### Response (Success):
| value   | Type     | Description              |
|-------------|----------|--------------------------|
| `url`  | `string` | 이미지 링크 |
```json
{
  "code":200,
  "message": "Image uploaded successfully",
  "url":"https://localhost:8080/post_data/files/${fileName}"

}
```

### Response (Error):
```json
{
    "code":400,
    "message":"No image uploaded."
}
{
    "code":400,
    "message":"Only image files are allowed."
}
{
    "code":404,
    "message":"school not found. pls update your school"
}
{
    "code":500,
    "message":"server error"
}
```

## File-Upload
- **Method**: POST
- **Endpoint**: /post_data/file_upload
- **Description**: 파일 업로드.
- **important** : JWT토큰 필요

### Request:
| Parameter | Type     | Description                               |
|-----------|----------|-------------------------------------------|
| `file`   | `file`   | The file to be uploaded (single file). |

#### Example
```js
import axios from 'axios';

async function uploadFile(token, file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('/post_data/file_upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('File uploaded:', response.data);
  } catch (error) {
    console.error('File upload failed:', error.response.data);
  }
}

```
### Response (Success):
| value   | Type     | Description              |
|-------------|----------|--------------------------|
| `url`  | `string` | 파일 링크 |
```json
{
  "code":200,
  "message": "Image uploaded successfully",
  "url":"https://localhost:8080/post_data/files/${fileName}"

}
```

### Response (Error):
```json
{
    "code": 400,
    "message": "No file uploaded."
}
{
    "code": 500,
    "message": "Failed to upload file."
}

```

## GET-FILE
- **Method**: GET
- **Endpoint**: /post_data/files/:fileName
- **Description**: 게시글 목록 조회.

### Request:
| Parameter | Type     | Description                               |
|-----------|----------|-------------------------------------------|
| `fileName`   | `string`   | 조회할 파일명 |

```
/post_data/files/a.png
```
### Response (Success):
| value   | Type     | Description              |
|-------------|----------|--------------------------|
| `file`  | `file` | 파일|

### Response (Error):
```json
{
    "code":404,
    "message":"File not found."
}
{
    "code":500,
    "message":"server error"
}
```


## GET-POSTS
- **Method**: GET
- **Endpoint**: /post_data/posts
- **Description**: 게시글 목록 조회.

### Request:
| Parameter | Type     | Description                               |
|-----------|----------|-------------------------------------------|
| `offset`   | `number`   | 조회를 시작할 오프셋 (기본값 0) |
| `limit` | `number` | 조회할 게시글의 수 (기본값 10) |
```json
{
    "offset":0,
    "limit":10
}
```

### Response (Success):
| value   | Type     | Description              |
|-------------|----------|--------------------------|
| `data`  | `postsdata[]` | 게시글을 담은 리스트. types/폴더 참고|
```json
{
  "code":200,
  "message": "load post success!",
  "data":postsdata[]

}
```

### Response (Error):
```json
{
    "code":400,
    "message":"invail url"
}
{
    "code":500,
    "message":"server error"
}
```

## Authentication

- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Description**: User login and token generation.

### Request:
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

### Response (Success):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

### Response (Error):
```json
{}
```



