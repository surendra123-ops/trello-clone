# Trello Clone - Full Stack Project Management Tool

A production-grade Kanban-style project management tool built with React, Node.js, Express, and PostgreSQL.

## 🚀 Features

### Core Features
- ✅ Board Management - Create and view boards with lists and cards
- ✅ List Management - Create, edit, delete, and reorder lists via drag & drop
- ✅ Card Management - Create, edit, delete, and move cards with drag & drop
- ✅ Card Details Modal with:
  - Labels (colored tags)
  - Member assignment
  - Due dates
  - Checklists with items
  - Description
- ✅ Search & Filter - Search cards by title, filter by labels, members, and due dates
- ✅ Responsive Design - Mobile, tablet, and desktop support

## 📋 Tech Stack

### Backend
- Node.js with Express.js
- PostgreSQL database
- Prisma ORM
- RESTful API architecture
- Proper error handling with status codes

### Frontend
- React 18
- Tailwind CSS for styling
- Context API for state management
- Axios for API requests
- React Beautiful DnD for drag & drop
- Lucide React for icons

## 🏗️ Project Structure

```
trello-clone/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env
```

## 🔧 Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/trello_clone?schema=public"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Replace `username` and `password` with your PostgreSQL credentials.

4. **Set up the database:**
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database
npm run prisma:seed
```

5. **Start the development server:**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

6. **Get your Board ID:**
After seeding, check the console output for the Board ID. You'll need this for the frontend.

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Update Board ID:**
Open `src/pages/Board.js` and update the `DEFAULT_BOARD_ID` constant with the Board ID from your seed output.

5. **Start the development server:**
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🗄️ Database Schema

The application uses the following database structure:

- **Board** - Contains lists
- **List** - Contains cards with position ordering
- **Card** - Main task entity with title, description, due date
- **Label** - Color-coded tags for cards
- **Member** - Users that can be assigned to cards
- **CardLabel** - Many-to-many relationship between cards and labels
- **CardMember** - Many-to-many relationship between cards and members
- **Checklist** - Belongs to a card
- **ChecklistItem** - Individual items in a checklist

## 📡 API Endpoints

### Boards
- `GET /api/boards/:id` - Get board with all lists and cards
- `POST /api/boards` - Create a new board

### Lists
- `POST /api/lists` - Create a list
- `PUT /api/lists/:id` - Update list title
- `DELETE /api/lists/:id` - Delete a list
- `PATCH /api/lists/reorder` - Reorder lists

### Cards
- `POST /api/cards` - Create a card
- `PUT /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card
- `PATCH /api/cards/reorder` - Reorder cards within a list
- `PATCH /api/cards/move` - Move card between lists
- `GET /api/cards/search?q=` - Search cards
- `GET /api/cards/filter?labels=&members=&due=` - Filter cards

### Card Details
- `POST /api/cards/:id/labels` - Add label to card
- `DELETE /api/cards/:id/labels/:labelId` - Remove label
- `POST /api/cards/:id/members` - Add member to card
- `DELETE /api/cards/:id/members/:memberId` - Remove member
- `POST /api/cards/:id/checklists` - Add checklist to card

### Checklists
- `POST /api/checklists/:id/items` - Add item to checklist
- `PATCH /api/checklists/items/:id` - Update checklist item
- `DELETE /api/checklists/items/:id` - Delete checklist item

### Labels & Members
- `GET /api/labels` - Get all labels
- `GET /api/members` - Get all members

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. **Create a new PostgreSQL database** on your hosting platform

2. **Set environment variables:**
```env
DATABASE_URL=<your-postgres-connection-string>
PORT=5000
NODE_ENV=production
FRONTEND_URL=<your-frontend-url>
```

3. **Build commands:**
```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm start
```

4. **Run seed (one-time):**
After deployment, run the seed script once via the platform's console:
```bash
npm run prisma:seed
```

### Frontend Deployment (Vercel/Netlify)

1. **Set environment variable:**
```env
REACT_APP_API_URL=<your-backend-url>/api
```

2. **Build commands:**
```bash
npm install
npm run build
```

3. **Update Board ID:**
After backend is deployed and seeded, update the `DEFAULT_BOARD_ID` in `src/pages/Board.js`

## 🎨 Usage Guide

### Creating Lists
Click "Add another list" button to create a new list on the board.

### Creating Cards
Click "+ Add a card" at the bottom of any list to create a new card.

### Drag & Drop
- Drag lists horizontally to reorder them
- Drag cards vertically within a list or across lists

### Card Details
Click on any card to open the modal where you can:
- Edit title and description
- Add/remove labels
- Assign/unassign members
- Set due dates
- Create checklists with items
- Delete the card

### Search & Filter
Use the search bar in the header to find cards by title.

## 🎯 Design Decisions & Assumptions

### Assumptions
1. **No Authentication**: As per requirements, assuming a default logged-in user
2. **Single Board**: Frontend defaults to one board (configurable via Board ID)
3. **Pre-seeded Data**: Labels and members are pre-seeded and not user-creatable through UI

### Architecture Decisions
1. **Prisma ORM**: Chosen for type safety and excellent PostgreSQL support
2. **Context API**: Sufficient for this application's state management needs
3. **React Beautiful DnD**: Industry standard for smooth drag-and-drop
4. **Service Layer**: Separates business logic from controllers for cleaner code
5. **Optimistic Updates**: UI updates immediately with rollback on error

### Trade-offs
1. **Single Board Focus**: Simplified UI at the cost of multi-board navigation
2. **In-Memory State**: Cards reload on major operations to ensure consistency
3. **No Real-time Updates**: WebSocket integration deferred for simplicity

## 🐛 Known Limitations

1. No real-time collaboration (multiple users don't see each other's changes live)
2. No file attachments on cards
3. No activity/comment history
4. No board templates
5. Search is case-insensitive but requires exact substring match

## 🔮 Future Enhancements

- WebSocket integration for real-time updates
- User authentication and authorization
- Multiple boards per user
- File attachments
- Activity logs and comments
- Board templates
- Advanced filtering options
- Email notifications
- Mobile app

## 📝 License

MIT License - feel free to use this project for learning or production.

## 🤝 Contributing

This is a demonstration project, but feel free to fork and extend it!

## 📧 Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ as a production-grade Trello clone