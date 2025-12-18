// src/content/config.ts
import { defineCollection, z, reference } from 'astro:content';

// Létrehozunk egy 'blog' nevű kollekciót a bejegyzéseknek
const blogCollection = defineCollection({
  type: 'content', 
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    // JAVÍTVA: Az 'image()' segédfüggvény használata az optimalizáláshoz
    heroImage: image(), 
    tags: z.array(z.string()),
    author: z.string().default('Prometheus Digital'),
  }),
});

// Exportáljuk a kollekciókat, hogy az Astro tudja használni
export const collections = {
  'blog': blogCollection,
};

