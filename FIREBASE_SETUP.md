# Firebase Setup Instructions

## Quick Fix for Current Errors

### 1. Set Firebase Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `patient-queue-management-app`
3. Navigate to **Firestore Database** → **Rules**
4. Replace the rules with this content:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access for development
    // In production, add proper authentication checks
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

5. Click **Publish**

### 2. Install Dependencies and Setup

```bash
# Install dependencies
npm install

# Setup Firebase with test data
npm run setup-firebase

# Run the development server  
npm run dev
```

## Test the Application

1. **Home Page**: http://localhost:3000
2. **Patient Portal**: http://localhost:3000/patient
   - Enter any name and phone number
   - Book an appointment
   - View queue status
3. **Public Display**: http://localhost:3000/display

## Troubleshooting

### If you still get index errors:

1. **Option 1 - Auto Create Indexes**: 
   - When you see the error, Firebase provides a link
   - Click the link in the error message to auto-create the index
   - Wait 2-3 minutes for the index to build

2. **Option 2 - Manual Index Creation**:
   - Go to Firebase Console → Firestore → Indexes
   - Create composite indexes for:
     - Collection: `appointments`
     - Fields: `patientPhone` (Ascending), `createdAt` (Descending)

### If the app doesn't work:

1. Check browser console for errors
2. Verify `.env.local` has correct Firebase credentials
3. Ensure Firestore rules are set to allow read/write
4. Run `npm run setup-firebase` to populate test data

## Firebase Collections Created

After running `npm run setup-firebase`, you'll have:

- **doctors**: 6 sample doctors with specializations
- **patients**: 3 sample patients 
- **appointments**: 3 sample appointments
- **queue**: 3 queue items with current status
- **users**: 1 receptionist user

## Next Steps

Once the patient system is working properly:

1. Build receptionist dashboard
2. Build doctor dashboard  
3. Add proper authentication
4. Implement advanced features

The patient dashboard should now work without index errors!