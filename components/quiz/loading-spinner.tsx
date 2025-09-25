export function LoadingSpinner() {
  return (
    <div className="gradient-bg flex items-center justify-center min-h-screen">
      <div className="text-white text-center space-y-6">
        <div className="text-6xl animate-spin">⭐</div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "Kalam, cursive" }}>
          Cargando...
        </h2>
        <p className="text-lg" style={{ fontFamily: "Kalam, cursive" }}>
          Preparando tu quiz
        </p>
      </div>
    </div>
  )
}
