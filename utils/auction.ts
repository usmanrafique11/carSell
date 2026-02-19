export function parseAuctionDateTime(value: string): Date | null {
  const [datePart, timePart] = value.split(' ');
  if (!datePart || !timePart) return null;

  const [y, m, d] = datePart.split('/').map(Number);
  const [hh, mm, ss] = timePart.split(':').map(Number);

  if (!y || !m || !d || hh == null || mm == null || ss == null) return null;
  return new Date(y, m - 1, d, hh, mm, ss);
}

export function formatTimeUntilAuction(auctionDateTime: string, now: Date): string {
  const auctionDate = parseAuctionDateTime(auctionDateTime);
  if (!auctionDate) return 'Unknown auction time';

  const diffMs = auctionDate.getTime() - now.getTime();
  if (diffMs <= 0) return 'Auction started';

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  return `${days}d ${hours}h`;
}

