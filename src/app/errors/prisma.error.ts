export default function handlePrismaError(error: any) {
  if (error.code === "P2002") {
    const uniqueFields = error.meta.target
      .filter((target: string) => target !== "userId")
      .join(", ");
    error.message = `You can't create a new ${error.meta.modelName} with the same ${uniqueFields} as an existing ${error.meta.modelName}`;
  }
  return error;
}
