export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  date: string;
}

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Bienvenido a GrantFox",
    description: "Gracias por unirte a nuestra plataforma.",
    type: "success",
    read: false,
    date: "2024-07-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Nuevo pago recibido",
    description: "Has recibido un nuevo pago en tu cuenta.",
    type: "info",
    read: false,
    date: "2024-07-02T12:30:00Z",
  },
  {
    id: "3",
    title: "Actualización de seguridad",
    description: "Por favor, actualiza tu contraseña para mayor seguridad.",
    type: "warning",
    read: true,
    date: "2024-07-03T09:15:00Z",
  },
  {
    id: "4",
    title: "Error en la transacción",
    description: "Hubo un error al procesar tu último pago.",
    type: "error",
    read: true,
    date: "2024-07-04T14:45:00Z",
  },
];
