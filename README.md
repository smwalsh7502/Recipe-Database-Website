<img width="780" alt="Screenshot 2024-01-04 123853" src="https://github.com/smwalsh7502/Recipe-Database-Website/assets/90478060/8870aee4-8293-4a2c-adf6-3b7b90e631df">

## Purpose
I love to cook! I wanted to create a website where I could store all my recipes. I also wanted to practice creating a full stack application with a server side database and a professional and user-friendly front end.

https://github.com/smwalsh7502/Recipe-Database-Website/assets/90478060/0629efe3-1fdf-43ea-bc1f-9b8c65eb41b9

## Project Goals
- UI/UX focus
- Prioritized Reusability and Dynamic Components
- Basic Stack

## Stack
- MySQL
- Express
- React
- Node.js
- Other (Tailwind CSS, Bcryptjs, JSONWebToken, Multer)

## Database Diagram
<img width="655" alt="Screenshot 2024-01-04 124514" src="https://github.com/smwalsh7502/Recipe-Database-Website/assets/90478060/a696e6a0-a455-41df-b8b3-f7a7b8f830e4">

## Dynamic Component Example
<img width="259" alt="Screenshot 2024-01-04 124547" src="https://github.com/smwalsh7502/Recipe-Database-Website/assets/90478060/794058b5-33e8-49ba-8aff-2aa3949d1b3b">
<img width="244" alt="Screenshot 2024-01-04 124621" src="https://github.com/smwalsh7502/Recipe-Database-Website/assets/90478060/de70b6db-33d8-4bad-aed0-3a3dddddf941">

## Most challenging part
The multipart "add recipe" form page was very complicated. It required me to keep track of all the data and make sure each request was sent and handled properly. The Add/Remove Ingredient row functionality also increased the difficulty.

## What I would do differently next time
- Store uploaded images in a cloud-based server like Amazon S3
  - Better scalability, less memory usage, faster
- Add controllers for request handling
  - My "controllers" were built into each component
  - I should have instead had each component only handle the "looks"
- State Management Library/State Alternative (React Contexts, Redux, Recoil, etc.)
  - I used state hooks but it would have saved time to use a global state manager or alternative
- Use a React UI component library (React Bootstrap, MUI, etc.)
  - I spent a lot of time making my own components, but I learned how to use tailwind well
 
## Future project goals
- "Forgot Password" functionality
- Recipe editing page
- User comments/likes on recipes
  - "Like" button functionality
  - Adding "liked" recipes to a user profile
  - Tracking how many "likes" a recipe gets
  - Showing "most popular" on front page
- Recipe tags (ex. Italian, Dessert, Gluten-free, Vegan, etc.)
- Search bar functionality
  - Search by recipe name, recipe tags, serving size, prep time, cook time, ingredients, etc.






