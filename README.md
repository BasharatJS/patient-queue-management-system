# Patient Queue Management System

A real-time hospital queue management system built with Next.js 15, Firebase, and Tailwind CSS. This system allows patients to book appointments, view queue status in real-time, and provides dashboards for doctors and receptionists.

## Features

- 🏥 **Patient Dashboard**: Guest login for patients to book appointments and track queue status
- 👨‍⚕️ **Doctor Dashboard**: Manage consultations and view patient queue
- 👩‍💼 **Receptionist Dashboard**: Manage patient registrations and queue
- 📺 **Public Display**: Real-time queue status for waiting area
- ⚡ **Real-time Updates**: Firebase real-time listeners for instant updates
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **Backend**: Firebase Firestore
- **State Management**: Zustand
- **Authentication**: Firebase Auth
- **Real-time**: Firebase real-time listeners

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd patient-queue-management-system
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Copy your Firebase configuration

### 3. Environment Configuration

Your `.env.local` file is already configured with Firebase credentials. Make sure it contains:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Initialize Firebase with Test Data

Run the setup script to populate Firebase with initial test data:

```bash
npm run setup-firebase
```

This will create:
- 6 sample doctors with different specializations
- 3 sample patients
- Sample appointments and queue items
- 1 receptionist user

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Application Routes

- **Home**: `/` - Role selection page
- **Patient Dashboard**: `/patient` - Guest login and appointment booking
- **Book Appointment**: `/patient/book-appointment` - Book new appointment
- **Queue Status**: `/patient/queue-status` - Real-time queue tracking
- **Public Display**: `/display` - Waiting area screen
- **Receptionist**: `/receptionist/login` - Receptionist login (coming soon)
- **Doctor**: `/doctor/login` - Doctor login (coming soon)

## How It Works

### For Patients
1. Visit `/patient` and enter your name and phone as a guest
2. Book an appointment by selecting a doctor and providing details
3. Get a queue number and track your position in real-time
4. View estimated wait times and current queue status

### Public Display (`/display`)
- Shows real-time queue status for all doctors
- Displays current number being served
- Shows waiting patients and their queue numbers
- Auto-refreshes with live Firebase data

### Real-time Features
- **Firebase Listeners**: All queue data updates in real-time
- **Automatic Refresh**: No manual refresh needed
- **Multi-doctor Support**: Handle queues for multiple doctors simultaneously
- **Status Tracking**: Track patients from waiting → current → completed

## Firebase Collections

### `doctors`
- Doctor information and availability status
- Specializations and current patient tracking

### `patients` 
- Patient records (guest and registered)
- Contact information and medical details

### `appointments`
- Appointment records linking patients and doctors
- Status tracking and queue numbers

### `queue`
- Real-time queue management
- Current status of each patient in queue

## Development

### Project Structure
```
src/
├── app/                 # Next.js 15 app directory
│   ├── patient/        # Patient dashboard pages
│   ├── doctor/         # Doctor dashboard pages  
│   ├── receptionist/   # Receptionist dashboard pages
│   └── display/        # Public display page
├── components/         # Reusable UI components
├── lib/
│   ├── firebase/      # Firebase services
│   ├── types/         # TypeScript type definitions
│   └── store/         # Zustand state management
└── scripts/           # Setup and utility scripts
```

### Key Firebase Services
- `lib/firebase/appointments.ts` - Appointment management
- `lib/firebase/queue.ts` - Queue operations and real-time listeners
- `lib/firebase/patients.ts` - Patient data management
- `lib/firebase/doctors.ts` - Doctor information and availability

## Next Steps

The patient dashboard is fully functional with real-time Firebase integration. Next phases:

1. **Receptionist Dashboard** - Queue management and patient registration
2. **Doctor Dashboard** - Patient consultation and queue control
3. **Authentication** - Secure login for doctors and receptionists
4. **Advanced Features** - Notifications, appointment scheduling, reports

## Troubleshooting

### Firebase Connection Issues
- Verify your `.env.local` file has correct Firebase credentials
- Check Firebase project settings and ensure Firestore is enabled
- Run `npm run setup-firebase` to populate initial data

### Real-time Updates Not Working
- Check browser console for Firebase errors
- Ensure Firestore security rules allow read/write access
- Verify internet connection for Firebase real-time listeners

### Build Issues
- Run `npm run build` to check for TypeScript errors
- Ensure all imports are correct and files exist
- Check Firebase configuration is properly set up

## License

This project is licensed under the MIT License.
