# URL Shortener Setup Guide

This is a comprehensive URL shortener application built with React, Supabase, and QR code generation.

## Features

- ✅ URL shortening with custom aliases
- ✅ QR code generation for every shortened URL
- ✅ Click tracking and analytics
- ✅ URL management dashboard
- ✅ Responsive design
- ✅ Real-time database integration

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

BASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema

Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the SQL

This will create:
- `urls` table with proper indexes
- Row Level Security (RLS) policies
- Automatic user_id assignment for authenticated users

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Shortening URLs

1. Enter a long URL in the input field
2. Optionally add a custom alias
3. Click "Shorten URL"
4. Copy the generated short URL or download the QR code

### Managing URLs

1. Navigate to the "Manage URLs" tab
2. View all your shortened URLs
3. See click statistics
4. Delete unwanted URLs
5. Generate QR codes for existing URLs

### URL Redirects

Short URLs follow the pattern: `yourdomain.com/r/{shortCode}`

When someone visits a short URL, they will be automatically redirected to the original URL and the click count will be incremented.

## Project Structure

```
src/
├── Components/
│   ├── UrlShortener.jsx    # Main URL shortening component
│   ├── UrlManager.jsx      # URL management dashboard
│   └── ui/                 # Reusable UI components
├── pages/
│   ├── Home.jsx           # Landing page
│   ├── Links.jsx          # URL shortening page
│   └── Redirect.jsx       # URL redirect handler
├── db/
│   └── supabase.js        # Supabase client configuration
└── App.jsx                # Main app with routing
```

## Database Schema

The `urls` table contains:
- `id`: Primary key
- `long_url`: Original URL
- `short_code`: Unique short identifier
- `created_at`: Creation timestamp
- `clicks`: Click counter
- `user_id`: Associated user (for authenticated users)

## Security Features

- Row Level Security (RLS) enabled
- Public read access for redirects
- Authenticated users can create URLs
- Users can only modify their own URLs

## Customization

### Styling
The app uses Tailwind CSS for styling. Modify the classes in components to change the appearance.

### Short Code Generation
Modify the `generateShortCode()` function in `UrlShortener.jsx` to change the short code format.

### QR Code Settings
Adjust QR code size and styling in the QRCode components throughout the app.

## Troubleshooting

### Common Issues

1. **Supabase connection errors**: Check your environment variables
2. **Database permission errors**: Ensure RLS policies are set up correctly
3. **QR code not displaying**: Check if the QR code library is properly installed

### Environment Variables

Make sure your `.env.local` file contains:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
