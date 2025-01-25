import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: "src/app/api",
        definition: {
            openapi: "3.0.0",
            info: {
                title: "StonePriceCalculator API",
                version: "1.0",
            },
            security: [],
        },
        apis: ["src/app/api/**/*.ts", "src/types.ts"], // Include both API route files and type definitions
    });
    return spec;
};