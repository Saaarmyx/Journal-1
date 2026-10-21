// Personaliza esta lista para definir diarios y sus tomos.
// El contenido de cada tomo vive en su propio directorio de Markdown.
export const journalConfig = {
  defaultJournalId: 'saaarmyx',
  journals: [
    {
      id: 'saaarmyx',
      title: 'Journal #1',
      author: 'Saaarmyx',
      description: 'Un diario personal, página a página.',
      defaultVolumeId: '01',
      volumes: [
        {
          id: '01',
          title: 'Journal 1',
          contentDirectory: 'pages',
          cover: '/portada.png',
          coverAlt: 'Portada ilustrada del diario',
          storageKey: 'journal-current-page',
        },
      ],
    },
  ],
}
