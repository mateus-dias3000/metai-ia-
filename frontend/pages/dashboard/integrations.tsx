import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function Integrations() {
  const { data: session } = useSession();
  const [integrations, setIntegrations] = useState({
    whatsapp: false,
    gmail: false,
    github: false,
  });

  const toggleIntegration = async (service: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/integrations/toggle`,
        { service, userId: session?.user?.id },
        { headers: { Authorization: `Bearer ${session?.accessToken}` } }
      );
      setIntegrations(response.data);
    } catch (error) {
      console.error("Erro ao alternar integração:", error);
    }
  };

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/integrations?userId=${session?.user?.id}`,
          { headers: { Authorization: `Bearer ${session?.accessToken}` } }
        );
        setIntegrations(response.data);
      } catch (error) {
        console.error("Erro ao buscar integrações:", error);
      }
    };
    if (session) fetchIntegrations();
  }, [session]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Integrações</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(integrations).map(([service, isActive]) => (
          <div key={service} className="border p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="capitalize font-semibold">{service}</h2>
                <p className="text-sm text-gray-500">
                  {isActive ? "Conectado" : "Desconectado"}
                </p>
              </div>
              <button
                onClick={() => toggleIntegration(service)}
                className={`px-4 py-2 rounded-md ${
                  isActive ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
              >
                {isActive ? "Desconectar" : "Conectar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
