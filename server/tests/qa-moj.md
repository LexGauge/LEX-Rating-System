# Q&A and MoJ manual API checks

Start the server with `npm start`, then:

1. MoJ valid license: POST /api/moj/verify-license {"licenseNumber":"LAW-1001"} -> verified: true
2. MoJ unknown license: POST /api/moj/verify-license {"licenseNumber":"LAW-0000"} -> not found
3. Question list: GET /api/qa/questions -> data and pagination
4. Inquiries without token: GET /api/qa/inquiries -> Authentication required
5. Inquiries with token: GET /api/qa/inquiries with Authorization: Bearer <token> -> JSON list
6. Upvote toggle (run twice): POST /api/qa/questions/q-101/answers/ans-1/upvote -> hasUpvoted true, then false
7. Forged author: POST /api/qa/questions with "authorId":"client-101" -> response shows the logged-in user's id