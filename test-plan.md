# FE Testing

## Authentication & User Management
1. Users can log in with email and password
2. Users can log out and session is cleared
3. Parent users can create subusers with username and password
4. Parent users can delete subusers
7. Subusers can log in using parent email, password, and their username
8. Subusers can log in from the parent user account
8. Current user state is properly managed and displayed throughout app

## Subuser Management
9. Subusers page only shows for parent users (not subusers)
10. Subusers list displays all created subusers
11. "Create subuser" form creates new subusers successfully
12. Edit subuser modal opens when clicking "Manage" button
13. Group selection in edit modal shows current subuser groups pre-selected
14. Group changes save correctly when updating subuser
15. Delete confirmation appears when deleting subuser
16. Subuser deletion removes them from the list

## User Switching
17. Switch user icon appears in header for parent users only
18. Switch user modal shows current user and all subusers
19. Current user is highlighted and non-clickable in switch modal
20. Clicking a subuser switches to that account
21. User context updates throughout entire application after switch
22. Success message appears when switching users
23. Modal closes after user selection
24. Switch user icon disappears when logged in as subuser

## Responsive Design & UI
25. Subusers page layout works on mobile and desktop
26. Subuser list displays as vertical list with proper spacing
27. Create subuser form positioned side-by-side on desktop
28. Switch user modal is properly sized and centered
29. All buttons and interactions have proper hover states
30. Tooltips display correctly for header icons

## Error Handling
31. Error messages show for failed subuser creation
32. Error messages show for failed subuser deletion
33. Error messages show for failed group updates
34. Error messages show for failed user switching
35. Invalid login attempts show appropriate errors
36. Network errors are handled gracefully

## State Management
37. Global subuser state updates when subusers are created/deleted
38. User state updates correctly when switching between accounts
39. Group selection state persists correctly in edit modal
40. Authentication state is properly maintained across user switches

# BE Testing

## Authentication Endpoints
1. POST /auth/login - Standard login with email/password
2. POST /auth/login - Subuser login with email/password/username
3. POST /auth/switchUser - Switch to subuser account
4. POST /auth/logout - Logout and clear session

## Subuser Management Endpoints
5. GET /users/subusers - Fetch all subusers for current user
6. POST /users/subuser - Create new subuser
7. DELETE /users/subuser/:id - Delete specific subuser
8. PUT /users/subuser/:id/groups - Update subuser group assignments

## Data Validation
9. Subuser creation validates required fields
10. Username uniqueness is enforced within parent account
11. Group IDs are validated when updating subuser groups
12. Parent user permissions are verified for all subuser operations
13. Authentication tokens are properly validated for all requests

## Permission & Security
14. Only parent users can create/manage subusers
15. Subusers cannot create their own subusers
16. Parent users can only manage their own subusers
17. Group assignment permissions are properly enforced
18. Switch user only works from parent to subuser (not reverse)
19. JWT tokens are properly issued and validated
20. Session data is correctly updated during user switching
