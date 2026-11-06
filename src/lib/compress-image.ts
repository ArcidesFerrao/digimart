import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<File> {
  // Não mexer em GIFs (perdem animação) nem em ficheiros que não são imagem
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;

  try {
    const blob = await imageCompression(file, {
      maxWidthOrHeight: 1200,   // lado maior no máximo 1200px
      maxSizeMB: 0.3,           // alvo: ~300 KB
      fileType: "image/webp",
      useWebWorker: true,
    });

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp" });
  } catch {
    return file; // se falhar, envia o original
  }
}