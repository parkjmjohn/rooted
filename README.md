# Rooted 🌱

A React Native mobile application with Supabase backend integration, featuring user authentication and profile management.

## Features

- 🔐 **User Authentication** - Sign up, sign in, and sign out
- 👤 **Profile Management** - Update username, website, and avatar
- 📱 **Cross-platform** - Works on iOS and Android
- 🎨 **Modern UI** - Built with React Native Elements
- 🔒 **Secure Storage** - Encrypted local storage with Supabase
- 🖼️ **Avatar Upload** - Image picker with Supabase storage

## Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Supabase (Auth, Database, Storage)
- **UI Components**: @rneui/themed
- **Language**: TypeScript
- **Code Quality**: ESLint + Prettier + Husky

## Prerequisites

- Node.js 18+ and Yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Emulator
- Supabase account and project

## Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd rooted
yarn install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env

# Edit with your Supabase credentials
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Storage** → **Create bucket** named `avatars`
3. Set bucket to **Public**
4. Copy your project URL and anon key to `.env`

### 4. Run the App

```bash
# Start development server
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android
```

## Development

### Code Quality

```bash
# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn format

# Check formatting
yarn format:check

# Type checking
yarn type-check
```

### Pre-commit Hooks

The project uses Husky with pre-commit hooks that automatically:

- Run ESLint on staged files
- Format code with Prettier
- Ensure code quality before commits

### Project Structure

```
rooted/
├── components/          # React components
│   ├── Auth.tsx       # Authentication forms
│   ├── Account.tsx    # User profile management
│   └── Avatar.tsx     # Avatar upload component
├── lib/               # Configuration files
│   └── supabase.ts   # Supabase client setup
├── supabase/          # Database migrations
├── types/             # TypeScript declarations
└── assets/            # App icons and images
```

## Building for Production

```bash
# Generate native code
npx expo prebuild

# Build for iOS
npx expo run:ios

# Build for Android
npx expo run:android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `yarn lint` and `yarn format:check`
5. Commit with a descriptive message
6. Push and create a pull request

## License

MIT License - see LICENSE file for details
