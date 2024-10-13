// client/src/components/Signup.tsx
import { signupWithGoogle } from '../api/authService';

const Signup = () => {
  const handleSignup = () => {
    signupWithGoogle();
  };

  return (
    <div>
      <h1>Signup</h1>
      <button onClick={handleSignup}>Sign up with Google</button>
    </div>
  );
};

export default Signup;
