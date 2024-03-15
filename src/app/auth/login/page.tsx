import { signInWithGithub, signInWithGoogle } from "@/features/auth";

export default function LoginPage() {
  return (
    <>
      <form>
        <button formAction={signInWithGithub}>Log in with GitHub</button>
        <button formAction={signInWithGoogle}>Log in with Google</button>
      </form>
    </>
  );
}
