export const Header = ({ onToggleTheme }) => (
  <header className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-semibold">Workspace Dashboard</h2>
    <button onClick={onToggleTheme} className="px-4 py-2 rounded-xl bg-primary text-white">Toggle Theme</button>
  </header>
);
