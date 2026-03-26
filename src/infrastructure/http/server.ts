import { createApp } from './app';

const PORT = Number(process.env.PORT) || 3000;

export const startServer = (): void => {
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};
