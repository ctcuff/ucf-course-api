# UCF Course API

An unofficial API to access a list of courses offered by UCF, along with a list of sections in that course. Due to the limitations of how UCF's course data can be accessed, this API is currently only able to return data for the current term plus two terms in the future. For example, if the current term is summer 2021, then this API will **ONLY** be able to return data from summer 2021, fall 2021, and spring 2022. It's currently **NOT** possible for the API to return data from past semesters. As for another limitation, the data returned by this API may not be an exact representation of what classes you could find by searching myUCF.

## How To Run This Project

1. `yarn` - To install dependencies
2. `yarn dev` - To run the server

## Running Tests

To make sure tests work properly, `generate-html.py` should be run once before running `yarn test`. This ensures that each HTML file is up to date. All tests that make `GET` requests read from these HTML files to avoid having to request content from UCF's course site numerous times.

## How Do Terms Work?

UCF numbers terms with 4 digits going up by 10.

```
Spring 2021 => 1710
Summer 2021 => 1720
Fall 2021 => 17230
--- lots of terms later ---
Spring 2048 => 2520
```

`/catalog` and `/detail` each take a `?term=[code]` parameter. That term corresponds to the term code used by UCF to search for courses. This code can either be a 4 digit string, or the semester followed by the year. For example: `/catalog/COP?term=1710` and `/catalog/COP?term=spring2021` mean the same thing. Note that only `spring`, `summer`, and `fall` are valid. If a route is called but `?term` isn't provided, the API will default to the current term.

## Available Routes

| Route      | Method | Description                                  |
| ---------- | ------ | -------------------------------------------- |
| `/catalog` | `GET`  | Returns a list of all courses offered by UCF |

#### Example response from `/catalog`:

```js
[
   {
      "prefix": "ACG",
      "title": "Accounting General"
   },
   {
      "prefix": "ADE",
      "title": "Adult Education"
   },
   {
      "prefix": "ADV",
      "title": "Advertising"
   },
   {
      "prefix": "AFA",
      "title": "African American Studies"
   },
   { ... }
]
```

| Route            | Method | Description                                             |
| ---------------- | ------ | ------------------------------------------------------- |
| `/catalog/:area` | `GET`  | Returns a list of all courses under the specified area. |

#### Example response from `/catalog/ENC`:

```js
[
   {
      "prefix": "ENC 1101",
      "title": "Composition I",
      "description": "ENC 1101 CAH-WRITE & RHET 3(3,0) Composition I: Expository writing with emphasis on effective communication and critical thinking. Emphasizing the writing process writing topics are based on selected readings and on student experiences. The NC grading policy applies to this course. Fall, Spring."
   },
   {
      "prefix": "ENC 1102",
      "title": "Composition II",
      "description": "ENC 1102 CAH-WRITE RHET 3(3,0) Composition II: PR: ENC 1101 with a grade of C- or better. Focus on extensive research in analytical and argumentative writing based on a variety of readings from the humanities. Emphasis on developing critical thinking and diversity of perspective. The NC grading policy applies to this course. Fall, Spring."
   },
   { ... }
]
```

| Route             | Method | Description                                                                                   |
| ----------------- | ------ | --------------------------------------------------------------------------------------------- |
| `/detail/:course` | `GET`  | Returns information about the specified course along with a list of sections for that course. |

#### Example response from `/detail/ENC1101`:

```js
{
   "course": "ENC 1101",
   "courseName": "Composition I",
   "description": "ENC 1101 CAH-WRITE & RHET 3(3,0) Composition I: Expository writing with emphasis on effective communication and critical thinking. Emphasizing the writing process writing topics are based on selected readings and on student experiences. The NC grading policy applies to this course. Fall, Spring.",
   "sections": [
      {
         "id": "A601",
         "begin": "2021-05-17",
         "end": "2021-06-26",
         "schedule": "MTWTh 12:00PM-01:50PM",
         "building": "NICHOLSON SCHOOL COMMUNICATION",
         "room": "NSC O111",
         "instructor": "Heather Vazquez"
      },
      { ... }
   ]
}
```

| Route                                 | Method | Description                                                        |
| ------------------------------------- | ------ | ------------------------------------------------------------------ |
| `/detail/:course/sections/:sectionId` | `GET`  | Returns the section with id `:sectionId` from the specified course |

#### Example response from `/detail/ENC1101/sections/A601`:

```js
{
   "id": "A601",
   "begin": "2021-05-17",
   "end": "2021-06-26",
   "schedule": "MTWTh 12:00PM-01:50PM",
   "building": "NICHOLSON SCHOOL COMMUNICATION",
   "room": "NSC O111",
   "instructor": "Heather Vazquez"
}
```
