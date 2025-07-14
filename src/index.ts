import { JiraMCPServer } from "./server/mcp-server.js";

// Ejecutar servidor
const server = new JiraMCPServer();
server.run().catch(console.error);
