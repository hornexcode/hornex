const TournamentCardBadge = ({ text }: { text: string }) => {
  return (
    <span className="rounded bg-slate-700 px-3 py-1 text-xs ring-1 ring-slate-500">
      {text}
    </span>
  );
};

export default TournamentCardBadge;
