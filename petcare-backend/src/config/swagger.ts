import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PetCareApp API 🐾",
      version: "1.0.0",
      description: "API para la aplicación móvil PetCareApp. Incluye endpoints de autenticación, usuarios y mascotas.",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // rutas donde buscar la documentación
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;
