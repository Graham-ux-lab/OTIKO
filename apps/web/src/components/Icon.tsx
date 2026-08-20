type IconName = 'ticket' | 'shield' | 'qr' | 'mail' | 'lock' | 'eye' | 'search' | 'pin' | 'calendar' | 'arrow' | 'music' | 'laptop' | 'comedy' | 'sport' | 'party' | 'theatre' | 'chart' | 'tools' | 'family';

const paths: Record<IconName, string> = {
  ticket: 'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V7Z M9 8v8',
  shield: 'M12 3 4 7v5c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V7l-8-4Z M9 12l2 2 4-4',
  qr: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h2v2h-2v-2Zm4 0h2v6h-6v-2h4v-4Z',
  mail: 'M4 6h16v12H4V6Zm0 1 8 6 8-6',
  lock: 'M6 10h12v10H6V10Zm3 0V7a3 3 0 0 1 6 0v3',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  search: 'm21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z',
  pin: 'M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  calendar: 'M5 4v3m14-3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z',
  arrow: 'M5 12h14m-6-6 6 6-6 6', music: 'M9 18V6l10-2v12M9 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z', laptop: 'M4 6h16v10H4V6Zm-2 12h20', comedy: 'M8 14s1.5 2 4 2 4-2 4-2M8 9h.01M16 9h.01M4 12a8 8 0 1 0 16 0', sport: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-6 5 3 2 3-2 3 2 3-2M6 16l3-2 3 3 3-3 3 2', party: 'm5 19 9-9m-6-6 12 12M15 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3', theatre: 'M4 5h16v12H4V5Zm4 4h.01M16 9h.01M8 13c2 1 6 1 8 0', chart: 'M4 20V10m6 10V4m6 16v-7m4 7V7', tools: 'm14 7 3-3 3 3-3 3m-8 2L4 17l3 3 5-5', family: 'M8 21v-6a4 4 0 0 1 8 0v6M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
};

export function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><path d={paths[name]} /></svg>;
}
