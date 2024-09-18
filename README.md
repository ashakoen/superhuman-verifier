# Superhuman Verifier

Superhuman Verifier is a user-friendly, customizable human verification component for React applications. This innovative alternative to traditional CAPTCHAs uses interactive, time-based challenges to verify users, enhancing security while prioritizing user experience.


## Features

- Interactive, time-based verification process
- Customizable appearance and text
- Randomized verification time for enhanced security
- Easy integration with React applications
- Built with Next.js and TypeScript
- Fully responsive design

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Customization](#customization)
- [Backend Integration](#backend-integration)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install the Superhuman Verifier in your project, run:

```bash
npm install superhuman-verifier
# or
yarn add superhuman-verifier
```

## Usage

Here's a basic example of how to use the Superhuman Verifier in your React application:

```jsx
import { SuperhumanVerifier } from 'superhuman-verifier';

function MyComponent() {
  const handleVerificationComplete = (token) => {
    console.log('Verification complete:', token);
    // Handle the verification token (e.g., send it to your server)
  };

  return (
    <SuperhumanVerifier
      onVerificationComplete={handleVerificationComplete}
      size={200}
      timeRange={{ min: 2, max: 5 }}
    />
  );
}
```

## API

The SuperhumanVerifier component accepts the following props:

- `onVerificationComplete`: (required) Function called with the verification token when verification is complete.
- `verificationEndpoint`: (optional) The endpoint to call for server-side verification. Default: '/api/verify-superhuman'
- `size`: (optional) Size of the verification circle in pixels. Default: 64
- `colors`: (optional) Custom colors for various parts of the component.
- `texts`: (optional) Custom text for various parts of the component.
- `timeRange`: (optional) Min and max time (in seconds) for the verification process. Default: { min: 2, max: 5 }

## Customization

You can customize the appearance and behavior of the Superhuman Verifier:

```jsx
<SuperhumanVerifier
  onVerificationComplete={handleVerificationComplete}
  size={250}
  colors={{
    background: 'bg-purple-800',
    ring: 'bg-purple-700',
    progress: 'bg-pink-500',
    dot: 'bg-pink-500',
  }}
  texts={{
    title: 'Prove Your Superhuman Skills',
    instruction: 'Hold steady for 3 seconds to demonstrate your power',
    verified: 'You\'re Truly Superhuman!',
  }}
  timeRange={{ min: 3, max: 6 }}
/>
```

## Backend Integration

To integrate with your backend, you need to implement an API endpoint that verifies the user's interaction. Here's an example using Next.js API routes:

```typescript
import { NextApiRequest, NextApiResponse } from 'next'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { timestamp, verificationTime } = req.body

    // Implement your verification logic here
    const now = Date.now()
    const acceptableStartTime = now - verificationTime - 1000 // Allow 1 second of leeway
    const acceptableEndTime = now + 1000 // Allow 1 second of leeway

    if (timestamp < acceptableStartTime || timestamp > acceptableEndTime) {
      return res.status(400).json({ success: false, message: 'Verification failed' })
    }

    // Generate a JWT token
    const token = sign({ verified: true, timestamp }, JWT_SECRET, { expiresIn: '1h' })

    return res.status(200).json({ success: true, token })
  }

  res.setHeader('Allow', ['POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
```

## Development

To set up the project for development:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/superhuman-verifier.git
   cd superhuman-verifier
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Deployment

To deploy your Superhuman Verifier project to Vercel:

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and sign up or log in.
3. Click "New Project" and import your GitHub repository.
4. Configure your project settings if needed.
5. Add the `JWT_SECRET` environment variable in the Vercel dashboard.
6. Deploy your project.

For more detailed instructions, see the [Vercel documentation](https://vercel.com/docs).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.