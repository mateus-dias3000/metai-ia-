import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">MetaIA</h1>
        <p className="text-center mb-6">
          Escolha seu plano e conecte-se a WhatsApp, Gmail, GitHub e muito mais!
        </p>
        <div className="flex justify-center">
          {!session ? (
            <button
              onClick={() => signIn("github")}
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              Login com GitHub
            </button>
          ) : (
            <div>
              <p>Olá, {session.user?.name}!</p>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
