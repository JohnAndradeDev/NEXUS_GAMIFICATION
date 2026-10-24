const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export interface FieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  errors?: FieldError[];

  constructor(status: number, message: string, errors?: FieldError[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

// Chamado quando uma rota protegida responde 401 (sessão expirada ou inválida).
// O AuthProvider registra aqui a função que limpa o usuário e volta ao login.
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

// Nestas rotas o 401 é esperado (senha errada no login etc.) e não significa
// "sessão expirada". O /auth/me fica de fora da lista de propósito: se a sessão
// vence e o refreshUser recebe 401, o usuário também volta ao login.
const UNAUTHORIZED_IGNORED = ["/auth/login", "/auth/register", "/auth/logout"];

interface ApiOptions extends Omit<RequestInit, "body"> {
  json?: unknown;
}

export async function api<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { json, headers, ...rest } = options;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      credentials: "include", // envia e recebe o cookie HttpOnly
      headers: {
        ...(json !== undefined && { "Content-Type": "application/json" }),
        ...headers,
      },
      body: json !== undefined ? JSON.stringify(json) : undefined,
    });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor");
  }

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (
      response.status === 401 &&
      !UNAUTHORIZED_IGNORED.some((p) => path.startsWith(p))
    ) {
      onUnauthorized?.();
      throw new ApiError(401, "Sua sessão expirou. Faça login novamente.");
    }

    throw new ApiError(
      response.status,
      data?.message ?? "Erro inesperado",
      data?.errors,
    );
  }

  return data as T;
}
