const LoadingSpinner: React.FC = () => (
  <div className="flex flex-grow items-center justify-center">
    <div
      className="text-secondary size-16 animate-spin rounded-full border-4 border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export default LoadingSpinner;
