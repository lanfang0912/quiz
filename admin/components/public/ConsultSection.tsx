export function ConsultSection({ scripts }: { scripts: string[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 text-center">學員說</h2>
      {scripts.map((text, i) => (
        <blockquote
          key={i}
          className="bg-gray-50 border-l-4 border-blue-400 rounded-r-xl px-5 py-4
                     text-sm text-gray-700 leading-relaxed whitespace-pre-line"
        >
          {text}
        </blockquote>
      ))}
    </div>
  );
}
