# Issue Tracker

## User Stories

- Prevent cross site scripting(XSS attack).
- I can POST ``` /api/issues/{projectname} ``` with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
- The object saved (and returned) will include all of those fields (blank for optional no input) and also include created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id.
- I can PUT ``` /api/issues/{projectname} ``` with a _id and any fields in the object with a value to said object. Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. If no fields are sent return 'no updated field sent'.
- I can DELETE ``` /api/issues/{projectname} ``` with a _id to completely delete an issue. If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
- I can GET ``` /api/issues/{projectname} ``à for an array of all issues on that specific project with all the information for each issue as was returned when posted.
- I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false). I can pass along as many fields/values as I want.
- All 11 functional tests are complete and passing.

## Example Get Usage

```
/api/issues/{project}
/api/issues/{project}?open=true&assigned_to=Jasna
```

## Example return:

```javascript
{ 
  "_id":"5d77779ee7560b6e13bd3564",
  "issue_title":"Fix error in posting data",
  "issue_text":"When we post data it has an error.",
  "created_on":"2019-09-10 at 10h14",
  "updated_on":"2019-09-10 at 10h14",
  "created_by":"Jasna", "assigned_to":"Jasna",
  "open":true,
  "status_text":"In QA"}
}
```

## Live Preview

[https://mj-issue-tracker.herokuapp.com](https://mj-issue-tracker.herokuapp.com)