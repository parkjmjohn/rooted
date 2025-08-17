# Navigation Structure

This app uses Expo Router for navigation with the following structure:

## File Structure

```
app/
├── index.tsx          # Root index - handles auth redirects
├── auth.tsx           # Authentication screen
└── (tabs)/            # Tab navigation group
    ├── _layout.tsx    # Tab layout configuration
    ├── discovery.tsx  # Discovery tab - find classes
    ├── my-classes.tsx # My Classes tab - upcoming/past classes
    ├── messaging.tsx  # Messaging tab - send/receive messages
    └── profile.tsx    # Profile tab - user account management
```

## Navigation Flow

1. **App Launch**: `index.tsx` checks authentication status
2. **If Not Authenticated**: Redirects to `auth.tsx`
3. **If Authenticated**: Redirects to `(tabs)/discovery.tsx`
4. **Tab Navigation**: Users can switch between 4 tabs:
   - **Discovery**: Find and book classes
   - **My Classes**: View upcoming and past classes
   - **Messages**: Send and receive messages
   - **Profile**: Manage account settings

## Features

- **Bottom Tab Navigation**: 4 tabs with icons and labels
- **Authentication Flow**: Automatic redirects based on auth state
- **Responsive Design**: Adapts to light/dark mode
- **Safe Area Handling**: Proper spacing for different devices

## Current Status

- ✅ Navigation structure implemented
- ✅ Authentication flow working
- ✅ Tab navigation with icons
- ⏳ Discovery page (empty placeholder)
- ⏳ My Classes page (empty placeholder)
- ⏳ Messaging page (empty placeholder)
- ✅ Profile page (using existing Account.tsx code)

## Next Steps

1. Implement the Discovery page with class search and booking
2. Build the My Classes page with upcoming/past class lists
3. Create the Messaging page with chat functionality
4. Add real data integration with your backend
