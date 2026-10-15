# FF Like Hub — Website + API

This package combines a responsive website (`index.html`) with the provided Free Fire likes API. The website calls the same-origin routes `/api/health`, `/api/regions`, and `/api/like`.

## Deploy on Vercel (from an Android phone)

1. Extract this ZIP on your device, or upload the ZIP to a GitHub repository after extracting it.
2. Sign in to GitHub and create a **new repository**. Upload all files/folders from this project (the contents, not a ZIP nested inside the repository).
3. Open Vercel and choose **Add New → Project**, then import that GitHub repository.
4. Keep the included `vercel.json` configuration and deploy.
5. Open the deployed website. The API status should show **Backend reachable** if deployment succeeded.
6. Test `/api/health` and `/api/regions` on your deployed domain. Then submit a UID you own or are permitted to test.

## Important notes

- This project is not deployed yet by generating this ZIP. You must deploy it to Vercel to get a public website URL.
- The API is third-party/community code and is not an official Garena service. Its ability to send likes depends on the upstream library/service and may stop working.
- The API currently caps the requested count at 40 per request. Avoid repeated or excessive requests.
- Do not enter or store game passwords, session cookies, or personal account credentials.
- Review the included `LICENSE` and API dependency before public launch. Add stronger abuse protection before sharing widely.
- The API may return errors even if the website is loading correctly; a reachable health endpoint does not prove likes can be sent successfully.
