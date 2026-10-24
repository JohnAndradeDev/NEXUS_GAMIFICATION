const AVATAR_SIZE = 160; // px (o modal mostra 80px; 160 cobre telas retina)
const MAX_FILE_BYTES = 8 * 1024 * 1024;
// Limite do data URL enviado. O backend aceita até 60.000; aqui fica abaixo.
const MAX_DATA_URL_CHARS = 45_000;

/**
 * Recorta a imagem em quadrado (centralizado), reduz para 160x160 e devolve um
 * data URL JPEG pequeno (tipicamente 6-15 KB), pronto para guardar em `avatarUrl`.
 */
export async function fileToAvatarDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Escolha um arquivo de imagem.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("A imagem deve ter no máximo 8 MB.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Não foi possível ler essa imagem. Use JPG, PNG ou WebP.");
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = AVATAR_SIZE;
    canvas.height = AVATAR_SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Seu navegador não conseguiu processar a imagem.");

    // fundo branco: PNG com transparência não vira preto no JPEG
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    ctx.imageSmoothingQuality = "high";

    const side = Math.min(bitmap.width, bitmap.height);
    const sx = (bitmap.width - side) / 2;
    const sy = (bitmap.height - side) / 2;
    ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);

    for (const quality of [0.85, 0.7, 0.55, 0.4]) {
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      if (dataUrl.length <= MAX_DATA_URL_CHARS) return dataUrl;
    }
    throw new Error("Não foi possível reduzir essa imagem. Tente outra.");
  } finally {
    bitmap.close();
  }
}
